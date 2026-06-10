# Trading Agent Contracts

Smart contracts for the BSC Trading Agent hackathon project.

## Contracts

### TradingAgent.sol
- Executes token swaps on PancakeSwap
- Whitelist management for authorized traders
- Trade counting and history
- Signal reception and event logging

### SignalOracle.sol
- On-chain signal storage (BUY/SELL/HOLD)
- Technical indicator storage (RSI, MACD)
- Role-based access control for signal providers

## Deployment

```bash
# Testnet
npm run deploy:testnet

# Mainnet
npm run deploy:mainnet
```
