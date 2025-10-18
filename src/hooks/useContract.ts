import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { useFHE } from './useFHE';
import { 
  createDonationInput, 
  createCampaignInput, 
  createImpactReportInput,
  createVerificationInput,
  createReputationInput,
  decryptCampaignData,
  decryptDonationData,
  decryptImpactReportData,
  decryptDonorProfileData
} from '../lib/fheUtils';

// Contract ABI - This should match your deployed contract
const CONTRACT_ABI = [
  {
    "inputs": [
      {"internalType": "string", "name": "_name", "type": "string"},
      {"internalType": "string", "name": "_description", "type": "string"},
      {"internalType": "string", "name": "_category", "type": "string"},
      {"internalType": "bytes32", "name": "_targetAmount", "type": "bytes32"},
      {"internalType": "uint256", "name": "_duration", "type": "uint256"},
      {"internalType": "bytes", "name": "inputProof", "type": "bytes"}
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
      {"internalType": "uint256", "name": "campaignId", "type": "uint256"}
    ],
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
    "inputs": [
      {"internalType": "uint256", "name": "campaignId", "type": "uint256"}
    ],
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
  }
];

const CONTRACT_ADDRESS = process.env.VITE_SEPOLIA_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

export function useContract() {
  const { address } = useAccount();
  const { instance, isInitialized } = useFHE();
  const { writeContractAsync } = useWriteContract();

  // Create Campaign
  const createCampaign = async (
    name: string,
    description: string,
    category: string,
    targetAmount: number,
    duration: number
  ) => {
    if (!instance || !address) {
      throw new Error('FHE instance or wallet not initialized');
    }

    const encryptedInput = await createCampaignInput(
      instance,
      CONTRACT_ADDRESS,
      address,
      targetAmount
    );

    const tx = await writeContractAsync({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'createCampaign',
      args: [
        name,
        description,
        category,
        encryptedInput.handles[0],
        duration,
        encryptedInput.inputProof
      ]
    });

    return tx;
  };

  // Make Donation
  const makeDonation = async (
    campaignId: number,
    amount: number,
    isAnonymous: boolean
  ) => {
    if (!instance || !address) {
      throw new Error('FHE instance or wallet not initialized');
    }

    const encryptedInput = await createDonationInput(
      instance,
      CONTRACT_ADDRESS,
      address,
      amount,
      isAnonymous
    );

    const tx = await writeContractAsync({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'makeDonation',
      args: [
        campaignId,
        encryptedInput.handles[0],
        encryptedInput.handles[1],
        encryptedInput.inputProof
      ],
      value: BigInt(amount * 1e18) // Convert to wei
    });

    return tx;
  };

  // Submit Impact Report
  const submitImpactReport = async (
    campaignId: number,
    beneficiariesReached: number,
    fundsUtilized: number,
    impactMetrics: number,
    reportHash: string,
    evidenceHash: string
  ) => {
    if (!instance || !address) {
      throw new Error('FHE instance or wallet not initialized');
    }

    const encryptedInput = await createImpactReportInput(
      instance,
      CONTRACT_ADDRESS,
      address,
      beneficiariesReached,
      fundsUtilized,
      impactMetrics
    );

    const tx = await writeContractAsync({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'submitImpactReport',
      args: [
        campaignId,
        encryptedInput.handles[0],
        encryptedInput.handles[1],
        encryptedInput.handles[2],
        reportHash,
        evidenceHash,
        encryptedInput.inputProof
      ]
    });

    return tx;
  };

  // Get Campaign Data (with decryption)
  const getCampaignData = async (campaignId: number) => {
    if (!instance || !address) {
      throw new Error('FHE instance or wallet not initialized');
    }

    // Get basic campaign info
    const basicInfo = await useReadContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'getCampaignInfo',
      args: [campaignId]
    });

    // Get encrypted data
    const encryptedData = await useReadContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'getCampaignEncryptedData',
      args: [campaignId]
    });

    // Decrypt the encrypted data
    const decryptedData = await decryptCampaignData(
      instance,
      CONTRACT_ADDRESS,
      address,
      null, // signer would be needed for actual decryption
      {
        targetAmount: encryptedData.data?.[0] || '',
        currentAmount: encryptedData.data?.[1] || '',
        donorCount: encryptedData.data?.[2] || '',
        impactScore: encryptedData.data?.[3] || '',
        isActive: encryptedData.data?.[4] || '',
        isVerified: encryptedData.data?.[5] || ''
      }
    );

    return {
      ...basicInfo.data,
      ...decryptedData
    };
  };

  return {
    createCampaign,
    makeDonation,
    submitImpactReport,
    getCampaignData,
    isInitialized,
    contractAddress: CONTRACT_ADDRESS
  };
}
