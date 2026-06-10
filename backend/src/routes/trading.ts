import { Router } from 'express';
import { tradingController } from '../controllers/trading';

export const tradingRoutes = Router();

tradingRoutes.get('/status', tradingController.getStatus);
tradingRoutes.post('/execute', tradingController.executeTrade);
tradingRoutes.get('/history', tradingController.getTradeHistory);
tradingRoutes.get('/signals', tradingController.getSignals);