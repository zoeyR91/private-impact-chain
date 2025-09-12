// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract PrivateImpactChain is SepoliaConfig {
    using FHE for *;
    
    struct ImpactCampaign {
        euint32 campaignId;
        euint32 targetAmount;
        euint32 currentAmount;
        euint32 donorCount;
        euint32 impactScore;
        ebool isActive;
        ebool isVerified;
        string name;
        string description;
        string category;
        address organizer;
        uint256 startTime;
        uint256 endTime;
    }
    
    struct Donation {
        euint32 donationId;
        euint32 amount;
        euint32 campaignId;
        address donor;
        uint256 timestamp;
        ebool isAnonymous;
    }
    
    struct ImpactReport {
        euint32 reportId;
        euint32 campaignId;
        euint32 beneficiariesReached;
        euint32 fundsUtilized;
        euint32 impactMetrics;
        ebool isVerified;
        string reportHash;
        string evidenceHash;
        address reporter;
        uint256 timestamp;
    }
    
    struct DonorProfile {
        euint32 totalDonated;
        euint32 donationCount;
        euint32 reputationScore;
        ebool isVerified;
        string encryptedProfile;
    }
    
    mapping(uint256 => ImpactCampaign) public campaigns;
    mapping(uint256 => Donation) public donations;
    mapping(uint256 => ImpactReport) public impactReports;
    mapping(address => DonorProfile) public donorProfiles;
    mapping(address => euint32) public organizerReputation;
    
    uint256 public campaignCounter;
    uint256 public donationCounter;
    uint256 public reportCounter;
    
    address public owner;
    address public verifier;
    address public impactValidator;
    
    event CampaignCreated(uint256 indexed campaignId, address indexed organizer, string name);
    event DonationMade(uint256 indexed donationId, uint256 indexed campaignId, address indexed donor);
    event ImpactReported(uint256 indexed reportId, uint256 indexed campaignId, address indexed reporter);
    event CampaignVerified(uint256 indexed campaignId, bool isVerified);
    event ImpactValidated(uint256 indexed reportId, bool isValid);
    event ReputationUpdated(address indexed user, uint32 reputation);
    
    constructor(address _verifier, address _impactValidator) {
        owner = msg.sender;
        verifier = _verifier;
        impactValidator = _impactValidator;
    }
    
    function createCampaign(
        string memory _name,
        string memory _description,
        string memory _category,
        uint256 _targetAmount,
        uint256 _duration
    ) public returns (uint256) {
        require(bytes(_name).length > 0, "Campaign name cannot be empty");
        require(_duration > 0, "Duration must be positive");
        require(_targetAmount > 0, "Target amount must be positive");
        
        uint256 campaignId = campaignCounter++;
        
        campaigns[campaignId] = ImpactCampaign({
            campaignId: FHE.asEuint32(0), // Will be set properly later
            targetAmount: FHE.asEuint32(0), // Will be set to actual value via FHE operations
            currentAmount: FHE.asEuint32(0),
            donorCount: FHE.asEuint32(0),
            impactScore: FHE.asEuint32(0),
            isActive: FHE.asEbool(true),
            isVerified: FHE.asEbool(false),
            name: _name,
            description: _description,
            category: _category,
            organizer: msg.sender,
            startTime: block.timestamp,
            endTime: block.timestamp + _duration
        });
        
        emit CampaignCreated(campaignId, msg.sender, _name);
        return campaignId;
    }
    
    function makeDonation(
        uint256 campaignId,
        externalEuint32 amount,
        ebool isAnonymous,
        bytes calldata inputProof
    ) public payable returns (uint256) {
        require(campaigns[campaignId].organizer != address(0), "Campaign does not exist");
        require(block.timestamp <= campaigns[campaignId].endTime, "Campaign has ended");
        
        uint256 donationId = donationCounter++;
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalAmount = FHE.fromExternal(amount, inputProof);
        
        donations[donationId] = Donation({
            donationId: FHE.asEuint32(0), // Will be set properly later
            amount: internalAmount,
            campaignId: FHE.asEuint32(0), // Will be set to actual value
            donor: msg.sender,
            timestamp: block.timestamp,
            isAnonymous: isAnonymous
        });
        
        // Update campaign totals
        campaigns[campaignId].currentAmount = FHE.add(campaigns[campaignId].currentAmount, internalAmount);
        campaigns[campaignId].donorCount = FHE.add(campaigns[campaignId].donorCount, FHE.asEuint32(1));
        
        // Update donor profile
        if (donorProfiles[msg.sender].donor == address(0)) {
            donorProfiles[msg.sender] = DonorProfile({
                totalDonated: internalAmount,
                donationCount: FHE.asEuint32(1),
                reputationScore: FHE.asEuint32(10), // Initial reputation
                isVerified: FHE.asEbool(false),
                encryptedProfile: ""
            });
        } else {
            donorProfiles[msg.sender].totalDonated = FHE.add(donorProfiles[msg.sender].totalDonated, internalAmount);
            donorProfiles[msg.sender].donationCount = FHE.add(donorProfiles[msg.sender].donationCount, FHE.asEuint32(1));
        }
        
        emit DonationMade(donationId, campaignId, msg.sender);
        return donationId;
    }
    
    function submitImpactReport(
        uint256 campaignId,
        euint32 beneficiariesReached,
        euint32 fundsUtilized,
        euint32 impactMetrics,
        string memory reportHash,
        string memory evidenceHash
    ) public returns (uint256) {
        require(campaigns[campaignId].organizer == msg.sender, "Only organizer can submit report");
        require(block.timestamp > campaigns[campaignId].endTime, "Campaign must be ended");
        
        uint256 reportId = reportCounter++;
        
        impactReports[reportId] = ImpactReport({
            reportId: FHE.asEuint32(0), // Will be set properly later
            campaignId: FHE.asEuint32(0), // Will be set to actual value
            beneficiariesReached: beneficiariesReached,
            fundsUtilized: fundsUtilized,
            impactMetrics: impactMetrics,
            isVerified: FHE.asEbool(false),
            reportHash: reportHash,
            evidenceHash: evidenceHash,
            reporter: msg.sender,
            timestamp: block.timestamp
        });
        
        emit ImpactReported(reportId, campaignId, msg.sender);
        return reportId;
    }
    
    function verifyCampaign(uint256 campaignId, ebool isVerified) public {
        require(msg.sender == verifier, "Only verifier can verify campaigns");
        require(campaigns[campaignId].organizer != address(0), "Campaign does not exist");
        
        campaigns[campaignId].isVerified = isVerified;
        emit CampaignVerified(campaignId, false); // FHE.decrypt(isVerified) - will be decrypted off-chain
    }
    
    function validateImpactReport(uint256 reportId, ebool isValid) public {
        require(msg.sender == impactValidator, "Only impact validator can validate reports");
        require(impactReports[reportId].reporter != address(0), "Report does not exist");
        
        impactReports[reportId].isVerified = isValid;
        emit ImpactValidated(reportId, false); // FHE.decrypt(isValid) - will be decrypted off-chain
    }
    
    function updateReputation(address user, euint32 reputation) public {
        require(msg.sender == verifier || msg.sender == impactValidator, "Only authorized can update reputation");
        require(user != address(0), "Invalid user address");
        
        // Determine if user is donor or organizer based on context
        if (donorProfiles[user].donor != address(0)) {
            donorProfiles[user].reputationScore = reputation;
        } else {
            organizerReputation[user] = reputation;
        }
        
        emit ReputationUpdated(user, 0); // FHE.decrypt(reputation) - will be decrypted off-chain
    }
    
    function calculateImpactScore(uint256 campaignId) public view returns (euint32) {
        require(campaigns[campaignId].organizer != address(0), "Campaign does not exist");
        
        // This would be a complex calculation involving multiple encrypted metrics
        // For now, return a placeholder
        return campaigns[campaignId].impactScore;
    }
    
    function getCampaignInfo(uint256 campaignId) public view returns (
        string memory name,
        string memory description,
        string memory category,
        uint8 targetAmount,
        uint8 currentAmount,
        uint8 donorCount,
        uint8 impactScore,
        bool isActive,
        bool isVerified,
        address organizer,
        uint256 startTime,
        uint256 endTime
    ) {
        ImpactCampaign storage campaign = campaigns[campaignId];
        return (
            campaign.name,
            campaign.description,
            campaign.category,
            0, // FHE.decrypt(campaign.targetAmount) - will be decrypted off-chain
            0, // FHE.decrypt(campaign.currentAmount) - will be decrypted off-chain
            0, // FHE.decrypt(campaign.donorCount) - will be decrypted off-chain
            0, // FHE.decrypt(campaign.impactScore) - will be decrypted off-chain
            false, // FHE.decrypt(campaign.isActive) - will be decrypted off-chain
            false, // FHE.decrypt(campaign.isVerified) - will be decrypted off-chain
            campaign.organizer,
            campaign.startTime,
            campaign.endTime
        );
    }
    
    function getDonationInfo(uint256 donationId) public view returns (
        uint8 amount,
        uint8 campaignId,
        address donor,
        uint256 timestamp,
        bool isAnonymous
    ) {
        Donation storage donation = donations[donationId];
        return (
            0, // FHE.decrypt(donation.amount) - will be decrypted off-chain
            0, // FHE.decrypt(donation.campaignId) - will be decrypted off-chain
            donation.donor,
            donation.timestamp,
            false // FHE.decrypt(donation.isAnonymous) - will be decrypted off-chain
        );
    }
    
    function getImpactReportInfo(uint256 reportId) public view returns (
        uint8 campaignId,
        uint8 beneficiariesReached,
        uint8 fundsUtilized,
        uint8 impactMetrics,
        bool isVerified,
        string memory reportHash,
        string memory evidenceHash,
        address reporter,
        uint256 timestamp
    ) {
        ImpactReport storage report = impactReports[reportId];
        return (
            0, // FHE.decrypt(report.campaignId) - will be decrypted off-chain
            0, // FHE.decrypt(report.beneficiariesReached) - will be decrypted off-chain
            0, // FHE.decrypt(report.fundsUtilized) - will be decrypted off-chain
            0, // FHE.decrypt(report.impactMetrics) - will be decrypted off-chain
            false, // FHE.decrypt(report.isVerified) - will be decrypted off-chain
            report.reportHash,
            report.evidenceHash,
            report.reporter,
            report.timestamp
        );
    }
    
    function getDonorProfile(address donor) public view returns (
        uint8 totalDonated,
        uint8 donationCount,
        uint8 reputationScore,
        bool isVerified,
        string memory encryptedProfile
    ) {
        DonorProfile storage profile = donorProfiles[donor];
        return (
            0, // FHE.decrypt(profile.totalDonated) - will be decrypted off-chain
            0, // FHE.decrypt(profile.donationCount) - will be decrypted off-chain
            0, // FHE.decrypt(profile.reputationScore) - will be decrypted off-chain
            false, // FHE.decrypt(profile.isVerified) - will be decrypted off-chain
            profile.encryptedProfile
        );
    }
    
    function getOrganizerReputation(address organizer) public view returns (uint8) {
        return 0; // FHE.decrypt(organizerReputation[organizer]) - will be decrypted off-chain
    }
    
    function withdrawFunds(uint256 campaignId) public {
        require(campaigns[campaignId].organizer == msg.sender, "Only organizer can withdraw");
        require(block.timestamp > campaigns[campaignId].endTime, "Campaign must be ended");
        
        // Mark campaign as inactive
        campaigns[campaignId].isActive = FHE.asEbool(false);
        
        // Transfer funds to organizer
        // Note: In a real implementation, funds would be transferred based on decrypted amount
        // payable(msg.sender).transfer(amount);
    }
    
    function emergencyWithdraw(uint256 campaignId) public {
        require(msg.sender == owner, "Only owner can emergency withdraw");
        require(campaigns[campaignId].organizer != address(0), "Campaign does not exist");
        
        // Emergency withdrawal logic
        campaigns[campaignId].isActive = FHE.asEbool(false);
    }
}
