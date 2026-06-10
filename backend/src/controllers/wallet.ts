import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { TrustWalletExecutor } from '../services/trustWalletExecutor';

const executor = new TrustWalletExecutor();

export const walletController = {
  async getBalance(req: Request, res: Response) {
    try {
      const balance = await executor.getBalance();
      res.json({
        balance: balance.bnb,
        address: balance.address,
        assets: balance.assets,
      });
    } catch (error) {
      logger.error(error, 'Error fetching balance');
      res.status(500).json({ error: 'Failed to fetch balance' });
    }
  },

  async approve(req: Request, res: Response) {
    try {
      const { token, spender, amount } = req.body;
      const result = await executor.approve(token, spender, amount);
      
      res.json({
        success: true,
        txHash: result.txHash,
        token,
        spender,
      });
    } catch (error) {
      logger.error(error, 'Error approving token');
      res.status(500).json({ error: 'Failed to approve token' });
    }
  },

  async swap(req: Request, res: Response) {
    try {
      const { tokenIn, tokenOut, amountIn, slippage = 0.5 } = req.body;
      const result = await executor.swap(tokenIn, tokenOut, amountIn, slippage);
      
      res.json({
        success: true,
        txHash: result.txHash,
        amountOut: result.amountOut,
        slippage: result.slippage,
      });
    } catch (error) {
      logger.error(error, 'Error executing swap');
      res.status(500).json({ error: 'Failed to execute swap' });
    }
  },

  async getTransactions(req: Request, res: Response) {
    try {
      const { limit = 20 } = req.query;
      const transactions = await executor.getTransactionHistory(parseInt(limit as string));
      
      res.json({
        transactions,
      });
    } catch (error) {
      logger.error(error, 'Error fetching transactions');
      res.status(500).json({ error: 'Failed to fetch transactions' });
    }
  },
};