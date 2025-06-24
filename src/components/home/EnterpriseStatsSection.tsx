
import React from 'react';
import { TrendingUp, Users, Globe, Award } from 'lucide-react';

export const EnterpriseStatsSection: React.FC = () => {
  const stats = [
    {
      icon: <Users className="w-8 h-8" />,
      value: "100K+",
      label: "Valuations Completed",
      subtext: "Professional grade analysis"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      value: "95%+",
      label: "Market Accuracy Rate",
      subtext: "Industry benchmarked"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      value: "50+",
      label: "US States Covered",
      subtext: "Complete market coverage"
    },
    {
      icon: <Award className="w-8 h-8" />,
      value: "NADA",
      label: "Standards Compliant",
      subtext: "Industry certified methodology"
    }
  ];

  return (
    <section className="py-16 bg-slate-50 border-y border-slate-200">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm group-hover:shadow-md transition-shadow duration-300 mb-4">
                <div className="text-primary">
                  {stat.icon}
                </div>
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-lg font-semibold text-gray-700 mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-gray-500">
                {stat.subtext}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
