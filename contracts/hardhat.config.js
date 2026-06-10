require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

module.exports = {
  solidity: '0.8.20',
  networks: {
    bsc: {
      url: process.env.BSC_RPC_URL || 'https://bsc-dataseed.binance.org/',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 56,
    },
    bscTestnet: {
      url: 'https://data-seed-prebsc-1-2.binance.org:8545',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 97,
    },
  },
};
