
import React from 'react';
import { Shield, Clock, Award, CheckCircle } from 'lucide-react';

export const InstantTrustBar: React.FC = () => {
  const trustElements = [
    {
      icon: <Clock className="w-5 h-5" />,
      text: "30 Second Results"
    },
    {
      icon: <Award className="w-5 h-5" />,
      text: "NADA Compliant"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      text: "Bank-Grade Security"
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      text: "Professional Data"
    }
  ];

  return (
    <section className="py-8 bg-gray-50 border-y border-gray-100">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16">
          {trustElements.map((element, index) => (
            <div key={index} className="flex items-center space-x-2 text-gray-700">
              <div className="text-blue-600">
                {element.icon}
              </div>
              <span className="font-medium text-sm lg:text-base">
                {element.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
