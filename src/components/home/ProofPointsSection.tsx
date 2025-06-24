
import React from 'react';
import { CheckCircle } from 'lucide-react';

export const ProofPointsSection: React.FC = () => {
  const proofPoints = [
    {
      category: "Data Sources",
      points: [
        "Live auction data integration",
        "Multi-source market aggregation", 
        "Real-time pricing updates"
      ]
    },
    {
      category: "Security & Compliance",
      points: [
        "SOC 2 Type II certified",
        "GDPR & CCPA compliant",
        "256-bit encryption standard"
      ]
    },
    {
      category: "Industry Standards",
      points: [
        "NADA methodology alignment",
        "Financial institution approved",
        "Automotive dealer integrated"
      ]
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
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
          {proofPoints.map((section, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                {section.category}
              </h3>
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
