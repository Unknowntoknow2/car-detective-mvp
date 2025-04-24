
import React from 'react';

const features = [
  {
    title: "Basic Valuation (Free)",
    description: "Instantly estimate your vehicle's worth using VIN, plate, or manual entry — powered by real-time market analytics.",
    bgColor: "bg-gray-50",
  },
  {
    title: "Premium Report ($29.99)",
    description: "Includes CARFAX® history, 12-month trend forecast, dealer offers, confidence score, and branded PDF export.",
    bgColor: "bg-yellow-50",
  },
  {
    title: "Dealer Tools",
    description: "Access leads, submit offers, and use advanced appraisal tools designed for dealerships.",
    bgColor: "bg-gray-50",
  },
];

export function FeaturesOverview() {
  return (
    <section className="max-w-6xl mx-auto py-16 px-4">
      <h2 className="text-3xl font-semibold text-center mb-12">Services We Offer</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`${feature.bgColor} p-6 rounded-xl shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-in-out`}
          >
            <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-600">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
