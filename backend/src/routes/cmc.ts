import { Router } from 'express';
import { cmcController } from '../controllers/cmc';

export const cmcRoutes = Router();

cmcRoutes.get('/quotes/:id', cmcController.getQuotes);
cmcRoutes.get('/technical/:id', cmcController.getTechnical);
cmcRoutes.get('/sentiment', cmcController.getSentiment);
cmcRoutes.get('/signals/:id', cmcController.getSignals);