require("@nomicfoundation/hardhat-toolbox");
require("@fhevm/hardhat-plugin");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
        viaIR: true  // Required for FHE contracts
      }
    }
  },
  networks: {
    sepolia: {
      url: process.env.VITE_SEPOLIA_RPC_URL || "https://1rpc.io/sepolia",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || "J8PU7AX1JX3RGEH1SNGZS4628BAH192Y3N"
  },
  fhevm: {
    network: "sepolia"
  }
};
