import React from 'react';
import { Button } from '@/components/ui/button';
import { Rocket, ShieldCheck, Search } from 'lucide-react';

const features = [
  {
    title: 'Instant Valuation',
    description: 'Get an accurate vehicle valuation in seconds.',
    icon: Rocket,
  },
  {
    title: 'Comprehensive Data',
    description: 'Access detailed vehicle information and history.',
    icon: ShieldCheck,
  },
  {
    title: 'Market Insights',
    description: 'Understand market trends and pricing dynamics.',
    icon: Search,
  },
];

export function EnhancedFeatures() {
  return (
    <section className="py-12 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Unlock the Power of Vehicle Intelligence
          </h2>
          <p className="mt-2 text-gray-600">
            Explore our advanced features designed to empower your decisions.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <feature.icon className="h-6 w-6 text-primary mr-2" />
                <h3 className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-700">{feature.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button
            variant="outline"
            size="lg"
            className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
          >
            Explore Premium Features
          </Button>
        </div>
      </div>
    </section>
  );
}
