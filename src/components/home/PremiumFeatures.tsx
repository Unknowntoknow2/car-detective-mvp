
import React from 'react';
import { CheckCircle, BarChart3, Shield, Award } from 'lucide-react';

export const PremiumFeatures: React.FC = () => {
  const features = [
    {
      category: "Data Sources",
      icon: <BarChart3 className="w-6 h-6" />,
      points: [
        "Live auction data integration",
        "Multi-source market aggregation", 
        "Real-time pricing updates",
        "Historical trend analysis"
      ]
    },
    {
      category: "Security & Compliance",
      icon: <Shield className="w-6 h-6" />,
      points: [
        "Enterprise-grade encryption",
        "Privacy protection standards",
        "Secure data transmission",
        "Compliance monitoring"
      ]
    },
    {
      category: "Professional Standards",
      icon: <Award className="w-6 h-6" />,
      points: [
        "Industry methodology alignment",
        "Financial institution approved",
        "Automotive dealer integrated",
        "Professional accuracy guarantee"
      ]
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Built on Proven Standards
          </h2>
          <p className="text-lg text-gray-600">
            Our platform meets the rigorous requirements of automotive and financial professionals.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((section, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-8 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-4">
                  {section.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {section.category}
                </h3>
              </div>
              <ul className="space-y-3">
                {section.points.map((point, pointIndex) => (
                  <li key={pointIndex} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
