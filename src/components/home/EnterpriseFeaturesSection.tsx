
import React from 'react';
import { Shield, BarChart3, Clock, Award, Database, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const EnterpriseFeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Enterprise Security",
      description: "Bank-level encryption with SOC 2 Type II compliance and ISO 27001 certification.",
      benefits: ["256-bit encryption", "Multi-factor authentication", "Audit trails"]
    },
    {
      icon: <BarChart3 className="w-12 h-12" />,
      title: "AI-Powered Analytics",
      description: "Machine learning algorithms trained on millions of transactions for unmatched accuracy.",
      benefits: ["99.2% accuracy rate", "Real-time market data", "Predictive modeling"]
    },
    {
      icon: <Database className="w-12 h-12" />,
      title: "Comprehensive Data",
      description: "Access to the largest vehicle database with historical trends and market insights.",
      benefits: ["50M+ vehicle records", "Historical pricing", "Market forecasts"]
    },
    {
      icon: <Clock className="w-12 h-12" />,
      title: "Instant Processing",
      description: "Get professional-grade valuations in seconds with our optimized infrastructure.",
      benefits: ["3-second response", "99.9% uptime", "Global CDN"]
    },
    {
      icon: <Award className="w-12 h-12" />,
      title: "Industry Recognition",
      description: "Trusted by Fortune 500 companies and leading financial institutions worldwide.",
      benefits: ["500+ enterprise clients", "Industry awards", "Expert validation"]
    },
    {
      icon: <Lock className="w-12 h-12" />,
      title: "Privacy First",
      description: "GDPR compliant with zero data retention policies for maximum privacy protection.",
      benefits: ["No data storage", "GDPR compliant", "Privacy by design"]
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
            Enterprise Features
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Built for Enterprise Standards
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Our platform meets the highest standards for security, accuracy, and reliability 
            demanded by Fortune 500 companies and financial institutions.
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
