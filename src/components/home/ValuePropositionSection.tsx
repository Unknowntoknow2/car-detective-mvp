
import React from 'react';
import { GaugeCircle, Database, TrendingUp, Calendar } from 'lucide-react';

export function ValuePropositionSection() {
  const features = [
    {
      icon: <GaugeCircle className="h-10 w-10 text-primary" />,
      title: 'Accurate Valuations',
      description: 'Powered by comprehensive market data and advanced algorithms for the most accurate valuations.'
    },
    {
      icon: <Database className="h-10 w-10 text-primary" />,
      title: 'Comprehensive Data',
      description: 'Integrated with CARFAX®, auction records, and dealer listings for complete market visibility.'
    },
    {
      icon: <TrendingUp className="h-10 w-10 text-primary" />,
      title: 'Market Analysis',
      description: 'Get detailed insights into market trends, price fluctuations, and demand factors.'
    },
    {
      icon: <Calendar className="h-10 w-10 text-primary" />,
      title: 'Future Predictions',
      description: 'AI-powered forecasting helps predict your vehicle\'s value over the next 12 months.'
    }
  ];

  return (
    <section className="bg-muted/30 py-16">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose CarDetective</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We combine powerful data sources, AI analysis, and industry expertise to deliver the most accurate vehicle valuations available.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-card border rounded-lg p-6 transition-all hover:shadow-md">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ValuePropositionSection;
