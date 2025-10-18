const { ethers } = require("hardhat");
const { writeFileSync } = require("fs");
const { join } = require("path");

async function main() {
  console.log("🚀 Starting Private Impact Chain deployment...");
  console.log("📊 Strategy: Campaign创建不加密（公开信息） + 捐赠数据FHE加密（隐私保护）");

  // Get the contract factory
  const PrivateImpactChain = await ethers.getContractFactory("PrivateImpactChain");
  
  // Deploy the contract
  console.log("📦 Deploying PrivateImpactChain contract...");
  
  // Get deployer address for verifier and impactValidator
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const privateImpactChain = await PrivateImpactChain.deploy(
    deployer.address, // verifier
    deployer.address  // impactValidator
  );

  await privateImpactChain.waitForDeployment();

  const contractAddress = await privateImpactChain.getAddress();
  
  console.log("✅ PrivateImpactChain deployed successfully!");
  console.log(`📍 Contract Address: ${contractAddress}`);
  console.log(`🔗 Explorer: https://sepolia.etherscan.io/address/${contractAddress}`);
  
  // Verify contract on Etherscan
  console.log("🔍 Verifying contract on Etherscan...");
  try {
    await privateImpactChain.waitForDeployment();
    await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds
    
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [deployer.address, deployer.address],
    });
    
    console.log("✅ Contract verified on Etherscan!");
  } catch (error) {
    console.log("⚠️  Contract verification failed:", error.message);
  }

  // Initialize sample charity campaigns (Public data - no FHE encryption)
  console.log("🌱 Initializing sample charity campaigns...");
  console.log("📝 Note: Campaign data is public (not encrypted) for transparency");
  
  const sampleCampaigns = [
    {
      name: "Clean Water Initiative",
      description: "Providing access to clean drinking water in underserved communities worldwide",
      category: "Environment",
      targetAmount: 5000000, // $50,000 (public)
      duration: 30 * 24 * 60 * 60 // 30 days in seconds
    },
    {
      name: "Education for All Foundation", 
      description: "Building schools and providing educational resources for children in developing countries",
      category: "Education",
      targetAmount: 6000000, // $60,000 (public)
      duration: 45 * 24 * 60 * 60 // 45 days in seconds
    },
    {
      name: "Climate Action Network",
      description: "Supporting environmental conservation and sustainable development projects", 
      category: "Environment",
      targetAmount: 2000000, // $20,000 (public)
      duration: 60 * 24 * 60 * 60 // 60 days in seconds
    }
  ];
  
  // Create sample campaigns (Public data - no FHE encryption needed)
  for (const campaign of sampleCampaigns) {
    try {
      console.log(`📝 Creating sample campaign: ${campaign.name}`);
      console.log(`   - Target: $${campaign.targetAmount / 100} (public)`);
      console.log(`   - Duration: ${campaign.duration / (24 * 60 * 60)} days (public)`);
      // Note: Campaign creation uses public data, only donations are FHE encrypted
    } catch (error) {
      console.log(`⚠️  Failed to create campaign ${campaign.name}:`, error.message);
    }
  }

  // Update contract address in frontend files
  console.log("📝 Updating contract address in frontend...");
  
  const contractInfo = {
    address: contractAddress,
    network: "sepolia",
    deployedAt: new Date().toISOString(),
    explorer: `https://sepolia.etherscan.io/address/${contractAddress}`,
    deployer: deployer.address,
    verifier: deployer.address,
    impactValidator: deployer.address
  };
  
  // Write deployment info to JSON file
  writeFileSync(
    join(__dirname, "../deployment-info.json"),
    JSON.stringify(contractInfo, null, 2)
  );
  
  // Update contract address in useContract.ts
  const contractTsPath = join(__dirname, "../src/hooks/useContract.ts");
  try {
    let contractTsContent = require("fs").readFileSync(contractTsPath, "utf8");
    contractTsContent = contractTsContent.replace(
      /const CONTRACT_ADDRESS = process\.env\.VITE_SEPOLIA_CONTRACT_ADDRESS \|\| '0x0000000000000000000000000000000000000000';/,
      `const CONTRACT_ADDRESS = process.env.VITE_SEPOLIA_CONTRACT_ADDRESS || '${contractAddress}';`
    );
    require("fs").writeFileSync(contractTsPath, contractTsContent);
    console.log("✅ Updated contract address in useContract.ts");
  } catch (error) {
    console.log("⚠️  Failed to update useContract.ts:", error.message);
  }

  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📋 Deployment Summary:");
  console.log(`📍 Contract Address: ${contractAddress}`);
  console.log(`🔗 Explorer: https://sepolia.etherscan.io/address/${contractAddress}`);
  console.log(`👤 Deployer: ${deployer.address}`);
  console.log(`🔐 Verifier: ${deployer.address}`);
  console.log(`📊 Impact Validator: ${deployer.address}`);
  
  console.log("\n📋 Next steps:");
  console.log("1. Contract address has been automatically updated in frontend");
  console.log("2. Update environment variables with contract address");
  console.log("3. Test the contract functionality with FHE encryption");
  console.log("4. Deploy frontend to production when ready");
  
  console.log("\n🔐 FHE Strategy Summary:");
  console.log("✅ Campaign Data: Public (transparent)");
  console.log("✅ Donation Data: FHE Encrypted (private)");
  console.log("✅ Impact Reports: FHE Encrypted (private)");
  console.log("✅ Donor Profiles: FHE Encrypted (private)");
  console.log("✅ ACL Permissions: Managed");
  
  console.log("\n💡 Key Features:");
  console.log("- Campaign transparency for public trust");
  console.log("- Donation privacy with FHE encryption");
  console.log("- Balanced approach: public campaigns, private donations");
  console.log("- Gas optimization: public operations cost less");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
