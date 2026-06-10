import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { PerpsExecutor } from '../services/perpsExecutor';
import { TradingSignalAnalyzer } from '../services/signalAnalyzer';
import { TradeDatabase } from '../services/tradeDatabase';
import axios from 'axios';

const perpsExecutor = new PerpsExecutor();
const signalAnalyzer = new TradingSignalAnalyzer();
const tradeDb = new TradeDatabase();

const CMC_API_KEY = process.env.CMC_API_KEY || '';
const CMC_API_URL = 'https://pro-api.coinmarketcap.com/v2';

const cmcClient = axios.create({
  baseURL: CMC_API_URL,
  headers: {
    'X-CMC_PRO_API_KEY': CMC_API_KEY,
  },
});

export const perpsController = {
  /**
   * Auto-execute perps trade based on CMC signals
   * Only executes HIGH QUALITY signals (>75% confidence)
   * Avoids bad signals with automatic validation
   */
  async autoExecutePerps(req: Request, res: Response) {
    try {
      const { symbol = '1', collateralAmount = 100 } = req.body;

      if (!collateralAmount || collateralAmount <= 0) {
        return res.status(400).json({ error: 'Invalid collateral amount' });
      }

      // Fetch fresh market data from CMC
      const [quotes, technical] = await Promise.all([
        cmcClient.get('/cryptocurrency/quotes/latest', {
          params: { id: symbol, convert: 'USD' },
        }),
        cmcClient.get('/technical/analysis', {
          params: { id: symbol, convert: 'USD' },
        }),
      ]);

      // Analyze market to generate signal
      const signal = signalAnalyzer.analyzeMarket(quotes.data, technical.data);

      // Execute perps with strict validation
      const result = await perpsExecutor.executePerpsAuto(symbol, signal, collateralAmount);

      if (!result.success) {
        logger.warn({ symbol, reason: result.reason }, 'Perps execution rejected');
        return res.status(400).json({
          success: false,
          reason: result.reason,
          signal: {
            confidence: signal.confidence,
            recommendation: signal.recommendation,
            rsi: signal.rsi,
          },
        });
      }

      // Log successful trade
      await tradeDb.saveSignal({
        symbol: symbol,
        recommendation: signal.recommendation as 'BUY' | 'SELL' | 'HOLD',
        confidence: signal.confidence,
        timestamp: new Date(),
      });

      res.json({
        success: true,
        position: result.position,
        signal: {
          recommendation: signal.recommendation,
          confidence: (signal.confidence * 100).toFixed(1) + '%',
          rsi: signal.rsi.toFixed(1),
          macd: signal.macd,
          reasoning: signal.reasoning,
        },
        riskManagement: {
          leverage: result.position?.leverage,
          takeProfit: `+2.5%`,
          stopLoss: `-1.0%`,
          liquidationPrice: result.position?.liquidationPrice.toFixed(2),
        },
        details: result.reason,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(error, 'Error executing auto perps trade');
      res.status(500).json({ error: 'Failed to execute perps trade' });
    }
  },

  /**
   * Get current active perps positions
   */
  async getActivePositions(req: Request, res: Response) {
    try {
      const positions = perpsExecutor.getActivePositions();
      const stats = perpsExecutor.getPositionStats();

      res.json({
        positions,
        statistics: stats,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(error, 'Error fetching positions');
      res.status(500).json({ error: 'Failed to fetch positions' });
    }
  },

  /**
   * Close position manually
   */
  async closePosition(req: Request, res: Response) {
    try {
      const { symbol, exitPrice, reason = 'MANUAL' } = req.body;

      if (!symbol || !exitPrice) {
        return res.status(400).json({ error: 'Missing symbol or exitPrice' });
      }

      const result = await perpsExecutor.closePosition(
        symbol,
        exitPrice,
        reason as 'TAKE_PROFIT' | 'STOP_LOSS' | 'MANUAL'
      );

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      logger.error(error, 'Error closing position');
      res.status(500).json({ error: 'Failed to close position' });
    }
  },

  /**
   * Monitor positions and apply take profit / stop loss
   */
  async monitorPositions(req: Request, res: Response) {
    try {
      const { currentPrices } = req.body; // Map of symbol -> price

      if (!currentPrices || typeof currentPrices !== 'object') {
        return res.status(400).json({ error: 'Invalid currentPrices format' });
      }

      const priceMap = new Map(Object.entries(currentPrices) as [string, number][]);
      await perpsExecutor.monitorPositions(priceMap);

      const positions = perpsExecutor.getActivePositions();

      res.json({
        success: true,
        activePositions: positions.length,
        positions,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(error, 'Error monitoring positions');
      res.status(500).json({ error: 'Failed to monitor positions' });
    }
  },

  /**
   * Get perps statistics and performance
   */
  async getPerpsStats(req: Request, res: Response) {
    try {
      const stats = perpsExecutor.getPositionStats();
      const positions = perpsExecutor.getActivePositions();

      // Calculate total exposure
      const totalExposure = positions.reduce((sum, p) => sum + p.collateral * p.leverage, 0);
      const totalCollateral = positions.reduce((sum, p) => sum + p.collateral, 0);

      res.json({
        positions: stats,
        totalCollateral: totalCollateral.toFixed(2),
        totalExposure: totalExposure.toFixed(2),
        averageLeverage: stats.totalLeverage.toFixed(2),
        riskLevel: calculateRiskLevel(stats.totalLeverage),
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(error, 'Error fetching perps stats');
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  },
};

function calculateRiskLevel(avgLeverage: number): string {
  if (avgLeverage > 4) return 'CRITICAL';
  if (avgLeverage > 3) return 'HIGH';
  if (avgLeverage > 2) return 'MEDIUM';
  if (avgLeverage > 1) return 'LOW';
  return 'MINIMAL';
}
