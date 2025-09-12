import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Shield, Users, DollarSign } from "lucide-react";
import { DonationModal } from "./DonationModal";

interface CampaignCardProps {
  name: string;
  description: string;
  totalRaised: number;
  goal: number;
  donorCount: number;
  image?: string;
}

export const CampaignCard = ({ 
  name, 
  description, 
  totalRaised, 
  goal, 
  donorCount, 
  image 
}: CampaignCardProps) => {
  const progressPercentage = (totalRaised / goal) * 100;
  
  return (
    <Card className="overflow-hidden shadow-campaign hover:shadow-encrypted transition-all duration-300 group">
      {image && (
        <div className="h-48 bg-gradient-hero relative overflow-hidden">
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
        </div>
      )}
      
      <CardHeader>
        <CardTitle className="text-xl font-bold text-primary">{name}</CardTitle>
        <CardDescription className="text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold">{progressPercentage.toFixed(1)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <DollarSign className="h-4 w-4 text-secondary" />
              <span className="text-2xl font-bold text-secondary">
                ${totalRaised.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Raised</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <Users className="h-4 w-4 text-accent" />
              <span className="text-2xl font-bold text-accent">
                {donorCount}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Anonymous Donors</p>
          </div>
        </div>
        
        {/* Goal */}
        <div className="text-center text-sm text-muted-foreground">
          Goal: <span className="font-semibold text-foreground">${goal.toLocaleString()}</span>
        </div>
        
        {/* Donate Button */}
        <DonationModal
          campaignName={name}
          trigger={
            <Button variant="campaign" className="w-full" size="lg">
              <Shield className="mr-2 h-4 w-4" />
              Donate Privately
            </Button>
          }
        />
      </CardContent>
    </Card>
  );
};