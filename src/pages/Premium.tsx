
import React from 'react';

const Premium = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Premium Valuation Services</h1>
      <p className="mb-8">Upgrade to our premium services for detailed vehicle valuations with comprehensive market analysis.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Advanced Reports</h2>
          <p>Get in-depth analysis of your vehicle's value with our comprehensive reports.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Market Comparison</h2>
          <p>Compare your vehicle to similar listings in your area for a more accurate valuation.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Dealer Network</h2>
          <p>Connect with our network of trusted dealers for competitive offers on your vehicle.</p>
        </div>
      </div>
    </div>
  );
};

export default Premium;
