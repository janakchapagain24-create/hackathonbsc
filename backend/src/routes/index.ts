import { Router } from 'express';
import { cmcRoutes } from './cmc';
import { tradingRoutes } from './trading';
import { walletRoutes } from './wallet';

export const apiRoutes = Router();

apiRoutes.use('/cmc', cmcRoutes);
apiRoutes.use('/trading', tradingRoutes);
apiRoutes.use('/wallet', walletRoutes);