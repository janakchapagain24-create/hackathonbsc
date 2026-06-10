# PERPS Trading Bot - Quick Reference

## 🚀 Start Trading in 30 Seconds

```bash
# 1. Install
pnpm install

# 2. Configure
cp .env.example .env.local
# Add your CMC_API_KEY

# 3. Run
pnpm run dev

# 4. Execute trade
curl -X POST http://localhost:3001/api/perps/auto-execute \
  -d '{"symbol": "1", "collateralAmount": 100}'
```

## 📊 Signal Quality Levels

| Confidence | Result | Leverage |
|-----------|--------|----------|
| **20-29%** | ❌ REJECTED | - |
| **30-44%** | ❌ REJECTED | - |
| **45-55%** | ❌ REJECTED (Marginal) | - |
| **56-74%** | ❌ REJECTED | - |
| **75-84%** | ✅ BUY (1-2x) | 1-2x |
| **85-94%** | ✅ BUY (2-3x) | 2-3x |
| **95-100%** | ✅ BUY (3-5x) | 3-5x |

## 💰 P&L Per $100 Capital

```
Position: LONG 3x with $100 collateral

✅ Take Profit Hit (+2.5%):
   Profit = $100 × 3 × 2.5% = $7.50
   ROI = 7.5%

❌ Stop Loss Hit (-1.0%):
   Loss = $100 × 3 × 1.0% = $3.00
   ROI = -3%

Risk/Reward = 1:2.5
```

## 🔍 What Gets Rejected

- ❌ Confidence < 75%
- ❌ Confidence 45-55% (Marginal)
- ❌ BUY signal + RSI > 30
- ❌ SELL signal + RSI < 70
- ❌ MACD doesn't align

## ✅ What Gets Executed

- ✅ Confidence ≥ 75%
- ✅ BUY signal + RSI < 30
- ✅ SELL signal + RSI > 70
- ✅ MACD confirms direction
- ✅ All checks pass

## 🎯 API Calls

```bash
# Execute
POST /api/perps/auto-execute
{"symbol": "1", "collateralAmount": 100}

# Get Positions
GET /api/perps/positions

# Monitor (Trigger TP/SL)
POST /api/perps/monitor
{"currentPrices": {"1": 51250}}

# Get Stats
GET /api/perps/stats

# Close Position
POST /api/perps/close
{"symbol": "1", "exitPrice": 51250}
```

## 📈 Risk Management

- Take Profit: +2.5% (automatic)
- Stop Loss: -1.0% (automatic)
- Max Leverage: 5x (only on extreme signals)
- Avg Leverage: 2-3x (normal trades)

## 🎮 Dashboard

1. Open: http://localhost:3000
2. Go to: "⚡ Perps Trading Terminal"
3. Select asset, enter collateral
4. Click "Execute Auto Trade"
5. View results instantly

## 📊 CMC Assets

| Name | ID | Example |
|------|----|---------|
| Bitcoin | 1 | BTC |
| Ethereum | 1027 | ETH |
| Cardano | 5994 | ADA |
| Ripple | 11419 | XRP |

---

**Live trading:** Ready to go! 🚀
