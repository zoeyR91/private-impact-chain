import { FHEInstance } from '../types/fhe';

// Convert FHE handle to hex string
export const convertHex = (handle: any): string => {
  let hex = '';
  if (handle instanceof Uint8Array) {
    hex = `0x${Array.from(handle).map(b => b.toString(16).padStart(2, '0')).join('')}`;
  } else if (typeof handle === 'string') {
    hex = handle.startsWith('0x') ? handle : `0x${handle}`;
  } else if (Array.isArray(handle)) {
    hex = `0x${handle.map(b => b.toString(16).padStart(2, '0')).join('')}`;
  } else {
    // Handle other types by converting to string first
    hex = `0x${handle.toString()}`;
  }
  
  // Ensure exactly 32 bytes (66 characters including 0x)
  if (hex.length < 66) {
    hex = hex.padEnd(66, '0');
  } else if (hex.length > 66) {
    hex = hex.substring(0, 66);
  }
  return hex;
};

// Convert proof to hex string
export const convertProof = (proof: Uint8Array): string => {
  return `0x${Array.from(proof).map(b => b.toString(16).padStart(2, '0')).join('')}`;
};

// Create encrypted donation input
export const createDonationInput = async (
  instance: FHEInstance,
  contractAddress: string,
  userAddress: string,
  amount: number,
  isAnonymous: boolean
) => {
  const input = instance.createEncryptedInput(contractAddress, userAddress);
  input.add32(amount);
  input.addBool(isAnonymous);
  
  const encryptedInput = await input.encrypt();
  
  return {
    handles: encryptedInput.handles.map(convertHex),
    inputProof: convertProof(encryptedInput.inputProof)
  };
};

// Create encrypted campaign input
export const createCampaignInput = async (
  instance: FHEInstance,
  contractAddress: string,
  userAddress: string,
  targetAmount: number
) => {
  const input = instance.createEncryptedInput(contractAddress, userAddress);
  input.add32(targetAmount);
  
  const encryptedInput = await input.encrypt();
  
  return {
    handles: encryptedInput.handles.map(convertHex),
    inputProof: convertProof(encryptedInput.inputProof)
  };
};

// Create encrypted impact report input
export const createImpactReportInput = async (
  instance: FHEInstance,
  contractAddress: string,
  userAddress: string,
  beneficiariesReached: number,
  fundsUtilized: number,
  impactMetrics: number
) => {
  const input = instance.createEncryptedInput(contractAddress, userAddress);
  input.add32(beneficiariesReached);
  input.add32(fundsUtilized);
  input.add32(impactMetrics);
  
  const encryptedInput = await input.encrypt();
  
  return {
    handles: encryptedInput.handles.map(convertHex),
    inputProof: convertProof(encryptedInput.inputProof)
  };
};

// Create encrypted verification input
export const createVerificationInput = async (
  instance: FHEInstance,
  contractAddress: string,
  userAddress: string,
  isVerified: boolean
) => {
  const input = instance.createEncryptedInput(contractAddress, userAddress);
  input.addBool(isVerified);
  
  const encryptedInput = await input.encrypt();
  
  return {
    handles: encryptedInput.handles.map(convertHex),
    inputProof: convertProof(encryptedInput.inputProof)
  };
};

// Create encrypted reputation input
export const createReputationInput = async (
  instance: FHEInstance,
  contractAddress: string,
  userAddress: string,
  reputation: number
) => {
  const input = instance.createEncryptedInput(contractAddress, userAddress);
  input.add32(reputation);
  
  const encryptedInput = await input.encrypt();
  
  return {
    handles: encryptedInput.handles.map(convertHex),
    inputProof: convertProof(encryptedInput.inputProof)
  };
};

