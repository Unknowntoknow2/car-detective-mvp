
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, ChevronRight } from "lucide-react";

export interface ComparisonSectionProps {
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
    <section className="py-24 px-4 bg-slate-50 border-y border-slate-200">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900">
            Free vs Premium Comparison
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            See how our Premium service provides the most comprehensive valuation data available 
            anywhere—combining CARFAX®, dealer offers, and advanced AI.
          </p>
        </div>
        
        <Card className="border-2 border-slate-200 shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="bg-white p-0">
            <div className="grid grid-cols-3 w-full">
              <div className="p-6 text-left font-semibold text-xl border-b border-r border-slate-200">
                Features
              </div>
              <div className="p-6 text-center font-semibold text-xl border-b border-r border-slate-200">
                <div className="flex flex-col items-center">
                  <span>Free</span>
                  <span className="text-base font-medium text-slate-500">$0</span>
                </div>
              </div>
              <div className="p-6 text-center font-semibold text-xl bg-primary/5 border-b border-slate-200">
                <div className="flex flex-col items-center">
                  <span>Premium</span>
                  <span className="text-base font-medium text-primary">$29.99</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  {features.map((feature, index) => (
                    <tr key={index} className={`border-b last:border-0 border-slate-200 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                      <td className="p-5 px-6 font-medium text-slate-800 w-1/2">{feature.name}</td>
                      <td className="p-5 text-center w-1/4">
                        {typeof feature.free === 'boolean' ? (
                          feature.free ? 
                            <Check className="h-6 w-6 text-green-500 mx-auto" /> : 
                            <X className="h-6 w-6 text-slate-300 mx-auto" />
                        ) : (
                          <span className="text-sm font-medium text-slate-700">{feature.free}</span>
                        )}
                      </td>
                      <td className="p-5 text-center w-1/4 bg-primary/5">
                        {typeof feature.premium === 'boolean' ? (
                          feature.premium ? 
                            <Check className="h-6 w-6 text-green-500 mx-auto" /> : 
                            <X className="h-6 w-6 text-slate-300 mx-auto" />
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
        
        <div className="mt-16 flex flex-col items-center">
          <Button 
            onClick={scrollToForm} 
            size="lg"
            className="bg-primary hover:bg-primary-hover text-white px-10 py-7 h-auto text-lg font-medium gap-2 rounded-xl shadow-md transition-all duration-300"
          >
            Get Premium Valuation Now
            <ChevronRight className="h-5 w-5" />
          </Button>
          <p className="mt-4 text-base text-slate-600">
            One-time purchase • CARFAX® report included ($44 value)
          </p>
        </div>
      </div>
    </section>
  );
}
