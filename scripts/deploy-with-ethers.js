const { ethers } = require("ethers");
const fs = require('fs');

async function main() {
  console.log("Deploying PrivateImpactChain contract with ElonWills...");

  // Use the RPC URL from environment
  const rpcUrl = process.env.VITE_SEPOLIA_RPC_URL || "https://1rpc.io/sepolia";
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  
  // Get private key from environment
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    console.error("Please set PRIVATE_KEY environment variable");
    process.exit(1);
  }
  
  const wallet = new ethers.Wallet(privateKey, provider);
  console.log("Deploying with account:", wallet.address);

  // Check balance
  const balance = await provider.getBalance(wallet.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  if (balance < ethers.parseEther("0.01")) {
    console.error("Insufficient balance for deployment");
    process.exit(1);
  }

  // For now, create a mock deployment since we need FHEVM network
  const deploymentInfo = {
    contractAddress: "0x0000000000000000000000000000000000000000", // Placeholder
    deployer: wallet.address,
    network: "sepolia",
    timestamp: new Date().toISOString(),
    note: "Contract deployment requires FHEVM network setup",
    privateKey: privateKey.substring(0, 10) + "...", // Partial key for verification
    rpcUrl: rpcUrl
  };

  fs.writeFileSync(
    'deployment-info.json',
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("Mock deployment info saved to deployment-info.json");
  console.log("Note: Actual deployment requires FHEVM network setup");
  console.log("Contract Address:", deploymentInfo.contractAddress);
  console.log("Deployer:", deploymentInfo.deployer);
  console.log("Network: sepolia");
  console.log("Timestamp:", deploymentInfo.timestamp);
  console.log("Private Key (partial):", deploymentInfo.privateKey);
  console.log("RPC URL:", deploymentInfo.rpcUrl);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
