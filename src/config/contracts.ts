// Contract configuration and ABI
export const CONTRACT_ADDRESS = import.meta.env.VITE_SEPOLIA_CONTRACT_ADDRESS || '0xf7161613284Fe6D6128CA347D13e18AA4D6388A4';

// Log contract address immediately when module loads
console.log('🏗️ Contract Address:', CONTRACT_ADDRESS);
console.log('🌐 Environment:', import.meta.env.MODE);
console.log('🔗 VITE_SEPOLIA_CONTRACT_ADDRESS:', import.meta.env.VITE_SEPOLIA_CONTRACT_ADDRESS);

// Contract ABI for PrivateImpactChain
export const CONTRACT_ABI = [
  {
    "inputs": [
      {"internalType": "string", "name": "_name", "type": "string"},
      {"internalType": "string", "name": "_description", "type": "string"},
      {"internalType": "string", "name": "_category", "type": "string"},
      {"internalType": "uint256", "name": "_targetAmount", "type": "uint256"},
      {"internalType": "uint256", "name": "_duration", "type": "uint256"}
    ],
    "name": "createCampaign",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "campaignId", "type": "uint256"},
      {"internalType": "bytes32", "name": "amount", "type": "bytes32"},
      {"internalType": "bytes32", "name": "isAnonymous", "type": "bytes32"},
      {"internalType": "bytes", "name": "inputProof", "type": "bytes"}
    ],
    "name": "makeDonation",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "campaignId", "type": "uint256"},
      {"internalType": "bytes32", "name": "beneficiariesReached", "type": "bytes32"},
      {"internalType": "bytes32", "name": "fundsUtilized", "type": "bytes32"},
      {"internalType": "bytes32", "name": "impactMetrics", "type": "bytes32"},
      {"internalType": "string", "name": "reportHash", "type": "string"},
      {"internalType": "string", "name": "evidenceHash", "type": "string"},
      {"internalType": "bytes", "name": "inputProof", "type": "bytes"}
    ],
    "name": "submitImpactReport",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "campaignId", "type": "uint256"},
      {"internalType": "bytes32", "name": "isVerified", "type": "bytes32"},
      {"internalType": "bytes", "name": "inputProof", "type": "bytes"}
    ],
    "name": "verifyCampaign",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "reportId", "type": "uint256"},
      {"internalType": "bytes32", "name": "isValid", "type": "bytes32"},
      {"internalType": "bytes", "name": "inputProof", "type": "bytes"}
    ],
    "name": "validateImpactReport",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "user", "type": "address"},
      {"internalType": "bytes32", "name": "reputation", "type": "bytes32"},
      {"internalType": "bytes", "name": "inputProof", "type": "bytes"}
    ],
    "name": "updateReputation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "campaignCounter",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "campaigns",
    "outputs": [
      {"internalType": "uint256", "name": "campaignId", "type": "uint256"},
      {"internalType": "uint256", "name": "targetAmount", "type": "uint256"},
      {"internalType": "uint256", "name": "currentAmount", "type": "uint256"},
      {"internalType": "uint256", "name": "donorCount", "type": "uint256"},
      {"internalType": "uint256", "name": "impactScore", "type": "uint256"},
      {"internalType": "bool", "name": "isActive", "type": "bool"},
      {"internalType": "bool", "name": "isVerified", "type": "bool"},
      {"internalType": "string", "name": "name", "type": "string"},
      {"internalType": "string", "name": "description", "type": "string"},
      {"internalType": "string", "name": "category", "type": "string"},
      {"internalType": "address", "name": "organizer", "type": "address"},
      {"internalType": "uint256", "name": "startTime", "type": "uint256"},
      {"internalType": "uint256", "name": "endTime", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "campaignId", "type": "uint256"}],
    "name": "getCampaignInfo",
    "outputs": [
      {"internalType": "string", "name": "name", "type": "string"},
      {"internalType": "string", "name": "description", "type": "string"},
      {"internalType": "string", "name": "category", "type": "string"},
      {"internalType": "address", "name": "organizer", "type": "address"},
      {"internalType": "uint256", "name": "startTime", "type": "uint256"},
      {"internalType": "uint256", "name": "endTime", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "campaignId", "type": "uint256"}],
    "name": "getCampaignEncryptedData",
    "outputs": [
      {"internalType": "bytes32", "name": "targetAmount", "type": "bytes32"},
      {"internalType": "bytes32", "name": "currentAmount", "type": "bytes32"},
      {"internalType": "bytes32", "name": "donorCount", "type": "bytes32"},
      {"internalType": "bytes32", "name": "impactScore", "type": "bytes32"},
      {"internalType": "bytes32", "name": "isActive", "type": "bytes32"},
      {"internalType": "bytes32", "name": "isVerified", "type": "bytes32"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "donationId", "type": "uint256"}],
    "name": "getDonationInfo",
    "outputs": [
      {"internalType": "address", "name": "donor", "type": "address"},
      {"internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "donationId", "type": "uint256"}],
    "name": "getDonationEncryptedData",
    "outputs": [
      {"internalType": "bytes32", "name": "amount", "type": "bytes32"},
      {"internalType": "bytes32", "name": "campaignId", "type": "bytes32"},
      {"internalType": "bytes32", "name": "isAnonymous", "type": "bytes32"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "reportId", "type": "uint256"}],
    "name": "getImpactReportInfo",
    "outputs": [
      {"internalType": "string", "name": "reportHash", "type": "string"},
      {"internalType": "string", "name": "evidenceHash", "type": "string"},
      {"internalType": "address", "name": "reporter", "type": "address"},
      {"internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "reportId", "type": "uint256"}],
    "name": "getImpactReportEncryptedData",
    "outputs": [
      {"internalType": "bytes32", "name": "campaignId", "type": "bytes32"},
      {"internalType": "bytes32", "name": "beneficiariesReached", "type": "bytes32"},
      {"internalType": "bytes32", "name": "fundsUtilized", "type": "bytes32"},
      {"internalType": "bytes32", "name": "impactMetrics", "type": "bytes32"},
      {"internalType": "bytes32", "name": "isVerified", "type": "bytes32"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "donor", "type": "address"}],
    "name": "getDonorProfile",
    "outputs": [
      {"internalType": "string", "name": "encryptedProfile", "type": "string"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "donor", "type": "address"}],
    "name": "getDonorProfileEncryptedData",
    "outputs": [
      {"internalType": "bytes32", "name": "totalDonated", "type": "bytes32"},
      {"internalType": "bytes32", "name": "donationCount", "type": "bytes32"},
      {"internalType": "bytes32", "name": "reputationScore", "type": "bytes32"},
      {"internalType": "bytes32", "name": "isVerified", "type": "bytes32"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "organizer", "type": "address"}],
    "name": "getOrganizerReputation",
    "outputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "campaignId", "type": "uint256"}],
    "name": "withdrawFunds",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "campaignId", "type": "uint256"}],
    "name": "emergencyWithdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

// Contract events
export const CONTRACT_EVENTS = {
  CampaignCreated: "CampaignCreated(uint256 indexed campaignId, address indexed organizer, string name)",
  DonationMade: "DonationMade(uint256 indexed donationId, uint256 indexed campaignId, address indexed donor)",
  ImpactReported: "ImpactReported(uint256 indexed reportId, uint256 indexed campaignId, address indexed reporter)",
  CampaignVerified: "CampaignVerified(uint256 indexed campaignId, bool isVerified)",
  ImpactValidated: "ImpactValidated(uint256 indexed reportId, bool isValid)",
  ReputationUpdated: "ReputationUpdated(address indexed user, uint32 reputation)"
} as const;

// Network configuration
export const NETWORK_CONFIG = {
  sepolia: {
    chainId: 11155111,
    name: "Sepolia",
    rpcUrl: import.meta.env.VITE_SEPOLIA_RPC_URL || "https://1rpc.io/sepolia",
    explorer: "https://sepolia.etherscan.io"
  }
} as const;

// FHE configuration
export const FHE_CONFIG = {
  maxUint32: 4294967295,
  maxUint8: 255,
  encryptionTypes: {
    uint32: "euint32",
    uint8: "euint8", 
    bool: "ebool",
    address: "eaddress"
  }
} as const;

// Contract deployment info
export const DEPLOYMENT_INFO = {
  network: "sepolia",
  contractName: "PrivateImpactChain",
  version: "1.0.0",
  features: [
    "Public campaign creation",
    "FHE encrypted donations",
    "FHE encrypted impact reports",
    "FHE encrypted reputation system",
    "ACL permissions management"
  ]
} as const;
