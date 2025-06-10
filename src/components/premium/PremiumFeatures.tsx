
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ValuationHistory } from "@/types/valuation-history";
import { Star, TrendingUp, FileText, Shield } from "lucide-react";

interface PremiumFeaturesProps {
  valuations?: ValuationHistory[];
}

const premiumFeatures = [
  {
    icon: TrendingUp,
    title: "Advanced Market Analysis",
    description: "Get detailed market trends and pricing insights for your vehicle type and region."
  },
  {
    icon: FileText,
    title: "Comprehensive Reports",
    description: "Receive detailed PDF reports with breakdown of all valuation factors."
  },
  {
    icon: Shield,
    title: "Vehicle History Integration",
    description: "Access integrated vehicle history reports from trusted sources."
  },
  {
    icon: Star,
    title: "Priority Support",
    description: "Get priority customer support and faster response times."
  }
];

export const PremiumFeatures = ({ valuations = [] }: PremiumFeaturesProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Premium Features</h2>
        <p className="text-muted-foreground">
          Unlock advanced vehicle valuation capabilities
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {premiumFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {valuations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Premium Valuations</CardTitle>
            <CardDescription>
              Recent premium valuations you've completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {valuations.slice(0, 3).map((valuation) => (
                <div key={valuation.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium">
                      {valuation.vehicle_info.year} {valuation.vehicle_info.make} {valuation.vehicle_info.model}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(valuation.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${valuation.valuation_amount.toLocaleString()}</p>
                    {valuation.is_premium && (
                      <Badge variant="default" className="bg-primary">Premium</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PremiumFeatures;
