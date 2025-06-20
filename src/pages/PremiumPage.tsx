
import React from 'react';
import { LookupTabs } from '@/components/home/LookupTabs';

const PremiumPage = () => {
  const handleVehicleFound = (vehicle: any) => {
    console.log("Vehicle found in premium page:", vehicle);
    // Handle the vehicle data here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Advanced Vehicle Valuation & Analytics
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get comprehensive vehicle insights with premium features including detailed market analysis, 
            CARFAX reports, and professional PDF exports.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <LookupTabs 
            defaultTab="vin"
            onVehicleFound={handleVehicleFound}
          />
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Market Analysis</h3>
              <p className="text-gray-600">Comprehensive market trends and pricing insights</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">CARFAX Integration</h3>
              <p className="text-gray-600">Official vehicle history reports and data</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">PDF Reports</h3>
              <p className="text-gray-600">Professional downloadable valuation reports</p>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Choose Your Valuation Package</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-gray-200">
              <h3 className="text-xl font-semibold mb-4">Basic</h3>
              <p className="text-gray-600 mb-4">Essential valuation features</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Basic vehicle valuation</li>
                <li>• Market price estimates</li>
                <li>• Simple condition assessment</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-blue-500">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">Premium</h3>
              <p className="text-gray-600 mb-4">Complete valuation suite</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Advanced AI valuation</li>
                <li>• CARFAX vehicle history</li>
                <li>• Market trend analysis</li>
                <li>• Professional PDF reports</li>
                <li>• Priority support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPage;