// Decrypt campaign data
export const decryptCampaignData = async (
  instance: FHEInstance,
  contractAddress: string,
  userAddress: string,
  signer: any,
  encryptedData: {
    targetAmount: string;
    currentAmount: string;
    donorCount: string;
    impactScore: string;
    isActive: string;
    isVerified: string;
  }
) => {
  const handleContractPairs = [
    { handle: encryptedData.targetAmount, contractAddress },
    { handle: encryptedData.currentAmount, contractAddress },
    { handle: encryptedData.donorCount, contractAddress },
    { handle: encryptedData.impactScore, contractAddress },
    { handle: encryptedData.isActive, contractAddress },
    { handle: encryptedData.isVerified, contractAddress }
  ];

  const result = await instance.userDecrypt(handleContractPairs, userAddress, signer);
  
  return {
    targetAmount: result[encryptedData.targetAmount]?.toString() || '0',
    currentAmount: result[encryptedData.currentAmount]?.toString() || '0',
    donorCount: result[encryptedData.donorCount]?.toString() || '0',
    impactScore: result[encryptedData.impactScore]?.toString() || '0',
    isActive: result[encryptedData.isActive] || false,
    isVerified: result[encryptedData.isVerified] || false
  };
};

// Decrypt donation data
export const decryptDonationData = async (
  instance: FHEInstance,
  contractAddress: string,
  userAddress: string,
  signer: any,
  encryptedData: {
    amount: string;
    campaignId: string;
    isAnonymous: string;
  }
) => {
  const handleContractPairs = [
    { handle: encryptedData.amount, contractAddress },
    { handle: encryptedData.campaignId, contractAddress },
    { handle: encryptedData.isAnonymous, contractAddress }
  ];

  const result = await instance.userDecrypt(handleContractPairs, userAddress, signer);
  
  return {
    amount: result[encryptedData.amount]?.toString() || '0',
    campaignId: result[encryptedData.campaignId]?.toString() || '0',
    isAnonymous: result[encryptedData.isAnonymous] || false
  };
};

// Decrypt impact report data
export const decryptImpactReportData = async (
  instance: FHEInstance,
  contractAddress: string,
  userAddress: string,
  signer: any,
  encryptedData: {
    campaignId: string;
    beneficiariesReached: string;
    fundsUtilized: string;
    impactMetrics: string;
    isVerified: string;
  }
) => {
  const handleContractPairs = [
    { handle: encryptedData.campaignId, contractAddress },
    { handle: encryptedData.beneficiariesReached, contractAddress },
    { handle: encryptedData.fundsUtilized, contractAddress },
    { handle: encryptedData.impactMetrics, contractAddress },
    { handle: encryptedData.isVerified, contractAddress }
  ];

  const result = await instance.userDecrypt(handleContractPairs, userAddress, signer);
  
  return {
    campaignId: result[encryptedData.campaignId]?.toString() || '0',
    beneficiariesReached: result[encryptedData.beneficiariesReached]?.toString() || '0',
    fundsUtilized: result[encryptedData.fundsUtilized]?.toString() || '0',
    impactMetrics: result[encryptedData.impactMetrics]?.toString() || '0',
    isVerified: result[encryptedData.isVerified] || false
  };
};

// Decrypt donor profile data
export const decryptDonorProfileData = async (
  instance: FHEInstance,
  contractAddress: string,
  userAddress: string,
  signer: any,
  encryptedData: {
    totalDonated: string;
    donationCount: string;
    reputationScore: string;
    isVerified: string;
  }
) => {
  const handleContractPairs = [
    { handle: encryptedData.totalDonated, contractAddress },
    { handle: encryptedData.donationCount, contractAddress },
    { handle: encryptedData.reputationScore, contractAddress },
    { handle: encryptedData.isVerified, contractAddress }
  ];

  const result = await instance.userDecrypt(handleContractPairs, userAddress, signer);
  
  return {
    totalDonated: result[encryptedData.totalDonated]?.toString() || '0',
    donationCount: result[encryptedData.donationCount]?.toString() || '0',
    reputationScore: result[encryptedData.reputationScore]?.toString() || '0',
    isVerified: result[encryptedData.isVerified] || false
  };
};
