# BSC Trading Dashboard - Full Implementation

## 🚀 Project Overview

A production-ready trading dashboard integrating:
- **CoinMarketCap API** - Real-time market signals and data (API Key: `e5f66f1707e2417ca5c3cce6fc8b69f3`)
- **Trust Wallet Agent Kit** - Self-custody trading execution
- **BNB Smart Chain** - Low-fee, high-speed execution
- **PancakeSwap** - DEX liquidity for trading
- **Smart Contracts** - On-chain signal oracle and trading agent

## 📋 Architecture

### L1: Data & Signals (CMC Agent Hub)
- CMC Data API for market quotes and technical analysis
- Signal analysis using RSI, MACD, and sentiment
- Automated decision logic for trade recommendations
- Real-time price monitoring

### L2: Custody & Execution (Trust Wallet Agent Kit)
- Self-custody with local key signing
- Optional autonomous trade execution
- MCP and REST API support
- x402 pay-per-call integration

### L3: Chain & SDK (BNB AI Agent SDK)
- BSC mainnet and testnet support
- PancakeSwap integration for token swaps
- BSC perps support for leveraged trading
- Sub-second confirmation times

## 🏗️ Project Structure

```
.
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── controllers/    # API endpoint handlers
│   │   ├── routes/         # Express routes
│   │   ├── services/       # Business logic
│   │   │   ├── signalAnalyzer.ts      # CMC data analysis
│   │   │   ├── trustWalletExecutor.ts # Trade execution
│   │   │   └── tradeDatabase.ts       # Trade history
│   │   ├── middleware/     # Express middleware
│   │   └── utils/          # Utilities (logger, etc.)
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                # React + TypeScript dashboard
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Dashboard.tsx        # Main dashboard
│   │   │   ├── MarketSignals.tsx    # Signal display
│   │   │   ├── TradingPanel.tsx     # Trade controls
│   │   │   ├── PortfolioChart.tsx   # Balance chart
│   │   │   └── TradeHistory.tsx     # Trade history table
│   │   ├── context/        # React context
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── contracts/              # Hardhat smart contracts
│   ├── contracts/
│   │   ├── TradingAgent.sol    # Trade execution contract
│   │   └── SignalOracle.sol    # Signal storage contract
│   ├── scripts/
│   │   └── deploy.js           # Deployment script
│   ├── hardhat.config.js
│   └── package.json
│
├── package.json            # Root workspace
├── README.md              # This file
├── SETUP.md               # Detailed setup guide
└── .env.example           # Environment variables template
```

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **APIs**: Axios for HTTP requests
- **Blockchain**: ethers.js for Web3
- **Logging**: Pino

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP**: Axios

### Smart Contracts
- **Language**: Solidity 0.8.20
- **Framework**: Hardhat
- **Networks**: BSC Mainnet & Testnet
- **DEX**: PancakeSwap V2

## 🚀 Quick Start

### Prerequisites
```bash
node --version  # v18+
npm install -g pnpm
```

### Installation
```bash
git clone https://github.com/janakchapagain24-create/hackathonbsc.git
cd hackathonbsc
pnpm install
```

### Environment Setup
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
CMC_API_KEY=e5f66f1707e2417ca5c3cce6fc8b69f3
TRUST_WALLET_API_KEY=your_key
BSC_RPC_URL=https://bsc-dataseed.binance.org/
PRIVATE_KEY=your_private_key
PORT=3001
```

### Development
```bash
# Start both backend and frontend
pnpm run dev

# Or separately
pnpm run dev:backend  # http://localhost:3001
pnpm run dev:frontend # http://localhost:3000
```

### Build
```bash
pnpm run build
```

### Deploy Contracts
```bash
# Testnet
pnpm run deploy:testnet

# Mainnet
pnpm run deploy:mainnet
```

## 📊 API Endpoints

### CMC Data
- `GET /api/cmc/quotes/:id` - Get cryptocurrency quotes
- `GET /api/cmc/technical/:id` - Get technical indicators
- `GET /api/cmc/sentiment` - Get market sentiment
- `GET /api/cmc/signals/:id` - Get trading signals (BUY/SELL/HOLD)

### Trading
- `GET /api/trading/status` - Get trading status
- `POST /api/trading/execute` - Execute a trade
- `GET /api/trading/history` - Get trade history
- `GET /api/trading/signals` - Get active signals

### Wallet
- `GET /api/wallet/balance` - Get wallet balance
- `POST /api/wallet/approve` - Approve token spending
- `POST /api/wallet/swap` - Execute swap
- `GET /api/wallet/transactions` - Get transaction history

## 🤖 Signal Analysis

The system analyzes markets using:

1. **RSI (Relative Strength Index)**
   - Overbought (>70) → SELL
   - Oversold (<30) → BUY

2. **MACD (Moving Average Convergence Divergence)**
   - Bullish crossover → BUY
   - Bearish crossover → SELL

3. **Market Sentiment**
   - Social media sentiment
   - News analysis
   - Price momentum

4. **Confidence Scoring**
   - Combined indicator confidence: 0.5 - 0.95
   - Risk-adjusted recommendations

## 🔗 Smart Contract Integration

### TradingAgent.sol
```solidity
// Execute swap on PancakeSwap
function executeSwap(
    address tokenIn,
    address tokenOut,
    uint256 amountIn,
    uint256 minAmountOut
) public returns (uint256[] memory amounts)
```

### SignalOracle.sol
```solidity
// Update market signal
function updateSignal(
    string memory symbol,
    string memory recommendation,
    uint256 confidence,
    uint256 rsi,
    int256 macd
) public onlySignaler
```

## 🧪 Testing

```bash
# All tests
pnpm test

# Specific test suites
pnpm test:cmc        # CMC API tests
pnpm test:wallet     # Wallet tests
pnpm test:trading    # Trading logic tests
```

## 📈 Hackathon Checklist

- ✅ CMC Data API integration
- ✅ Trust Wallet SDK integration
- ✅ Real-time market signals
- ✅ Automated trading logic
- ✅ Web dashboard UI
- ✅ Smart contracts on BSC
- ✅ Production-ready code
- ✅ Full documentation

## 🔐 Security Considerations

- Environment variables for sensitive data
- Private key management via hardware wallet
- Contract audit recommendations for mainnet
- Rate limiting on API endpoints
- Input validation on all endpoints

## 📚 Documentation

- [Setup Guide](./SETUP.md) - Detailed installation
- [API Docs](./API.md) - API reference
- [Contract Docs](./contracts/README.md) - Smart contract details

## 🤝 Contributing

Pull requests welcome! For major changes, please open an issue first.

## 📄 License

MIT

## 🎯 Hackathon Resources

- [CMC Agent Hub](https://coinmarketcap.com/api/agent/)
- [Trust Wallet Agent Kit](https://portal.trustwallet.com/)
- [BNB AI Agent SDK](https://github.com/bnb-chain/bnbagent-sdk)
- [BSC Docs](https://docs.bnbchain.org/)
- [PancakeSwap Docs](https://docs.pancakeswap.finance/)

## 📞 Support

For questions or issues, please open a GitHub issue.

---

**Built with ❤️ for the Hackathon**
