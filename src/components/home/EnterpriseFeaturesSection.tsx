
import React from 'react';
import { Shield, BarChart3, Clock, Award, Database, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const EnterpriseFeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Enterprise Security",
      description: "Financial-grade encryption with comprehensive compliance standards and audit capabilities.",
      benefits: ["AES-256 encryption", "Multi-factor authentication", "Complete audit trails"]
    },
    {
      icon: <BarChart3 className="w-12 h-12" />,
      title: "AI-Powered Analytics",
      description: "Advanced machine learning algorithms trained on millions of data points for superior accuracy.",
      benefits: ["NADA compliant methodology", "Real-time market data", "Predictive trend analysis"]
    },
    {
      icon: <Database className="w-12 h-12" />,
      title: "Comprehensive Database",
      description: "Access to extensive vehicle databases with historical trends and market intelligence.",
      benefits: ["Multi-source data aggregation", "Historical pricing trends", "Market condition analysis"]
    },
    {
      icon: <Clock className="w-12 h-12" />,
      title: "Real-Time Processing",
      description: "Enterprise-grade infrastructure delivering professional valuations with guaranteed uptime.",
      benefits: ["Sub-5 second response", "Enterprise SLA available", "Scalable architecture"]
    },
    {
      icon: <Award className="w-12 h-12" />,
      title: "Industry Standards",
      description: "Methodology aligned with automotive industry standards and best practices.",
      benefits: ["NADA methodology compliance", "Industry peer validation", "Professional certification"]
    },
    {
      icon: <Lock className="w-12 h-12" />,
      title: "Privacy Compliance",
      description: "Full compliance with data protection regulations including GDPR and CCPA standards.",
      benefits: ["Zero data retention options", "GDPR & CCPA compliant", "Privacy-by-design architecture"]
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
            Professional Features
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Built for Professional Standards
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Our platform meets the rigorous standards demanded by automotive professionals, 
            financial institutions, and enterprise clients nationwide.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-slate-50">
              <CardContent className="p-8">
                <div className="text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
