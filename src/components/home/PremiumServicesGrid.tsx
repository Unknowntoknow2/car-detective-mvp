
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, FileText, TrendingUp, Shield } from 'lucide-react';

const services = [
  {
    icon: Crown,
    title: "Premium Valuation",
    description: "Get the most accurate vehicle valuation with our premium service."
  },
  {
    icon: FileText,
    title: "Detailed Reports",
    description: "Comprehensive PDF reports with market analysis and insights."
  },
  {
    icon: TrendingUp,
    title: "Market Trends",
    description: "Real-time market data and pricing trends for informed decisions."
  },
  {
    icon: Shield,
    title: "Guaranteed Accuracy",
    description: "Our valuations are backed by extensive market research."
  }
];

export const PremiumServicesGrid: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Premium Services</h2>
          <p className="text-lg text-muted-foreground">
            Unlock advanced features with our premium offerings
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
