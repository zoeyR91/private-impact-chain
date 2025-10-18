const { ethers } = require("hardhat");

async function main() {
  console.log("Testing time calculation...");
  
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
  
  // Test with 10 years duration
  const duration = 10 * 365 * 24 * 60 * 60; // 10 years
  console.log("Duration:", duration);
  console.log("Duration in days:", duration / (24 * 60 * 60));
  
  const currentTime = Math.floor(Date.now() / 1000);
  console.log("Current time:", currentTime);
  console.log("Expected end time:", currentTime + duration);
  console.log("Expected end time (date):", new Date((currentTime + duration) * 1000).toISOString());
  
  // Create a campaign
  console.log("\\nCreating campaign...");
  const tx = await privateImpactChain.createCampaign(
    "Test Campaign",
    "Test Description",
    "Test Category",
    1000000, // 1M cents = $10,000
    duration
  );
  
  await tx.wait();
  console.log("Campaign created");
  
  // Check the campaign
  const campaign = await privateImpactChain.campaigns(0);
  console.log("\\nCampaign data:");
  console.log("  Campaign ID:", campaign[0].toString());
  console.log("  Target Amount:", campaign[1].toString());
  console.log("  Current Amount:", campaign[2].toString());
  console.log("  Donor Count:", campaign[3].toString());
  console.log("  Impact Score:", campaign[4].toString());
  console.log("  Is Active:", campaign[5]);
  console.log("  Is Verified:", campaign[6]);
  console.log("  Name:", campaign[7]);
  console.log("  Description:", campaign[8]);
  console.log("  Category:", campaign[9]);
  console.log("  Organizer:", campaign[10]);
  console.log("  Start time:", campaign[11].toString());
  console.log("  End time:", campaign[12].toString());
  console.log("  End time (date):", new Date(parseInt(campaign[12].toString()) * 1000).toISOString());
  console.log("  Duration used:", parseInt(campaign[12].toString()) - parseInt(campaign[11].toString()));
  console.log("  Expected duration:", duration);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
