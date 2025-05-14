
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, Car, Users, BarChart3 } from 'lucide-react';

export const DashboardPanels = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div className="p-6 border rounded-xl shadow-sm bg-white">
        <div className="flex items-start mb-4">
          <Car className="h-8 w-8 text-primary mr-3" />
          <div>
            <h2 className="font-semibold text-lg mb-1">Inventory Management</h2>
            <p className="text-sm text-gray-600 mb-4">
              Add, update, or remove vehicles from your dealership inventory.
            </p>
          </div>
        </div>
        <Button 
          onClick={() => navigate('/dealer/inventory')}
          className="w-full"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Manage Inventory
        </Button>
      </div>

      <div className="p-6 border rounded-xl shadow-sm bg-white">
        <div className="flex items-start mb-4">
          <Users className="h-8 w-8 text-primary mr-3" />
          <div>
            <h2 className="font-semibold text-lg mb-1">Leads & Offers</h2>
            <p className="text-sm text-gray-600 mb-4">
              View customer leads from premium valuations and manage your offers.
            </p>
          </div>
        </div>
        <Button 
          onClick={() => navigate('/dealer/leads')}
          className="w-full"
        >
          View Leads
        </Button>
      </div>

      <div className="p-6 border rounded-xl shadow-sm bg-white">
        <div className="flex items-start mb-4">
          <BarChart3 className="h-8 w-8 text-primary mr-3" />
          <div>
            <h2 className="font-semibold text-lg mb-1">Valuation Analytics</h2>
            <p className="text-sm text-gray-600 mb-4">
              Insights from your listed cars and market data trends.
            </p>
          </div>
        </div>
        <Button 
          onClick={() => navigate('/dealer/analytics')}
          className="w-full"
        >
          View Analytics
        </Button>
      </div>
    </div>
  );
};
