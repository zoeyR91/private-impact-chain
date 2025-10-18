import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useFHE } from '../hooks/useFHE';
import { useEthersSigner } from '../hooks/useEthersSigner';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Loader2, Shield, Eye, EyeOff, Lock, Unlock, Heart, ArrowLeft, CheckCircle, History, DollarSign, User, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { decryptDonationData } from '../lib/fheUtils';

interface DonationRecord {
  id: string;
  campaignId: string;
  amount: string;
  isAnonymous: boolean;
  timestamp: string;
  status: 'encrypted' | 'decrypted';
  encryptedData?: {
    amount: string;
    campaignId: string;
    isAnonymous: string;
  };
  decryptedData?: {
    amount: string;
    campaignId: string;
    isAnonymous: boolean;
  };
}

export default function DonationHistory() {
  const { address, isConnected } = useAccount();
  const { instance, isInitialized, error: fheError } = useFHE();
  const signerPromise = useEthersSigner();
  
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Mock donation data (in real app, this would come from contract)
  const mockDonations: DonationRecord[] = [
    {
      id: '1',
      campaignId: '0',
      amount: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      isAnonymous: false,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      status: 'encrypted',
      encryptedData: {
        amount: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        campaignId: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        isAnonymous: '0x0000000000000000000000000000000000000000000000000000000000000001'
      }
    },
    {
      id: '2',
      campaignId: '0',
      amount: '0x2345678901bcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      isAnonymous: false,
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      status: 'encrypted',
      encryptedData: {
        amount: '0x2345678901bcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        campaignId: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        isAnonymous: '0x0000000000000000000000000000000000000000000000000000000000000000'
      }
    },
    {
      id: '3',
      campaignId: '1',
      amount: '0x3456789012cdef1234567890abcdef1234567890abcdef1234567890abcdef',
      isAnonymous: false,
      timestamp: new Date(Date.now() - 259200000).toISOString(),
      status: 'encrypted',
      encryptedData: {
        amount: '0x3456789012cdef1234567890abcdef1234567890abcdef1234567890abcdef',
        campaignId: '0xbcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        isAnonymous: '0x0000000000000000000000000000000000000000000000000000000000000001'
      }
    }
  ];

  useEffect(() => {
    if (isConnected && address) {
      setDonations(mockDonations);
      addLog('📊 Loaded encrypted donation history');
    }
  }, [isConnected, address]);

  const handleDecryptDonation = async (donationId: string) => {
    if (!isConnected || !address) {
      addLog('❌ Please connect your wallet first');
      return;
    }

    if (!isInitialized) {
      addLog('❌ FHE encryption not initialized');
      return;
    }

    if (!signerPromise) {
      addLog('❌ Wallet signer not available');
      return;
    }

    setIsDecrypting(donationId);
    addLog(`🔓 Starting decryption for donation ${donationId}...`);

    try {
      const donation = donations.find(d => d.id === donationId);
      if (!donation || !donation.encryptedData) {
        throw new Error('Donation data not found');
      }

      addLog('🔄 Step 1: Preparing encrypted data...');
      const encryptedHandles = [
        donation.encryptedData.amount,
        donation.encryptedData.campaignId,
        donation.encryptedData.isAnonymous
      ];
      addLog(`📊 Encrypted handles: ${encryptedHandles.length}`);

      addLog('🔄 Step 2: Getting wallet signer...');
      const signer = await signerPromise;
      addLog('✅ Wallet signer obtained');

      addLog('🔄 Step 3: Decrypting with FHE...');
      const contractAddress = process.env.VITE_SEPOLIA_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';
      
      const decryptedResult = await decryptDonationData(
        instance,
        encryptedHandles,
        contractAddress,
        address,
        signer
      );

      addLog('✅ Step 3 completed: FHE decryption successful');
      addLog(`📊 Decrypted data keys: ${Object.keys(decryptedResult).length}`);

      addLog('🔄 Step 4: Parsing decrypted data...');
      const decryptedData = {
        amount: decryptedResult[donation.encryptedData.amount]?.toString() || '0',
        campaignId: decryptedResult[donation.encryptedData.campaignId]?.toString() || '0',
        isAnonymous: decryptedResult[donation.encryptedData.isAnonymous] === '1'
      };

      addLog(`💰 Decrypted amount: ${(parseInt(decryptedData.amount) / 100).toFixed(2)} USD`);
      addLog(`📋 Decrypted campaign ID: ${decryptedData.campaignId}`);
      addLog(`👤 Decrypted anonymous: ${decryptedData.isAnonymous ? 'Yes' : 'No'}`);

      // Update donation record
      setDonations(prev => prev.map(d => 
        d.id === donationId 
          ? { 
              ...d, 
              status: 'decrypted' as const,
              decryptedData,
              amount: `${(parseInt(decryptedData.amount) / 100).toFixed(2)} USD`
            }
          : d
      ));

      addLog('🎉 Donation decryption completed successfully!');
      addLog('💡 Your private donation data has been decrypted and is now visible');

    } catch (error) {
      addLog(`❌ Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Decryption error:', error);
    } finally {
      setIsDecrypting(null);
    }
  };

  const handleDecryptAll = async () => {
    const encryptedDonations = donations.filter(d => d.status === 'encrypted');
    
    for (const donation of encryptedDonations) {
      await handleDecryptDonation(donation.id);
      // Add delay between decryptions
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              Wallet Required
            </CardTitle>
            <CardDescription>
              Please connect your wallet to view donation history
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link to="/">
              <Button className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Donation History</h1>
          </div>
          <p className="text-lg text-gray-600">
            View and decrypt your private donation data
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <History className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{donations.length}</p>
                  <p className="text-sm text-gray-600">Total Donations</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Eye className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{donations.filter(d => d.status === 'decrypted').length}</p>
                  <p className="text-sm text-gray-600">Decrypted</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Lock className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">{donations.filter(d => d.status === 'encrypted').length}</p>
                  <p className="text-sm text-gray-600">Encrypted</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button 
            onClick={handleDecryptAll}
            disabled={donations.filter(d => d.status === 'encrypted').length === 0}
            variant="outline"
          >
            <Unlock className="mr-2 h-4 w-4" />
            Decrypt All
          </Button>
        </div>

        {/* Donations List */}
        <div className="space-y-4">
          {donations.map((donation) => (
            <Card key={donation.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-600" />
                    Donation #{donation.id}
                  </CardTitle>
                  <Badge variant={donation.status === 'decrypted' ? 'default' : 'secondary'}>
                    {donation.status === 'decrypted' ? (
                      <>
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Decrypted
                      </>
                    ) : (
                      <>
                        <Lock className="mr-1 h-3 w-3" />
                        Encrypted
                      </>
                    )}
                  </Badge>
                </div>
                <CardDescription>
                  Campaign ID: {donation.campaignId} • {new Date(donation.timestamp).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {donation.status === 'decrypted' && donation.decryptedData ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="text-sm font-medium">Amount</p>
                          <p className="text-lg font-bold">{donation.amount}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium">Anonymous</p>
                          <p className="text-lg font-bold">{donation.decryptedData.isAnonymous ? 'Yes' : 'No'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-purple-600" />
                        <div>
                          <p className="text-sm font-medium">Campaign</p>
                          <p className="text-lg font-bold">#{donation.decryptedData.campaignId}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-md">
                      <p className="text-sm text-green-700">
                        ✅ This donation data has been successfully decrypted with your private key
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-orange-50 p-3 rounded-md">
                      <p className="text-sm text-orange-700">
                        🔐 This donation data is encrypted. Click "Decrypt" to view with your private key.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleDecryptDonation(donation.id)}
                        disabled={isDecrypting === donation.id}
                        size="sm"
                      >
                        {isDecrypting === donation.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Decrypting...
                          </>
                        ) : (
                          <>
                            <Unlock className="mr-2 h-4 w-4" />
                            Decrypt
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Process Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Decryption Process Logs</CardTitle>
            <CardDescription>
              Real-time FHE decryption process logs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-black text-green-400 p-3 rounded-md h-48 overflow-y-auto font-mono text-xs">
              {logs.length === 0 ? (
                <div className="text-gray-500">No logs yet...</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index}>{log}</div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* FHE Status */}
        {fheError && (
          <Alert>
            <AlertDescription>
              FHE Error: {fheError}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
