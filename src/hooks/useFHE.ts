import { useState, useEffect } from 'react';
import { initSDK, createInstance, SepoliaConfig } from '@zama-fhe/relayer-sdk/bundle';
import type { FHEInstance } from '../types/fhe';

export function useFHE() {
  const [instance, setInstance] = useState<FHEInstance | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeFHE = async () => {
    try {
      setIsInitializing(true);
      setError(null);

      console.log('Loading FHE WASM...');
      await initSDK();

      console.log('Creating FHE instance...');
      const config = {
        ...SepoliaConfig
      };

      const fheInstance = await createInstance(config);

      setInstance(fheInstance as FHEInstance);
      setIsInitialized(true);
      console.log('FHE initialized successfully');

    } catch (err) {
      console.error('Failed to initialize FHE:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize FHE');
    } finally {
      setIsInitializing(false);
    }
  };

  const createEncryptedInput = (contractAddress: string, userAddress: string) => {
    if (!instance) {
      throw new Error('FHE instance not initialized');
    }
    return instance.createEncryptedInput(contractAddress, userAddress);
  };

  const generateKeypair = () => {
    if (!instance) {
      throw new Error('FHE instance not initialized');
    }
    return instance.generateKeypair();
  };

  const userDecrypt = async (
    handleContractPairs: Array<{ handle: Uint8Array; contractAddress: string }>,
    address: string,
    signer: any
  ) => {
    if (!instance) {
      throw new Error('FHE instance not initialized');
    }
    return await instance.userDecrypt(handleContractPairs, address, signer);
  };

  const userDecryptEuint = async (
    type: any,
    handle: Uint8Array,
    contractAddress: string,
    signer: any
  ) => {
    if (!instance) {
      throw new Error('FHE instance not initialized');
    }
    return await instance.userDecryptEuint(type, handle, contractAddress, signer);
  };

  useEffect(() => {
    initializeFHE();
  }, []);

  return {
    instance,
    isInitialized,
    isInitializing,
    error,
    initializeFHE,
    createEncryptedInput,
    generateKeypair,
    userDecrypt,
    userDecryptEuint
  };
}
