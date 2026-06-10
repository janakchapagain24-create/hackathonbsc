interface Trade {
  id?: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  amount: number;
  executedPrice: number;
  txHash: string;
  timestamp: Date;
}

interface Signal {
  id?: string;
  symbol: string;
  recommendation: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  timestamp: Date;
}

export class TradeDatabase {
  private trades: Trade[] = [];
  private signals: Signal[] = [];

  async saveTrade(trade: Trade) {
    const t: Trade = {
      id: Date.now().toString(),
      ...trade,
    };
    this.trades.push(t);
    return t;
  }

  async getTrades(limit: number = 50): Promise<Trade[]> {
    return this.trades.slice(-limit).reverse();
  }

  async getActiveSignals(): Promise<Signal[]> {
    // Return signals from last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return this.signals.filter((s) => s.timestamp > oneDayAgo);
  }

  async saveSignal(signal: Signal) {
    const s: Signal = {
      id: Date.now().toString(),
      ...signal,
    };
    this.signals.push(s);
    return s;
  }
}