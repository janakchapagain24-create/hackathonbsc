const hre = require('hardhat');

async function main() {
  const PANCAKESWAP_ROUTER = '0x10ED43C718714eb63d5aA57B78f985283E231166'; // BSC mainnet
  
  console.log('Deploying TradingAgent...');
  const TradingAgent = await hre.ethers.getContractFactory('TradingAgent');
  const tradingAgent = await TradingAgent.deploy(PANCAKESWAP_ROUTER);
  await tradingAgent.deployed();
  console.log('TradingAgent deployed to:', tradingAgent.address);
  
  console.log('Deploying SignalOracle...');
  const SignalOracle = await hre.ethers.getContractFactory('SignalOracle');
  const signalOracle = await SignalOracle.deploy();
  await signalOracle.deployed();
  console.log('SignalOracle deployed to:', signalOracle.address);
  
  // Save addresses
  const deploymentAddresses = {
    tradingAgent: tradingAgent.address,
    signalOracle: signalOracle.address,
    network: hre.network.name,
    timestamp: new Date().toISOString(),
  };
  
  const fs = require('fs');
  fs.writeFileSync(
    'deployments.json',
    JSON.stringify(deploymentAddresses, null, 2)
  );
  
  console.log('Deployment addresses saved to deployments.json');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
