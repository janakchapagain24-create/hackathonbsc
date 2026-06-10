# BSC Trading Dashboard - CMC + Trust Wallet Integration

A production-ready trading dashboard that leverages:
- **CoinMarketCap API**: Real-time market signals and data
- **Trust Wallet SDK**: Self-custody trading execution
- **BNB Smart Chain**: Low-fee, high-speed execution
- **PancakeSwap**: DEX liquidity for trading

## Features

- Real-time market signals from CMC Data API
- Automated trading decision logic
- Self-custody execution via Trust Wallet Agent Kit
- Live portfolio tracking
- Risk management tools

## Tech Stack

- Frontend: React + TypeScript
- Backend: Node.js + Express
- Blockchain: BNB Smart Chain (BSC)
- APIs: CMC Data API, Trust Wallet SDK
- Package Manager: pnpm

## Prerequisites

- Node.js 18+
- pnpm
- CMC API Key: `e5f66f1707e2417ca5c3cce6fc8b69f3`
- Trust Wallet installed (for execution)
- BSC testnet setup

## Getting Started

See [SETUP.md](./SETUP.md) for detailed installation instructions.

## Project Structure

```
├── backend/           # Express server + API integrations
├── frontend/          # React dashboard UI
├── contracts/         # Smart contract interactions
├── utils/             # Shared utilities
├── config/            # Configuration files
└── docs/              # Documentation
```

## API Documentation

### CMC Data Endpoints Used
- `/quotes/latest` - Current market prices
- `/technical` - Technical indicators
- `/on-chain` - On-chain metrics
- `/sentiment` - Market sentiment

### Trust Wallet Integration
- Agent-native local signing
- Autonomous trade execution
- x402 pay-per-call integration

## License

MIT