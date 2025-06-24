
import React from 'react';
import { Zap, Shield, BarChart3 } from 'lucide-react';

export const ValuePropositionGrid: React.FC = () => {
  const propositions = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Results",
      description: "Get professional valuations in under 30 seconds with our AI-powered analysis engine.",
      color: "blue"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Market Precision",
      description: "Real-time market data and NADA-compliant methodology ensure accurate valuations.",
      color: "emerald"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Enterprise Security",
      description: "Bank-grade encryption and compliance standards protect your data and transactions.",
      color: "purple"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-50 text-blue-600",
      emerald: "bg-emerald-50 text-emerald-600", 
      purple: "bg-purple-50 text-purple-600"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why Professionals Choose Us
          </h2>
          <p className="text-lg text-gray-600">
            Built for automotive professionals, financial institutions, and enterprises who demand accuracy and reliability.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {propositions.map((prop, index) => (
            <div key={index} className="group text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${getColorClasses(prop.color)}`}>
                {prop.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {prop.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
