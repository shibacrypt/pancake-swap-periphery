const hre = require('hardhat');
const config = require('../config');
const network = hre.network.name;

async function main() {
  if (!process.env.PK) {
    throw new Error('Missing private key')
  }

  console.log('Deploying to network:', network)
  
  let factory = config.Factory[network]
  let wbnb = config.WBNB[network]
  
  if (network !== 'mainnet') {
    console.log('Deploying mock WBNB')

    const WbnbContract = await hre.ethers.getContractFactory('WBNB')
    wbnb = (await WbnbContract.deploy()).address

    console.log("WBNB deployed to:", wbnb);
  }
  
  console.log('Deploying Router')

  const RouterContract = await hre.ethers.getContractFactory('PancakeRouter')
  const router = await RouterContract.deploy(factory, wbnb)

  console.log("Router deployed to:", router.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
