
import React from 'react';

export const DealerSidebar: React.FC = () => {
  return (
    <div className="w-64 bg-gray-100 p-4">
      <h2 className="text-lg font-semibold mb-4">Dealer Dashboard</h2>
      <nav className="space-y-2">
        <a href="#" className="block p-2 text-gray-700 hover:bg-gray-200 rounded">
          Overview
        </a>
        <a href="#" className="block p-2 text-gray-700 hover:bg-gray-200 rounded">
          Vehicles
        </a>
        <a href="#" className="block p-2 text-gray-700 hover:bg-gray-200 rounded">
          Offers
        </a>
      </nav>
    </div>
  );
};

export default DealerSidebar;
