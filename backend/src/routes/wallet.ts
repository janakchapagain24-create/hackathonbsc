import { Router } from 'express';
import { walletController } from '../controllers/wallet';

export const walletRoutes = Router();

walletRoutes.get('/balance', walletController.getBalance);
walletRoutes.post('/approve', walletController.approve);
walletRoutes.post('/swap', walletController.swap);
walletRoutes.get('/transactions', walletController.getTransactions);