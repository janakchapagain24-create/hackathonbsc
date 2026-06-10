import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { TrustWalletExecutor } from '../services/trustWalletExecutor';
import { TradeDatabase } from '../services/tradeDatabase';

const executor = new TrustWalletExecutor();
const tradeDb = new TradeDatabase();

export const tradingController = {
  async getStatus(req: Request, res: Response) {
    try {
      const status = await executor.getStatus();
      res.json({
        status: 'active',
        autoTrading: true,
        lastSignalCheck: new Date(),
        walletConnected: status.connected,
        network: 'BSC',
      });
    } catch (error) {
      logger.error(error, 'Error getting trading status');
      res.status(500).json({ error: 'Failed to get status' });
    }
  },

  async executeTrade(req: Request, res: Response) {
    try {
      const { symbol, side, amount, signal, priceLevel } = req.body;
      
      // Validate trade parameters
      if (!symbol || !side || !amount) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }

      // Execute trade via Trust Wallet
      const result = await executor.executeTrade({
        symbol,
        side,
        amount,
        signal,
        priceLevel,
      });

      // Store trade in database
      await tradeDb.saveTrade({
        symbol,
        side,
        amount,
        executedPrice: result.executedPrice,
        txHash: result.txHash,
        timestamp: new Date(),
      });

      res.json({
        success: true,
        txHash: result.txHash,
        symbol,
        side,
        amount,
        executedPrice: result.executedPrice,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(error, 'Error executing trade');
      res.status(500).json({ error: 'Failed to execute trade' });
    }
  },

  async getTradeHistory(req: Request, res: Response) {
    try {
      const { limit = 50 } = req.query;
      const trades = await tradeDb.getTrades(parseInt(limit as string));
      
      res.json({
        trades,
        totalTrades: trades.length,
      });
    } catch (error) {
      logger.error(error, 'Error fetching trade history');
      res.status(500).json({ error: 'Failed to fetch history' });
    }
  },

  async getSignals(req: Request, res: Response) {
    try {
      const signals = await tradeDb.getActiveSignals();
      res.json({
        signals,
        lastUpdate: new Date(),
      });
    } catch (error) {
      logger.error(error, 'Error fetching signals');
      res.status(500).json({ error: 'Failed to fetch signals' });
    }
  },
};