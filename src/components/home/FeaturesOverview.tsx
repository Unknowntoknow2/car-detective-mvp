
import React from 'react';

export function FeaturesOverview() {
  return (
    <section className="max-w-6xl mx-auto py-16 px-4">
      <h2 className="text-3xl font-semibold text-center mb-12">Services We Offer</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-gray-50 p-6 rounded-xl shadow">
          <h3 className="font-semibold text-xl mb-2">Basic Valuation (Free)</h3>
          <p className="text-sm text-gray-600">
            Instantly estimate your vehicle's worth using VIN, plate, or manual entry — powered by real-time market analytics.
          </p>
        </div>
        <div className="bg-yellow-50 p-6 rounded-xl shadow">
          <h3 className="font-semibold text-xl mb-2">Premium Report ($29.99)</h3>
          <p className="text-sm text-gray-700">
            Includes CARFAX® history, 12-month trend forecast, dealer offers, confidence score, and branded PDF export.
          </p>
        </div>
        <div className="bg-gray-50 p-6 rounded-xl shadow">
          <h3 className="font-semibold text-xl mb-2">Dealer Tools</h3>
          <p className="text-sm text-gray-600">
            Access leads, submit offers, and use advanced appraisal tools designed for dealerships.
          </p>
        </div>
      </div>
    </section>
  );
}
