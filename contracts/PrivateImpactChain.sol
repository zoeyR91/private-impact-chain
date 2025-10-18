// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, eaddress, externalEbool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract PrivateImpactChain is SepoliaConfig {
    using FHE for *;
    
    struct ImpactCampaign {
        uint256 campaignId;
        uint256 targetAmount;  // Public target amount
        uint256 currentAmount; // Public current amount
        uint256 donorCount;    // Public donor count
        uint256 impactScore;   // Public impact score
        bool isActive;         // Public active status
        bool isVerified;       // Public verification status
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
        uint256 _targetAmount,  // Use regular uint256, no encryption
        uint256 _duration
    ) public returns (uint256) {
        require(bytes(_name).length > 0, "Campaign name cannot be empty");
        require(_duration > 0, "Duration must be positive");
        require(_targetAmount > 0, "Target amount must be positive");
        
        uint256 campaignId = campaignCounter++;
        
        campaigns[campaignId] = ImpactCampaign({
            campaignId: campaignId,
            targetAmount: _targetAmount,  // Public storage of target amount
            currentAmount: 0,            // Public storage of current amount
            donorCount: 0,              // Public storage of donor count
            impactScore: 0,             // Public storage of impact score
            isActive: true,            // Public storage of active status
            isVerified: false,          // Public storage of verification status
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
        externalEbool isAnonymous,
        bytes calldata inputProof
    ) public payable returns (uint256) {
        require(campaigns[campaignId].organizer != address(0), "Campaign does not exist");
        require(block.timestamp <= campaigns[campaignId].endTime, "Campaign has ended");
        
        uint256 donationId = donationCounter++;
        
        // Convert external encrypted values to internal FHE types
        euint32 internalAmount = FHE.fromExternal(amount, inputProof);
        ebool internalIsAnonymous = FHE.fromExternal(isAnonymous, inputProof);
        
        donations[donationId] = Donation({
            donationId: FHE.asEuint32(donationId),
            amount: internalAmount,
            campaignId: FHE.asEuint32(campaignId),
            donor: msg.sender,
            timestamp: block.timestamp,
            isAnonymous: internalIsAnonymous
        });
        
        // Set ACL permissions for donation data
        FHE.allowThis(internalAmount);
        FHE.allow(internalAmount, msg.sender);
        FHE.allowThis(internalIsAnonymous);
        FHE.allow(internalIsAnonymous, msg.sender);
        
        // Update campaign totals
        campaigns[campaignId].currentAmount = FHE.add(campaigns[campaignId].currentAmount, internalAmount);
        campaigns[campaignId].donorCount = FHE.add(campaigns[campaignId].donorCount, FHE.asEuint32(1));
        
        // Update donor profile
        if (donorProfiles[msg.sender].totalDonated == FHE.asEuint32(0)) {
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
        
        // Set ACL permissions for donor profile
        FHE.allowThis(donorProfiles[msg.sender].totalDonated);
        FHE.allow(donorProfiles[msg.sender].totalDonated, msg.sender);
        FHE.allowThis(donorProfiles[msg.sender].donationCount);
        FHE.allow(donorProfiles[msg.sender].donationCount, msg.sender);
        FHE.allowThis(donorProfiles[msg.sender].reputationScore);
        FHE.allow(donorProfiles[msg.sender].reputationScore, msg.sender);
        
        emit DonationMade(donationId, campaignId, msg.sender);
        return donationId;
    }
    
    function submitImpactReport(
        uint256 campaignId,
        externalEuint32 beneficiariesReached,
        externalEuint32 fundsUtilized,
        externalEuint32 impactMetrics,
        string memory reportHash,
        string memory evidenceHash,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(campaigns[campaignId].organizer == msg.sender, "Only organizer can submit report");
        require(block.timestamp > campaigns[campaignId].endTime, "Campaign must be ended");
        
        uint256 reportId = reportCounter++;
        
        // Convert external encrypted values to internal FHE types
        euint32 internalBeneficiariesReached = FHE.fromExternal(beneficiariesReached, inputProof);
        euint32 internalFundsUtilized = FHE.fromExternal(fundsUtilized, inputProof);
        euint32 internalImpactMetrics = FHE.fromExternal(impactMetrics, inputProof);
        
        impactReports[reportId] = ImpactReport({
            reportId: FHE.asEuint32(reportId),
            campaignId: FHE.asEuint32(campaignId),
            beneficiariesReached: internalBeneficiariesReached,
            fundsUtilized: internalFundsUtilized,
            impactMetrics: internalImpactMetrics,
            isVerified: FHE.asEbool(false),
            reportHash: reportHash,
            evidenceHash: evidenceHash,
            reporter: msg.sender,
            timestamp: block.timestamp
        });
        
        // Set ACL permissions for impact report data
        FHE.allowThis(internalBeneficiariesReached);
        FHE.allow(internalBeneficiariesReached, msg.sender);
        FHE.allowThis(internalFundsUtilized);
        FHE.allow(internalFundsUtilized, msg.sender);
        FHE.allowThis(internalImpactMetrics);
        FHE.allow(internalImpactMetrics, msg.sender);
        
        emit ImpactReported(reportId, campaignId, msg.sender);
        return reportId;
    }
    
    function verifyCampaign(uint256 campaignId, externalEbool isVerified, bytes calldata inputProof) public {
        require(msg.sender == verifier, "Only verifier can verify campaigns");
        require(campaigns[campaignId].organizer != address(0), "Campaign does not exist");
        
        // Convert external encrypted boolean to internal ebool
        ebool internalIsVerified = FHE.fromExternal(isVerified, inputProof);
        
        campaigns[campaignId].isVerified = internalIsVerified;
        
        // Set ACL permissions
        FHE.allowThis(internalIsVerified);
        FHE.allow(internalIsVerified, msg.sender);
        
        emit CampaignVerified(campaignId, false); // FHE.decrypt(isVerified) - will be decrypted off-chain
    }
    
    function validateImpactReport(uint256 reportId, externalEbool isValid, bytes calldata inputProof) public {
        require(msg.sender == impactValidator, "Only impact validator can validate reports");
        require(impactReports[reportId].reporter != address(0), "Report does not exist");
        
        // Convert external encrypted boolean to internal ebool
        ebool internalIsValid = FHE.fromExternal(isValid, inputProof);
        
        impactReports[reportId].isVerified = internalIsValid;
        
        // Set ACL permissions
        FHE.allowThis(internalIsValid);
        FHE.allow(internalIsValid, msg.sender);
        
        emit ImpactValidated(reportId, false); // FHE.decrypt(isValid) - will be decrypted off-chain
    }
    
    function updateReputation(address user, externalEuint32 reputation, bytes calldata inputProof) public {
        require(msg.sender == verifier || msg.sender == impactValidator, "Only authorized can update reputation");
        require(user != address(0), "Invalid user address");
        
        // Convert external encrypted reputation to internal euint32
        euint32 internalReputation = FHE.fromExternal(reputation, inputProof);
        
        // Determine if user is donor or organizer based on context
        if (donorProfiles[user].totalDonated != FHE.asEuint32(0)) {
            donorProfiles[user].reputationScore = internalReputation;
            // Set ACL permissions for donor reputation
            FHE.allowThis(internalReputation);
            FHE.allow(internalReputation, user);
        } else {
            organizerReputation[user] = internalReputation;
            // Set ACL permissions for organizer reputation
            FHE.allowThis(internalReputation);
            FHE.allow(internalReputation, user);
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
        address organizer,
        uint256 startTime,
        uint256 endTime
    ) {
        ImpactCampaign storage campaign = campaigns[campaignId];
        return (
            campaign.name,
            campaign.description,
            campaign.category,
            campaign.organizer,
            campaign.startTime,
            campaign.endTime
        );
    }
    
    // Get encrypted campaign data for FHE decryption
    function getCampaignEncryptedData(uint256 campaignId) public view returns (
        bytes32 targetAmount,
        bytes32 currentAmount,
        bytes32 donorCount,
        bytes32 impactScore,
        bytes32 isActive,
        bytes32 isVerified
    ) {
        ImpactCampaign storage campaign = campaigns[campaignId];
        return (
            campaign.targetAmount,
            campaign.currentAmount,
            campaign.donorCount,
            campaign.impactScore,
            campaign.isActive,
            campaign.isVerified
        );
    }
    
    function getDonationInfo(uint256 donationId) public view returns (
        address donor,
        uint256 timestamp
    ) {
        Donation storage donation = donations[donationId];
        return (
            donation.donor,
            donation.timestamp
        );
    }
    
    // Get encrypted donation data for FHE decryption
    function getDonationEncryptedData(uint256 donationId) public view returns (
        bytes32 amount,
        bytes32 campaignId,
        bytes32 isAnonymous
    ) {
        Donation storage donation = donations[donationId];
        return (
            donation.amount,
            donation.campaignId,
            donation.isAnonymous
        );
    }
    
    function getImpactReportInfo(uint256 reportId) public view returns (
        string memory reportHash,
        string memory evidenceHash,
        address reporter,
        uint256 timestamp
    ) {
        ImpactReport storage report = impactReports[reportId];
        return (
            report.reportHash,
            report.evidenceHash,
            report.reporter,
            report.timestamp
        );
    }
    
    // Get encrypted impact report data for FHE decryption
    function getImpactReportEncryptedData(uint256 reportId) public view returns (
        bytes32 campaignId,
        bytes32 beneficiariesReached,
        bytes32 fundsUtilized,
        bytes32 impactMetrics,
        bytes32 isVerified
    ) {
        ImpactReport storage report = impactReports[reportId];
        return (
            report.campaignId,
            report.beneficiariesReached,
            report.fundsUtilized,
            report.impactMetrics,
            report.isVerified
        );
    }
    
    function getDonorProfile(address donor) public view returns (
        string memory encryptedProfile
    ) {
        DonorProfile storage profile = donorProfiles[donor];
        return (
            profile.encryptedProfile
        );
    }
    
    // Get encrypted donor profile data for FHE decryption
    function getDonorProfileEncryptedData(address donor) public view returns (
        bytes32 totalDonated,
        bytes32 donationCount,
        bytes32 reputationScore,
        bytes32 isVerified
    ) {
        DonorProfile storage profile = donorProfiles[donor];
        return (
            profile.totalDonated,
            profile.donationCount,
            profile.reputationScore,
            profile.isVerified
        );
    }
    
    function getOrganizerReputation(address organizer) public view returns (bytes32) {
        return organizerReputation[organizer];
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
