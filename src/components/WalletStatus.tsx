import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Shield, AlertCircle, CheckCircle, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WalletStatusProps {
  isConnected: boolean;
  walletAddress: string;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const WalletStatus = ({ isConnected, walletAddress, onConnect, onDisconnect }: WalletStatusProps) => {
  const [balance, setBalance] = useState<string>("0.00");
  const { toast } = useToast();

  useEffect(() => {
    if (isConnected) {
      // Simulate fetching wallet balance
      setBalance((Math.random() * 1000 + 100).toFixed(2));
    } else {
      setBalance("0.00");
    }
  }, [isConnected]);

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    });
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-6">
        {!isConnected ? (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-accent/10 rounded-full">
                <Wallet className="h-8 w-8 text-accent" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Connect Your Wallet</h3>
              <p className="text-sm text-muted-foreground">
                Connect your crypto wallet to start making anonymous donations
              </p>
            </div>
            <Button onClick={onConnect} variant="wallet" className="w-full" size="lg">
              <Wallet className="mr-2 h-5 w-5" />
              Connect Wallet
            </Button>
            <div className="text-xs text-muted-foreground">
              Supported: MetaMask, WalletConnect, Coinbase Wallet
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-semibold">Wallet Connected</span>
              </div>
              <Badge variant="secondary" className="text-green-600">
                <Shield className="mr-1 h-3 w-3" />
                Secure
              </Badge>
            </div>

            <div className="p-3 bg-accent/10 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="font-mono text-sm">{walletAddress}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={copyAddress}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-3 bg-primary/10 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Balance</p>
                  <p className="text-lg font-bold text-primary">${balance} USD</p>
                </div>
                <Wallet className="h-5 w-5 text-primary" />
              </div>
            </div>

            <div className="bg-privacy/10 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-privacy mt-0.5" />
                <div className="text-xs">
                  <p className="font-medium text-privacy">Privacy Protected</p>
                  <p className="text-muted-foreground">
                    All donations are encrypted and completely anonymous
                  </p>
                </div>
              </div>
            </div>

            <Button variant="outline" onClick={onDisconnect} className="w-full">
              Disconnect Wallet
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};