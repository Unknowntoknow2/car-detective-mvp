
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, DollarSign, Clock, Users } from 'lucide-react';

const features = [
  {
    icon: DollarSign,
    title: "Free Basic Valuation",
    description: "Get instant vehicle estimates at no cost"
  },
  {
    icon: Clock,
    title: "Quick Results",
    description: "Receive valuations in under 60 seconds"
  },
  {
    icon: Users,
    title: "Trusted by Thousands",
    description: "Join our community of satisfied users"
  },
  {
    icon: CheckCircle,
    title: "Accurate Data",
    description: "Powered by real market data and analytics"
  }
];

export const ValuePropositionSection: React.FC = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Car Detective?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We provide the most accurate and comprehensive vehicle valuations using cutting-edge technology and real market data.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
