import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Shield, Lock, DollarSign, Wallet, CheckCircle, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useDisconnect } from 'wagmi';

interface DonationModalProps {
  campaignName: string;
  trigger: React.ReactNode;
}

export const DonationModal = ({ campaignName, trigger }: DonationModalProps) => {
  const [donationAmount, setDonationAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [step, setStep] = useState<'connect' | 'amount' | 'confirm' | 'processing' | 'complete'>('connect');
  const { toast } = useToast();
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const handleConnectWallet = () => {
    open();
  };

  const handleWalletConnected = () => {
    if (isConnected) {
      setStep('amount');
    }
  };

  const handleAmountSubmit = () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid donation amount",
        variant: "destructive",
      });
      return;
    }
    setStep('confirm');
  };

  const handleConfirmDonation = async () => {
    setStep('processing');
    setIsProcessing(true);
    
    // Simulate donation processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsProcessing(false);
    setIsComplete(true);
    setStep('complete');
    
    toast({
      title: "Donation Successful",
      description: "Your anonymous donation has been processed securely",
    });
  };

  const resetModal = () => {
    setStep('connect');
    setDonationAmount("");
    setIsComplete(false);
    setIsProcessing(false);
  };

  // Listen for wallet connection changes
  React.useEffect(() => {
    if (isConnected && step === 'connect') {
      setStep('amount');
    }
  }, [isConnected, step]);

  return (
    <Dialog onOpenChange={(open) => !open && resetModal()}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Anonymous Donation
          </DialogTitle>
          <DialogDescription>
            Donate to {campaignName} with complete privacy protection
          </DialogDescription>
        </DialogHeader>

        {step === 'connect' && (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Wallet className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Connect Your Wallet</h3>
                <p className="text-sm text-muted-foreground">
                  To make a donation, you need to connect your Web3 wallet first.
                </p>
              </div>
            </div>

            <div className="bg-accent/10 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-accent mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Privacy Protected</p>
                  <p className="text-xs text-muted-foreground">
                    Your wallet connection is secure and your donation will remain completely anonymous.
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={handleConnectWallet} className="w-full" size="lg">
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
          </div>
        )}

        {step === 'amount' && (
          <div className="space-y-6">
            {/* Wallet Info */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-800">Wallet Connected</p>
                    <p className="text-xs text-green-600">
                      {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connected'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    disconnect();
                    setStep('connect');
                  }}
                  className="text-green-700 border-green-300 hover:bg-green-100"
                >
                  Disconnect
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Donation Amount (USD)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  className="pl-10"
                  min="1"
                  step="0.01"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[25, 50, 100].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setDonationAmount(amount.toString())}
                >
                  ${amount}
                </Button>
              ))}
            </div>

            <div className="bg-accent/10 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-accent mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Privacy Guaranteed</p>
                  <p className="text-xs text-muted-foreground">
                    Your donation amount and identity will be completely encrypted and anonymous.
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={handleAmountSubmit} className="w-full" size="lg">
              Continue to Confirmation
            </Button>
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <h3 className="text-2xl font-bold text-primary">${donationAmount}</h3>
                <p className="text-sm text-muted-foreground">to {campaignName}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Donation Amount:</span>
                <span className="font-semibold">${donationAmount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Processing Fee:</span>
                <span className="font-semibold">$0.00</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Privacy Protection:</span>
                <span className="font-semibold text-accent">✓ Enabled</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-lg">${donationAmount}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep('amount')} className="flex-1">
                Back
              </Button>
              <Button onClick={handleConfirmDonation} className="flex-1" size="lg">
                <Wallet className="mr-2 h-4 w-4" />
                Confirm Donation
              </Button>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="text-center space-y-6 py-8">
            <div className="animate-spin mx-auto h-12 w-12 rounded-full border-4 border-primary border-t-transparent"></div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Processing Your Donation</h3>
              <p className="text-sm text-muted-foreground">
                Encrypting your donation and ensuring complete anonymity...
              </p>
            </div>
          </div>
        )}

        {step === 'complete' && (
          <div className="text-center space-y-6 py-8">
            <div className="mx-auto h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Donation Complete!</h3>
              <p className="text-sm text-muted-foreground">
                Your ${donationAmount} donation to {campaignName} has been processed anonymously.
              </p>
            </div>
            <div className="bg-accent/10 p-4 rounded-lg">
              <p className="text-xs text-muted-foreground">
                Transaction ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};