# Setup Guide

## Prerequisites

1. **Node.js & pnpm**
   ```bash
   node --version  # Should be 18+
   npm install -g pnpm
   ```

2. **Environment Variables**
   Create `.env.local` in the root:
   ```
   CMC_API_KEY=e5f66f1707e2417ca5c3cce6fc8b69f3
   TRUST_WALLET_API_KEY=your_trust_wallet_key
   BSC_RPC_URL=https://bsc-dataseed.binance.org/
   PANCAKESWAP_ROUTER=0x10ED43C718714eb63d5aA57B78f985283E231166
   ```

3. **Trust Wallet Agent Kit**
   - Visit: https://portal.trustwallet.com/
   - Set up Agent Kit with local signing enabled
   - Export your agent credentials

## Installation

```bash
# Clone and navigate
git clone https://github.com/janakchapagain24-create/hackathonbsc.git
cd hackathonbsc

# Install dependencies
pnpm install

# Build contracts
pnpm run build:contracts

# Start development servers
pnpm run dev
```

## Testing

```bash
# Run all tests
pnpm test

# Test CMC API integration
pnpm test:cmc

# Test Trust Wallet integration
pnpm test:wallet

# Run trading logic tests
pnpm test:trading
```

## Deployment

```bash
# Build for production
pnpm run build

# Deploy to BSC mainnet
pnpm run deploy:mainnet

# Deploy to BSC testnet
pnpm run deploy:testnet
```

## Monitoring

Check logs and metrics at:
- Backend: http://localhost:3001
- Frontend: http://localhost:3000
- Metrics Dashboard: http://localhost:3001/metrics