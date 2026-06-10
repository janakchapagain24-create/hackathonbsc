import { Router } from 'express';
import { perpsController } from '../controllers/perps';

export const perpsRoutes = Router();

// Auto-execute perps trade based on CMC signals
perpsRoutes.post('/auto-execute', perpsController.autoExecutePerps);

// Get active positions
perpsRoutes.get('/positions', perpsController.getActivePositions);

// Close a position
perpsRoutes.post('/close', perpsController.closePosition);

// Monitor positions (check TP/SL)
perpsRoutes.post('/monitor', perpsController.monitorPositions);

// Get statistics
perpsRoutes.get('/stats', perpsController.getPerpsStats);
