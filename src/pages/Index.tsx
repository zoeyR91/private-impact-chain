import { DonationHero } from "@/components/DonationHero";
import { CampaignCard } from "@/components/CampaignCard";
import { Header } from "@/components/Header";

const Index = () => {
  // Mock campaign data
  const campaigns = [
    {
      name: "Clean Water Initiative",
      description: "Providing access to clean drinking water in underserved communities worldwide",
      totalRaised: 2850000,
      goal: 5000000,
      donorCount: 12847,
      image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&h=300&fit=crop"
    },
    {
      name: "Education for All Foundation",
      description: "Building schools and providing educational resources for children in developing countries",
      totalRaised: 3200000,
      goal: 6000000,
      donorCount: 15632,
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop"
    },
    {
      name: "Climate Action Network",
      description: "Supporting environmental conservation and sustainable development projects",
      totalRaised: 890000,
      goal: 2000000,
      donorCount: 4521,
      image: "https://images.unsplash.com/photo-1541872705-1f73c6400ec9?w=400&h=300&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <div className="pt-20">
        <DonationHero />
      </div>
      
      {/* Campaigns Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Active Campaigns
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Support charitable causes you believe in while maintaining complete privacy. 
              All donations are encrypted and anonymous.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {campaigns.map((campaign, index) => (
              <CampaignCard
                key={index}
                {...campaign}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Connect your wallet and start making anonymous charitable donations today. 
            Your privacy is guaranteed, your impact is real.
          </p>
          
          <div className="flex justify-center">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Click "Connect Wallet & Donate" in the hero section above to get started
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
