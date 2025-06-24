
import React from 'react';
import { Shield, Users, Clock, Award } from 'lucide-react';

export const TrustIndicatorsSection: React.FC = () => {
  const indicators = [
    {
      icon: <Users className="w-6 h-6" />,
      value: "50K+",
      label: "Professional Users"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      value: "<30s",
      label: "Average Response"
    },
    {
      icon: <Award className="w-6 h-6" />,
      value: "NADA",
      label: "Standards Certified"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      value: "SOC 2",
      label: "Security Compliant"
    }
  ];

  return (
    <section className="py-12 bg-white border-b border-gray-100">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {indicators.map((indicator, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-50 rounded-xl mb-3">
                <div className="text-gray-600">
                  {indicator.icon}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {indicator.value}
              </div>
              <div className="text-sm text-gray-600">
                {indicator.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
