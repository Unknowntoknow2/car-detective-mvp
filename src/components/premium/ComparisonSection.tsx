
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, ChevronRight } from "lucide-react";

interface ComparisonSectionProps {
  scrollToForm: () => void;
}

export function ComparisonSection({ scrollToForm }: ComparisonSectionProps) {
  const features = [
    { name: 'VIN/Plate/Manual Lookup', free: true, premium: true },
    { name: 'Basic Market Estimate', free: true, premium: true },
    { name: 'Single Photo AI Scoring', free: true, premium: true },
    { name: 'Multi-Photo AI Analysis', free: false, premium: true },
    { name: 'Full CARFAX® History Report', free: false, premium: true },
    { name: 'Limited CARFAX® Preview', free: 'Basic', premium: 'Complete' },
    { name: 'Feature-Based Value Adjustments', free: false, premium: true },
    { name: 'Dealer-Beat Offers', free: false, premium: true },
    { name: 'Open Marketplace Pricing', free: false, premium: true },
    { name: '12-Month Value Forecast', free: false, premium: true },
    { name: 'Professional PDF Report', free: 'Basic', premium: 'Complete' },
    { name: 'Save & Retrieve Reports', free: '3 Reports', premium: 'Unlimited' },
  ];
  
  return (
    <section className="py-20 px-4 bg-surface">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold">
            Free vs Premium Comparison
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            See how our Premium service provides the most comprehensive valuation data available 
            anywhere—combining CARFAX®, dealer offers, and advanced AI.
          </p>
        </div>
        
        <Card className="border-2 border-border shadow-lg rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-6 font-medium text-lg w-1/2">Features</th>
                    <th className="p-6 font-medium text-lg text-center w-1/4">
                      <div className="flex flex-col items-center">
                        <span>Free</span>
                        <span className="text-sm font-normal text-text-secondary">$0</span>
                      </div>
                    </th>
                    <th className="p-6 font-medium text-lg text-center w-1/4 bg-primary/5">
                      <div className="flex flex-col items-center">
                        <span>Premium</span>
                        <span className="text-sm font-normal text-primary">$29.99</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature, index) => (
                    <tr key={index} className={`border-b last:border-0 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/10'}`}>
                      <td className="p-4 px-6 font-medium">{feature.name}</td>
                      <td className="p-4 text-center">
                        {typeof feature.free === 'boolean' ? (
                          feature.free ? 
                            <Check className="h-5 w-5 text-success mx-auto" /> : 
                            <X className="h-5 w-5 text-muted-foreground mx-auto" />
                        ) : (
                          <span className="text-sm">{feature.free}</span>
                        )}
                      </td>
                      <td className="p-4 text-center bg-primary/5">
                        {typeof feature.premium === 'boolean' ? (
                          feature.premium ? 
                            <Check className="h-5 w-5 text-success mx-auto" /> : 
                            <X className="h-5 w-5 text-muted-foreground mx-auto" />
                        ) : (
                          <span className="text-sm font-medium text-primary">{feature.premium}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-10 flex flex-col items-center">
          <Button 
            onClick={scrollToForm} 
            className="button-3d gap-2"
            size="lg"
          >
            Get Premium Valuation Now
            <ChevronRight className="h-4 w-4" />
          </Button>
          <p className="mt-3 text-sm text-text-secondary">
            One-time purchase • CARFAX® report included ($44 value)
          </p>
        </div>
      </div>
    </section>
  );
}
