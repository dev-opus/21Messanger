import hre from 'hardhat';

async function main() {
  const messageBoard = await hre.ethers.deployContract('MessageBoard');
  await messageBoard.waitForDeployment();

  const messageBoardAddr = await messageBoard.getAddress();

  console.log('messageBoard deployed at: ' + messageBoardAddr);
}

main()
  .then(() => process.exit(0))
  .catch(console.error);
