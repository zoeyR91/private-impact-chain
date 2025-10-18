const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying PrivateImpactChain contract...");

  // Get the contract factory
  const PrivateImpactChain = await ethers.getContractFactory("PrivateImpactChain");

  // Deploy the contract
  // For now, we'll use the deployer as verifier and impactValidator
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const contract = await PrivateImpactChain.deploy(
    deployer.address, // verifier
    deployer.address  // impactValidator
  );

  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("PrivateImpactChain deployed to:", contractAddress);

  // Save deployment info
  const fs = require('fs');
  const deploymentInfo = {
    contractAddress: contractAddress,
    deployer: deployer.address,
    network: "sepolia",
    timestamp: new Date().toISOString()
  };

  fs.writeFileSync(
    'deployment-info.json',
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("Deployment info saved to deployment-info.json");
  console.log("Contract Address:", contractAddress);
  console.log("Deployer:", deployer.address);
  console.log("Network: sepolia");
  console.log("Timestamp:", new Date().toISOString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
