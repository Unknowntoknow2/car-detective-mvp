
import { CheckIcon, XIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function ComparisonTable() {
  const navigate = useNavigate();
  
  const features = [
    {
      name: "Price",
      free: "$0",
      premium: "$29.99"
    },
    {
      name: "Real-Time Market Data",
      free: "Basic",
      premium: "Advanced"
    },
    {
      name: "CARFAX Report",
      free: false,
      premium: true,
      highlight: "($44 value)"
    },
    {
      name: "AI Photo Scoring",
      free: false,
      premium: true
    },
    {
      name: "Dealer Offer Comparison",
      free: "Basic",
      premium: "Advanced"
    },
    {
      name: "12-Month Forecast",
      free: false,
      premium: true
    },
    {
      name: "Vehicle History",
      free: "Limited",
      premium: "Complete"
    }
  ];
  
  return (
    <section className="py-16 bg-surface-dark">
      <div className="container mx-auto max-w-4xl px-4">
        <h2 className="text-3xl font-semibold text-center mb-4">Free vs Premium Valuation</h2>
        <p className="text-center text-text-secondary mb-12 max-w-2xl mx-auto">
          Choose the option that best fits your needs
        </p>
        
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg border border-border/50 shadow-md">
            <thead>
              <tr className="bg-primary/5">
                <th className="py-4 px-6 text-left font-medium text-text-primary border-b border-border/50">Feature</th>
                <th className="py-4 px-6 text-center font-medium text-text-primary border-b border-border/50">Free</th>
                <th className="py-4 px-6 text-center font-medium text-text-primary border-b border-border/50">Premium</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-surface'}>
                  <td className="py-4 px-6 border-b border-border/30 font-medium">{feature.name}</td>
                  <td className="py-4 px-6 border-b border-border/30 text-center">
                    {typeof feature.free === 'boolean' ? (
                      feature.free ? 
                        <CheckIcon className="h-5 w-5 text-success mx-auto" /> : 
                        <XIcon className="h-5 w-5 text-gray-400 mx-auto" />
                    ) : (
                      <span>{feature.free}</span>
                    )}
                  </td>
                  <td className="py-4 px-6 border-b border-border/30 text-center">
                    {typeof feature.premium === 'boolean' ? (
                      feature.premium ? (
                        <div className="flex flex-col items-center">
                          <CheckIcon className="h-5 w-5 text-success mx-auto" />
                          {feature.highlight && <span className="text-xs text-success">{feature.highlight}</span>}
                        </div>
                      ) : (
                        <XIcon className="h-5 w-5 text-gray-400 mx-auto" />
                      )
                    ) : (
                      <span className="font-medium text-primary">{feature.premium}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary-hover text-white"
            onClick={() => navigate("/lookup/vin")}
          >
            Start Free Valuation
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate("/premium")}
            className="border-primary/30 text-primary hover:bg-primary-light/20"
          >
            Get Premium Valuation
          </Button>
        </div>
      </div>
    </section>
  );
}
