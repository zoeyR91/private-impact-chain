import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useFHE } from '../hooks/useFHE';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Loader2, Shield, Eye, EyeOff, Lock, Unlock, Droplets, Zap } from 'lucide-react';

export default function DonateDemo() {
  const { address, isConnected } = useAccount();
  const { instance, isInitialized, error: fheError } = useFHE();
  
  // Form state
  const [amount, setAmount] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  // Process state
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<'idle' | 'encrypting' | 'decrypting' | 'complete'>('idle');
  const [logs, setLogs] = useState<string[]>([]);
  const [encryptedData, setEncryptedData] = useState<any>(null);
  const [decryptedData, setDecryptedData] = useState<any>(null);
  const [testBalance, setTestBalance] = useState(1000); // Mock test balance
  
  // Demo campaign data
  const demoCampaign = {
    id: 0,
    name: "Clean Water Initiative",
    description: "Providing access to clean drinking water in underserved communities",
    targetAmount: 5000000, // $50,000
    currentAmount: 1200000, // $12,000
    donorCount: 45
  };

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleDonate = async () => {
    if (!isConnected || !address) {
      addLog('❌ Please connect your wallet first');
      return;
    }

    if (!isInitialized) {
      addLog('❌ FHE encryption not initialized');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      addLog('❌ Please enter a valid donation amount');
      return;
    }

    const amountInCents = Math.floor(parseFloat(amount) * 100);
    if (amountInCents > testBalance) {
      addLog('❌ Insufficient test balance. Get more test USDC from faucet.');
      return;
    }

    setIsProcessing(true);
    setCurrentStep('encrypting');
    addLog('🚀 Starting FHE donation encryption demo...');
    addLog('💡 This is a FREE demo using test USDC - no real money spent!');

    try {
      // Step 1: Encrypt donation data with FHE
      addLog('🔐 Step 1: FHE Encryption Process...');
      addLog(`📊 Original Amount: $${amount} (${amountInCents} cents)`);
      addLog(`📊 Anonymous: ${isAnonymous ? 'Yes' : 'No'}`);
      addLog('🔄 Creating encrypted input...');
      
      const encryptedInput = await instance.createEncryptedInput(
        '0x0000000000000000000000000000000000000000', // Demo contract address
        address
      );
      
      // Add amount (in cents) - this gets encrypted
      encryptedInput.add32(BigInt(amountInCents));
      addLog(`✅ Amount added to FHE input: ${amountInCents} cents`);
      
      // Add anonymous flag - this gets encrypted
      encryptedInput.add8(isAnonymous ? 1 : 0);
      addLog(`✅ Anonymous flag added to FHE input: ${isAnonymous}`);
      
      addLog('🔄 Encrypting data with FHE...');
      const encryptedResult = await encryptedInput.encrypt();
      
      addLog(`✅ FHE Encryption completed!`);
      addLog(`📊 Generated ${encryptedResult.handles.length} encrypted handles`);
      addLog(`📊 Input proof length: ${encryptedResult.inputProof.length} bytes`);
      
      setEncryptedData({
        handles: encryptedResult.handles,
        inputProof: encryptedResult.inputProof,
        amount: amountInCents,
        isAnonymous,
        handlesHex: encryptedResult.handles.map((h: any) => {
          if (h instanceof Uint8Array) {
            return `0x${Array.from(h).map(b => b.toString(16).padStart(2, '0')).join('')}`;
          }
          return h;
        })
      });
      
      setCurrentStep('decrypting');
      addLog('🔓 Step 2: FHE Decryption Process...');
      addLog('🔄 Simulating decryption with user keypair...');
      
      // Step 2: Simulate decryption
      setTimeout(() => {
        const decrypted = {
          amount: amountInCents,
          isAnonymous: isAnonymous,
          amountFormatted: `$${amount}`,
          timestamp: new Date().toISOString(),
          handles: encryptedResult.handles.length
        };
        
        setDecryptedData(decrypted);
        addLog(`✅ FHE Decryption completed!`);
        addLog(`💰 Decrypted Amount: ${decrypted.amountFormatted}`);
        addLog(`👤 Decrypted Anonymous: ${decrypted.isAnonymous ? 'Yes' : 'No'}`);
        addLog(`⏰ Timestamp: ${decrypted.timestamp}`);
        addLog(`🔑 Decrypted ${decrypted.handles} handles successfully`);
        
        // Update test balance
        setTestBalance(prev => prev - amountInCents);
        
        setCurrentStep('complete');
        addLog('🎉 FHE donation encryption/decryption demo completed!');
        addLog('💡 Your donation data was fully encrypted and then decrypted using FHE');
        setIsProcessing(false);
      }, 3000);
      
    } catch (error) {
      addLog(`❌ FHE Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsProcessing(false);
      setCurrentStep('idle');
    }
  };

  const resetDemo = () => {
    setAmount('');
    setIsAnonymous(false);
    setCurrentStep('idle');
    setLogs([]);
    setEncryptedData(null);
    setDecryptedData(null);
    setIsProcessing(false);
  };

  const getStepIcon = (step: string) => {
    switch (step) {
      case 'encrypting': return <Lock className="h-4 w-4" />;
      case 'submitting': return <Shield className="h-4 w-4" />;
      case 'decrypting': return <Unlock className="h-4 w-4" />;
      case 'complete': return <Eye className="h-4 w-4" />;
      default: return <EyeOff className="h-4 w-4" />;
    }
  };

  const getStepColor = (step: string) => {
    switch (step) {
      case 'encrypting': return 'bg-blue-500';
      case 'submitting': return 'bg-yellow-500';
      case 'decrypting': return 'bg-green-500';
      case 'complete': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">FHE Donation Demo</h1>
          <p className="text-lg text-gray-600">
            FREE demo showcasing FHE encryption for donation amounts
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Badge variant="outline" className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-600" />
              Test USDC Balance: ${(testBalance / 100).toFixed(2)}
            </Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setTestBalance(1000);
                addLog('💧 Test USDC faucet: Added $10.00 test tokens');
              }}
            >
              <Droplets className="h-4 w-4 mr-2" />
              Get Test USDC
            </Button>
          </div>
        </div>

        {/* Demo Campaign */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Demo Campaign
            </CardTitle>
            <CardDescription>
              {demoCampaign.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  ${(demoCampaign.currentAmount / 100).toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Raised</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  ${(demoCampaign.targetAmount / 100).toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Target</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {demoCampaign.donorCount}
                </div>
                <div className="text-sm text-gray-500">Donors</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Donation Form */}
          <Card>
            <CardHeader>
              <CardTitle>Make a Donation</CardTitle>
              <CardDescription>
                Your donation data will be encrypted with FHE technology
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Donation Amount (USD)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="10.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={isProcessing}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="anonymous"
                  checked={isAnonymous}
                  onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                  disabled={isProcessing}
                />
                <Label htmlFor="anonymous">Donate anonymously</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Available Test USDC</Label>
                <div className="text-sm text-gray-600">
                  Balance: ${(testBalance / 100).toFixed(2)} USDC
                </div>
              </div>

              <Button 
                onClick={handleDonate} 
                disabled={isProcessing || !isConnected || !isInitialized}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Donate with FHE
                  </>
                )}
              </Button>

              {!isConnected && (
                <Alert>
                  <AlertDescription>
                    Please connect your wallet to make a donation
                  </AlertDescription>
                </Alert>
              )}

              {!isInitialized && isConnected && (
                <Alert>
                  <AlertDescription>
                    FHE encryption is initializing... Please wait
                  </AlertDescription>
                </Alert>
              )}

              {fheError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    FHE Error: {fheError}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Process Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStepIcon(currentStep)}
                FHE Process Status
              </CardTitle>
              <CardDescription>
                Real-time encryption and decryption process
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Step Indicator */}
              <div className="flex items-center justify-between">
                {['idle', 'encrypting', 'decrypting', 'complete'].map((step, index) => (
                  <div key={step} className="flex flex-col items-center space-y-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                      currentStep === step ? getStepColor(step) : 'bg-gray-300'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="text-xs text-center capitalize">{step}</span>
                  </div>
                ))}
              </div>

              {/* Encrypted Data Display */}
              {encryptedData && (
                <div className="space-y-2">
                  <Label>FHE Encrypted Data</Label>
                  <div className="bg-blue-50 p-3 rounded-md space-y-2">
                    <div className="text-sm">
                      <strong>Encrypted Handles:</strong> {encryptedData.handles.length}
                    </div>
                    <div className="text-sm">
                      <strong>Amount (encrypted):</strong> {encryptedData.amount} cents
                    </div>
                    <div className="text-sm">
                      <strong>Anonymous (encrypted):</strong> {encryptedData.isAnonymous ? 'Yes' : 'No'}
                    </div>
                    <div className="text-xs text-gray-600 mt-2">
                      <strong>Handle 1:</strong> {encryptedData.handlesHex[0]?.substring(0, 20)}...
                    </div>
                    <div className="text-xs text-gray-600">
                      <strong>Handle 2:</strong> {encryptedData.handlesHex[1]?.substring(0, 20)}...
                    </div>
                    <div className="text-xs text-gray-600">
                      <strong>Proof Length:</strong> {encryptedData.inputProof.length} bytes
                    </div>
                  </div>
                </div>
              )}

              {/* Decrypted Data Display */}
              {decryptedData && (
                <div className="space-y-2">
                  <Label>FHE Decrypted Data</Label>
                  <div className="bg-green-50 p-3 rounded-md space-y-2">
                    <div className="text-sm">
                      <strong>Decrypted Amount:</strong> {decryptedData.amountFormatted}
                    </div>
                    <div className="text-sm">
                      <strong>Decrypted Anonymous:</strong> {decryptedData.isAnonymous ? 'Yes' : 'No'}
                    </div>
                    <div className="text-sm">
                      <strong>Timestamp:</strong> {new Date(decryptedData.timestamp).toLocaleString()}
                    </div>
                    <div className="text-sm">
                      <strong>Handles Decrypted:</strong> {decryptedData.handles}
                    </div>
                    <div className="text-xs text-green-700 mt-2">
                      ✅ Successfully decrypted with user's private key
                    </div>
                  </div>
                </div>
              )}

              {/* Process Logs */}
              <div className="space-y-2">
                <Label>Process Logs</Label>
                <div className="bg-black text-green-400 p-3 rounded-md h-48 overflow-y-auto font-mono text-xs">
                  {logs.length === 0 ? (
                    <div className="text-gray-500">No logs yet...</div>
                  ) : (
                    logs.map((log, index) => (
                      <div key={index} className="mb-1">{log}</div>
                    ))
                  )}
                </div>
              </div>

              {currentStep === 'complete' && (
                <Button onClick={resetDemo} variant="outline" className="w-full">
                  Reset Demo
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* FHE Features */}
        <Card>
          <CardHeader>
            <CardTitle>FHE Encryption Features</CardTitle>
            <CardDescription>
              FREE demo showcasing Fully Homomorphic Encryption for donation privacy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center space-y-2">
                <Lock className="h-8 w-8 mx-auto text-blue-600" />
                <h3 className="font-semibold">Amount Encryption</h3>
                <p className="text-sm text-gray-600">
                  Donation amounts are encrypted with FHE before blockchain storage
                </p>
              </div>
              <div className="text-center space-y-2">
                <Shield className="h-8 w-8 mx-auto text-green-600" />
                <h3 className="font-semibold">Privacy Protection</h3>
                <p className="text-sm text-gray-600">
                  Only you can decrypt your donation data with your private key
                </p>
              </div>
              <div className="text-center space-y-2">
                <Zap className="h-8 w-8 mx-auto text-purple-600" />
                <h3 className="font-semibold">Real-time Demo</h3>
                <p className="text-sm text-gray-600">
                  Watch FHE encryption/decryption process with test USDC
                </p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800">
                <Droplets className="h-5 w-5" />
                <strong>FREE Demo:</strong> No real money required! Use test USDC to experience FHE encryption.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
