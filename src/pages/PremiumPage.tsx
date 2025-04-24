
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ManualEntryForm } from '@/components/lookup/ManualEntryForm';
import { VinDecoderForm } from '@/components/lookup/VinDecoderForm';
import { PlateDecoderForm } from '@/components/lookup/PlateDecoderForm';
import { useNavigate } from 'react-router-dom';
import { 
  BreadcrumbPath, 
  DesignCard, 
  FeatureItem, 
  SectionHeader 
} from '@/components/ui/design-system';
import { 
  CarFront, 
  FileText, 
  Search, 
  Award, 
  TrendingUp, 
  BarChart4, 
  ShieldCheck, 
  FileBarChart 
} from 'lucide-react';

export default function PremiumPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <main className="bg-surface min-h-screen pb-16 animate-fade-in">
      {/* Hero Section */}
      <div className="bg-gradient-primary text-white py-14 mb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <BreadcrumbPath 
            className="text-white/70 mb-8" 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Premium Valuation' }
            ]}
          />
          
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <SectionHeader
                title="Premium Vehicle Valuation"
                description="Unlock comprehensive insights with our professional-grade valuation service"
                variant="gradient"
                className="text-white"
                badge="CARFAX® Included"
                badgeVariant="outline"
                size="lg"
              />
              
              <ul className="space-y-3">
                {[
                  "Full CARFAX® history report integration",
                  "Dealer network price comparison",
                  "12-month value forecast with market trends",
                  "Personalized PDF report with detailed analysis"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center">
                      <CheckIcon className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-white/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="relative hidden md:block">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-xl transform -rotate-3"></div>
              <DesignCard 
                variant="glass" 
                className="relative transform rotate-3 border-white/30 shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                      <FileBarChart className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-semibold">Premium Report</span>
                  </div>
                  <div className="px-2 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                    +15% accuracy
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-8 w-3/4 bg-white/20 rounded-md"></div>
                  <div className="h-8 w-1/2 bg-white/20 rounded-md"></div>
                  <div className="h-24 bg-white/20 rounded-lg mt-4"></div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="h-12 bg-white/20 rounded-md"></div>
                    <div className="h-12 bg-white/20 rounded-md"></div>
                  </div>
                </div>
              </DesignCard>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Value Proposition Section */}
        <section className="mb-12">
          <SectionHeader
            title="Why Choose Premium Valuation"
            description="Get the most accurate and comprehensive vehicle valuation with our premium service"
            align="center"
            className="mb-10"
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Award className="h-5 w-5" />,
                title: "CARFAX® Integration",
                description: "Complete vehicle history analysis for maximum accuracy"
              },
              {
                icon: <TrendingUp className="h-5 w-5" />,
                title: "Market Trends",
                description: "Future value projections based on market data"
              },
              {
                icon: <BarChart4 className="h-5 w-5" />,
                title: "Dealer Comparison",
                description: "See how your vehicle compares to dealer listings"
              },
              {
                icon: <ShieldCheck className="h-5 w-5" />,
                title: "Confidence Score",
                description: "Know exactly how accurate your valuation is"
              }
            ].map((feature, i) => (
              <DesignCard 
                key={i} 
                variant="outline"
                className="hover:border-primary/30 hover:bg-primary-light/20 transition-all"
              >
                <FeatureItem
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              </DesignCard>
            ))}
          </div>
        </section>
        
        {/* Premium Alert */}
        <DesignCard 
          variant="premium" 
          className="border-warning/20 bg-warning-light/50"
        >
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-warning-light p-2 text-warning mt-0.5">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-warning-hover">Premium Advantage</h3>
              <p className="text-text-secondary mt-1">
                Our premium valuation includes verified CARFAX® accident and vehicle history data
                for up to 30% more accurate valuation compared to basic estimates.
              </p>
            </div>
          </div>
        </DesignCard>

        {/* Main Lookup Form */}
        <section>
          <SectionHeader
            title="Start Your Premium Valuation"
            description="Choose your preferred lookup method below"
            className="mb-6"
          />
          
          <Tabs defaultValue="vin" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 h-auto p-1 rounded-lg">
              <TabsTrigger 
                value="vin" 
                className="py-3 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <CarFront className="w-5 h-5" />
                  <span>VIN Lookup</span>
                </div>
              </TabsTrigger>
              
              <TabsTrigger 
                value="plate" 
                className="py-3 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <Search className="w-5 h-5" />
                  <span>Plate Lookup</span>
                </div>
              </TabsTrigger>
              
              <TabsTrigger 
                value="manual" 
                className="py-3 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <FileText className="w-5 h-5" />
                  <span>Manual Entry</span>
                </div>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="vin">
              <Card className="border-2 border-primary/20 shadow-lg rounded-xl">
                <CardHeader>
                  <SectionHeader
                    title="VIN Lookup"
                    description="Enter your Vehicle Identification Number for detailed information"
                    size="md"
                  />
                </CardHeader>
                <CardContent>
                  <VinDecoderForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="plate">
              <Card className="border-2 border-primary/20 shadow-lg rounded-xl">
                <CardHeader>
                  <SectionHeader
                    title="License Plate Lookup"
                    description="Look up vehicle details using a license plate number"
                    size="md"
                  />
                </CardHeader>
                <CardContent>
                  <PlateDecoderForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="manual">
              <Card className="border-2 border-primary/20 shadow-lg rounded-xl">
                <CardHeader>
                  <SectionHeader
                    title="Manual Entry"
                    description="Enter vehicle details manually for a custom valuation"
                    size="md"
                  />
                </CardHeader>
                <CardContent>
                  <ManualEntryForm 
                    onSubmit={async (data) => {
                      try {
                        setIsSubmitting(true);
                        const response = await fetch("/functions/car-price-prediction", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            ...data,
                            includeCarfax: true
                          })
                        });
                        
                        if (!response.ok) throw new Error('Failed to get valuation');
                        
                        const result = await response.json();
                        if (result?.id) {
                          navigate(`/valuation/${result.id}`);
                        }
                      } catch (error) {
                        console.error('Premium valuation error:', error);
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                    submitButtonText="Get Premium Valuation with CARFAX"
                    isPremium={true}
                    isLoading={isSubmitting}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </main>
  );
}

// Simple checkmark icon
const CheckIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);
