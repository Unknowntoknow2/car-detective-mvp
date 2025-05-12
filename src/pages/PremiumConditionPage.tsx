
import React from 'react';

const PremiumConditionPage = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Premium Vehicle Condition Assessment</h1>
      
      <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
        <p className="text-lg mb-4">
          Our premium condition assessment helps you accurately determine your vehicle's condition,
          which is a critical factor in its valuation.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Interior Assessment</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Seats and upholstery condition</li>
              <li>Dashboard and controls functionality</li>
              <li>Carpet and floor mats wear</li>
              <li>Interior electronics operation</li>
              <li>Headliner condition</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Exterior Assessment</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Paint condition and quality</li>
              <li>Body panel alignment</li>
              <li>Wheel and tire condition</li>
              <li>Glass and trim condition</li>
              <li>Lights and signals operation</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <a 
          href="/premium" 
          className="bg-primary text-white py-2 px-6 rounded-md hover:bg-primary/90 transition-colors inline-block"
        >
          Continue to Premium Valuation
        </a>
      </div>
    </div>
  );
};

export default PremiumConditionPage;
