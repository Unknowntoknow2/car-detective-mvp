
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

export function ComparisonTable() {
  const features = [
    { name: 'Base Price', free: '$0', premium: '$29.99' },
    { name: 'Real-Time Market Data', free: 'Basic', premium: 'Advanced' },
    { name: 'CARFAX Report', free: false, premium: true },
    { name: 'AI Photo Scoring', free: false, premium: true },
    { name: 'Dealer Offer Comparison', free: 'Basic', premium: 'Advanced' },
    { name: '12-Month Forecast', free: false, premium: true },
  ];

  return (
    <section className="py-16 bg-surface">
      <div className="container mx-auto max-w-6xl px-4">
        <CardHeader className="text-center mb-8">
          <CardTitle className="text-3xl font-semibold">Free vs Premium Valuation</CardTitle>
        </CardHeader>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-medium">Features</th>
                    <th className="p-4 font-medium text-center">Free</th>
                    <th className="p-4 font-medium text-center bg-primary/5">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="p-4">{feature.name}</td>
                      <td className="p-4 text-center">
                        {typeof feature.free === 'boolean' ? (
                          feature.free ? <Check className="h-5 w-5 text-success mx-auto" /> : "—"
                        ) : (
                          feature.free
                        )}
                      </td>
                      <td className="p-4 text-center bg-primary/5">
                        {typeof feature.premium === 'boolean' ? (
                          feature.premium ? <Check className="h-5 w-5 text-success mx-auto" /> : "—"
                        ) : (
                          feature.premium
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
