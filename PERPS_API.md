# Perps Trading API Documentation

## Endpoints

### 1. Auto-Execute Perps Trade
**POST** `/api/perps/auto-execute`

Automatically execute a perps trade based on CMC market signals with strict validation.

**Request Body:**
```json
{
  "symbol": "1",           // CMC ID (1=BTC, 1027=ETH)
  "collateralAmount": 100  // USD amount to use as margin
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "position": {
    "symbol": "1",
    "leverage": 3,
    "collateral": 100,
    "entryPrice": 50000,
    "liquidationPrice": 33333.33,
    "side": "LONG"
  },
  "signal": {
    "recommendation": "BUY",
    "confidence": "82.5%",
    "rsi": "25.3",
    "macd": { "line": 123.45, "signal": 98.21 },
    "reasoning": "RSI Oversold, MACD Bullish Crossover"
  },
  "riskManagement": {
    "leverage": 3,
    "takeProfit": "+2.5%",
    "stopLoss": "-1.0%",
    "liquidationPrice": "33333.33"
  },
  "details": "LONG 3x leverage | Confidence: 82% | RSI: 25.3 | TP: 51250.00 | SL: 49500.00",
  "timestamp": "2026-06-10T16:51:05.000Z"
}
```

**Response (Rejected - 400):**
```json
{
  "success": false,
  "reason": "Bad signal: Confidence 62.0% below minimum 75.0%",
  "signal": {
    "confidence": 0.62,
    "recommendation": "HOLD",
    "rsi": 52.3
  }
}
```

---

### 2. Get Active Positions
**GET** `/api/perps/positions`

Retrieve all currently active perps positions.

**Response:**
```json
{
  "positions": [
    {
      "symbol": "1",
      "leverage": 3,
      "collateral": 100,
      "entryPrice": 50000,
      "liquidationPrice": 33333.33,
      "side": "LONG"
    }
  ],
  "statistics": {
    "totalPositions": 1,
    "totalCollateral": 100,
    "totalLeverage": 3,
    "longPositions": 1,
    "shortPositions": 0
  },
  "timestamp": "2026-06-10T16:51:05.000Z"
}
```

---

### 3. Close Position
**POST** `/api/perps/close`

Manually close an active position.

**Request Body:**
```json
{
  "symbol": "1",
  "exitPrice": 51250,
  "reason": "MANUAL"  // or "TAKE_PROFIT" / "STOP_LOSS"
}
```

**Response:**
```json
{
  "success": true,
  "profit": 375,
  "profitPercent": 3.75,
  "status": "MANUAL | Profit: $375.00 (3.75%)"
}
```

---

### 4. Monitor Positions
**POST** `/api/perps/monitor`

Check current prices and automatically trigger take-profit or stop-loss.

**Request Body:**
```json
{
  "currentPrices": {
    "1": 51250,
    "1027": 3500,
    "5994": 1.05
  }
}
```

**Response:**
```json
{
  "success": true,
  "activePositions": 0,
  "positions": [],
  "timestamp": "2026-06-10T16:51:05.000Z"
}
```

---

### 5. Get Perps Statistics
**GET** `/api/perps/stats`

Get overall perps trading statistics and risk level.

**Response:**
```json
{
  "positions": {
    "totalPositions": 2,
    "totalCollateral": 250,
    "totalLeverage": 3,
    "longPositions": 1,
    "shortPositions": 1
  },
  "totalCollateral": "250.00",
  "totalExposure": "1500.00",
  "averageLeverage": "3.00",
  "riskLevel": "MEDIUM",
  "timestamp": "2026-06-10T16:51:05.000Z"
}
```

---

## Signal Validation Rules

The system only executes trades that pass strict validation:

### Confidence Thresholds
- **Minimum:** 75% - Trade rejected if below this
- **Marginal Zone:** 45-55% - Rejected as too unclear
- **Strong:** >85% - Gets 2x leverage
- **Extreme:** RSI 20-30 or 70-80 - Gets 3-5x leverage

### Technical Confirmation
1. **RSI Alignment:**
   - BUY signals require RSI < 30 (oversold)
   - SELL signals require RSI > 70 (overbought)

2. **MACD Confirmation:**
   - BUY: MACD line > signal line (bullish)
   - SELL: MACD line < signal line (bearish)

### Leverage Strategy
- **Extreme Conditions (RSI 20-30 or 70-80):** 5x leverage
- **Strong Conditions (RSI 30-70 but signal clear):** 3x leverage
- **High Confidence (>85% but moderate RSI):** 2x leverage
- **Default:** 1x (no leverage)

---

## Risk Management

### Automatic Position Management
- **Take Profit:** +2.5% profit target
- **Stop Loss:** -1.0% loss limit
- **Liquidation Price:** Calculated per leverage ratio

### Examples

**Example 1: Strong BUY Signal**
```
Signal: BUY (82% confidence)
RSI: 25 (oversold)
MACD: Bullish crossover
Leverage Applied: 3x
Collateral: $100
Position Size: $300
Entry: $50,000
TP: $51,250 (+2.5%)
SL: $49,500 (-1.0%)
Liquidation: $33,333
```

**Example 2: Marginal Signal (REJECTED)**
```
Signal: HOLD (50% confidence)
Reason: Signal in marginal zone (45-55%)
Action: NO TRADE
Result: Avoided potential loss
```

**Example 3: Weak SELL (REJECTED)**
```
Signal: SELL (72% confidence)
RSI: 68 (not overbought)
Reason: SELL signal but RSI < 70
Action: NO TRADE
Result: Avoided premature exit
```

---

## Best Practices

1. **Monitor Regularly**
   - Call `/api/perps/monitor` every 10-30 seconds with current prices
   - Positions auto-close on TP/SL

2. **Use Multiple Confirmations**
   - System validates RSI, MACD, and confidence
   - Only high-quality signals get executed

3. **Manage Exposure**
   - Keep total leverage < 10x
   - Don't risk more than 1-2% per trade
   - Diversify across multiple assets

4. **Avoid Marginal Signals**
   - 45-55% confidence zone = too unclear
   - System automatically rejects these
   - Waits for clearer signals

---

## Error Codes

| Code | Reason |
|------|--------|
| 400 | Bad signal quality, invalid parameters |
| 500 | Server error, system unavailable |

---

## Example Curl Requests

### Execute Auto Perps Trade
```bash
curl -X POST http://localhost:3001/api/perps/auto-execute \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "1",
    "collateralAmount": 100
  }'
```

### Get Active Positions
```bash
curl http://localhost:3001/api/perps/positions
```

### Monitor Positions
```bash
curl -X POST http://localhost:3001/api/perps/monitor \
  -H "Content-Type: application/json" \
  -d '{
    "currentPrices": {
      "1": 51000,
      "1027": 3500
    }
  }'
```

### Get Statistics
```bash
curl http://localhost:3001/api/perps/stats
```
