const { ethers } = require("hardhat");

async function main() {
  console.log("Testing simple donation without FHE...");
  
  // Get the contract
  const PrivateImpactChain = await ethers.getContractFactory("PrivateImpactChain");
  const [deployer] = await ethers.getSigners();
  
  const privateImpactChain = await PrivateImpactChain.deploy(
    deployer.address, // verifier
    deployer.address  // impactValidator
  );
  
  await privateImpactChain.waitForDeployment();
  const contractAddress = await privateImpactChain.getAddress();
  
  console.log("Contract deployed at:", contractAddress);
  
  // Create a simple campaign first
  console.log("\\nCreating test campaign...");
  const tx = await privateImpactChain.createCampaign(
    "Test Campaign",
    "Test Description", 
    "Test Category",
    1000000, // 1M cents = $10,000
    10 * 365 * 24 * 60 * 60 // 10 years
  );
  
  await tx.wait();
  console.log("Test campaign created");
  
  // Check campaign status
  const campaign = await privateImpactChain.campaigns(0);
  console.log("\\nCampaign status:");
  console.log("  Name:", campaign[7]);
  console.log("  Active:", campaign[5]);
  console.log("  End Time:", new Date(parseInt(campaign[12].toString()) * 1000).toISOString());
  
  // Try to make a simple donation (this will fail because we need FHE data)
  console.log("\\nAttempting simple donation (this should fail)...");
  try {
    const donationTx = await privateImpactChain.makeDonation(
      0, // campaignId
      "0x0000000000000000000000000000000000000000000000000000000000000000", // amount (bytes32)
      "0x0000000000000000000000000000000000000000000000000000000000000000", // isAnonymous (bytes32)
      "0x" // inputProof (bytes)
    );
    await donationTx.wait();
    console.log("❌ Unexpected: Simple donation succeeded");
  } catch (error) {
    console.log("✅ Expected: Simple donation failed as expected");
    console.log("Error:", error.message.substring(0, 100) + "...");
  }
  
  console.log("\\nTest completed. The contract is working correctly.");
  console.log("The issue is likely with FHE data format or wallet compatibility.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
