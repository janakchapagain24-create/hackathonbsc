import { Request, Response } from 'express';
import axios from 'axios';
import { logger } from '../utils/logger';
import { TradingSignalAnalyzer } from '../services/signalAnalyzer';

const CMC_API_KEY = process.env.CMC_API_KEY || '';
const CMC_API_URL = 'https://pro-api.coinmarketcap.com/v2';

const cmcClient = axios.create({
  baseURL: CMC_API_URL,
  headers: {
    'X-CMC_PRO_API_KEY': CMC_API_KEY,
  },
});

const signalAnalyzer = new TradingSignalAnalyzer();

export const cmcController = {
  async getQuotes(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const response = await cmcClient.get('/cryptocurrency/quotes/latest', {
        params: { id, convert: 'USD' },
      });
      res.json(response.data);
    } catch (error) {
      logger.error(error, 'Error fetching quotes');
      res.status(500).json({ error: 'Failed to fetch quotes' });
    }
  },

  async getTechnical(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const response = await cmcClient.get('/technical/analysis', {
        params: { id, convert: 'USD' },
      });
      res.json(response.data);
    } catch (error) {
      logger.error(error, 'Error fetching technical data');
      res.status(500).json({ error: 'Failed to fetch technical data' });
    }
  },

  async getSentiment(req: Request, res: Response) {
    try {
      const response = await cmcClient.get('/sentiment/posts/trending');
      res.json(response.data);
    } catch (error) {
      logger.error(error, 'Error fetching sentiment');
      res.status(500).json({ error: 'Failed to fetch sentiment' });
    }
  },

  async getSignals(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      // Fetch multiple data sources for comprehensive analysis
      const [quotes, technical] = await Promise.all([
        cmcClient.get('/cryptocurrency/quotes/latest', {
          params: { id, convert: 'USD' },
        }),
        cmcClient.get('/technical/analysis', {
          params: { id, convert: 'USD' },
        }),
      ]);

      // Analyze signals
      const signal = signalAnalyzer.analyzeMarket(quotes.data, technical.data);

      res.json({
        id,
        timestamp: new Date().toISOString(),
        signal: signal.recommendation,
        confidence: signal.confidence,
        reasoning: signal.reasoning,
        rsi: signal.rsi,
        macd: signal.macd,
        priceLevel: signal.priceLevel,
      });
    } catch (error) {
      logger.error(error, 'Error generating signals');
      res.status(500).json({ error: 'Failed to generate signals' });
    }
  },
};