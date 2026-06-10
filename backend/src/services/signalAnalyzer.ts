export class TradingSignalAnalyzer {
  analyzeMarket(quotes: any, technical: any) {
    // Extract RSI, MACD, and other technical indicators
    const rsi = this.calculateRSI(technical);
    const macd = this.calculateMACD(technical);
    const price = quotes?.data?.price || 0;
    
    let recommendation = 'HOLD';
    let confidence = 0.5;
    let reasoning = [];

    // RSI Analysis (Overbought/Oversold)
    if (rsi > 70) {
      recommendation = 'SELL';
      confidence += 0.2;
      reasoning.push('RSI Overbought');
    } else if (rsi < 30) {
      recommendation = 'BUY';
      confidence += 0.2;
      reasoning.push('RSI Oversold');
    }

    // MACD Analysis
    if (macd.signal > macd.line) {
      if (recommendation === 'HOLD') recommendation = 'SELL';
      confidence += 0.15;
      reasoning.push('MACD Bearish Crossover');
    } else if (macd.signal < macd.line) {
      if (recommendation === 'HOLD') recommendation = 'BUY';
      confidence += 0.15;
      reasoning.push('MACD Bullish Crossover');
    }

    // Price momentum
    const priceLevel = price > 50000 ? 'high' : price > 30000 ? 'medium' : 'low';

    return {
      recommendation: recommendation as 'BUY' | 'SELL' | 'HOLD',
      confidence: Math.min(confidence, 0.95),
      rsi,
      macd,
      priceLevel,
      reasoning: reasoning.join(', ') || 'Neutral market conditions',
    };
  }

  private calculateRSI(technical: any): number {
    // Simplified RSI calculation
    return technical?.rsi || 50;
  }

  private calculateMACD(technical: any): { line: number; signal: number } {
    return {
      line: technical?.macd?.line || 0,
      signal: technical?.macd?.signal || 0,
    };
  }
}