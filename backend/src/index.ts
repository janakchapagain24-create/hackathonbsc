import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { configDotenv } from 'dotenv';
import { logger } from './utils/logger';
import { apiRoutes } from './routes';
import { errorHandler } from './middleware/errorHandler';

configDotenv();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api', apiRoutes);

// Metrics
app.get('/metrics', (req, res) => {
  res.json({ uptime: process.uptime() });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;