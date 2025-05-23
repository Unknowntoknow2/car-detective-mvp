
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

export const PremiumFeatures: React.FC = () => {
  const features = [
    {
      title: 'Comprehensive Market Analysis',
      description: 'Get detailed insights into current market trends and how they affect your vehicle\'s value',
      icon: Check,
    },
    {
      title: 'CARFAX Integration',
      description: 'See how your vehicle history impacts its value with full CARFAX report analysis',
      icon: Check,
    },
    {
      title: 'Condition Assessment',
      description: 'AI-powered condition analysis based on detailed vehicle information',
      icon: Check,
    },
    {
      title: 'Personalized Value Adjustments',
      description: 'See exactly how each feature and factor affects your vehicle\'s value',
      icon: Check,
    },
    {
      title: 'Premium PDF Report',
      description: 'Download a professional, detailed valuation report with all insights',
      icon: Check,
    },
    {
      title: 'Future Value Projection',
      description: 'Understand how your vehicle\'s value may change in the coming months',
      icon: Check,
    },
  ];

  return (
    <section className="py-12 bg-background">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Premium Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our premium valuation provides you with comprehensive insights beyond just a number
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border border-primary/10">
              <CardHeader>
                <feature.icon className="h-6 w-6 text-primary mb-2" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
