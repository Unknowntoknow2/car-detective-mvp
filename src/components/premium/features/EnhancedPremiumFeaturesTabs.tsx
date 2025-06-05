
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Camera, TrendingUp, FileText } from "lucide-react";

export function EnhancedPremiumFeaturesTabs() {
  const features = [
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "CARFAX® Integration",
      description: "Complete vehicle history report included",
      badge: "$44 Value",
    },
    {
      icon: <Camera className="h-8 w-8 text-green-600" />,
      title: "AI Photo Analysis",
      description: "Advanced condition assessment using AI",
      badge: "Premium",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
      title: "Market Analysis",
      description: "Comprehensive market trends and forecasting",
      badge: "Exclusive",
    },
    {
      icon: <FileText className="h-8 w-8 text-orange-600" />,
      title: "Professional Report",
      description: "Detailed PDF report for sharing",
      badge: "Included",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Premium Features</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our premium valuation includes advanced features that provide
            comprehensive insights into your vehicle's value and market position.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gray-100 rounded-full">
                    {feature.icon}
                  </div>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <Badge variant="secondary" className="w-fit mx-auto">
                  {feature.badge}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
