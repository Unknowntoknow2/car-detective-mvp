
import React from 'react';
import { Button } from '@/components/ui/button';
import { DealerInventoryItem } from '@/types/vehicle';

// Function to fix status check display
export const fixStatusCheck = (status?: string) => {
  if (!status) return 'Unknown';
  
  // Convert status to lowercase for case-insensitive comparison
  const lowerStatus = status.toLowerCase();
  
  // Check if the status is 'available' and return 'Active' instead
  if (lowerStatus === 'available') {
    return 'Active';
  }
  
  // For all other statuses, capitalize the first letter
  return status.charAt(0).toUpperCase() + status.slice(1);
};

// Dealer inventory list component
export const DealerInventoryList = ({ 
  inventory, 
  isLoading, 
  onEdit, 
  onDelete 
}: { 
  inventory: DealerInventoryItem[];
  isLoading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      {isLoading ? (
        <div className="p-6 text-center">Loading inventory...</div>
      ) : inventory.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-muted-foreground">No vehicles in inventory</p>
        </div>
      ) : (
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Vehicle</th>
              <th className="px-4 py-3 text-left font-medium">Year</th>
              <th className="px-4 py-3 text-left font-medium">Price</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((vehicle) => (
              <tr key={vehicle.id} className="border-t">
                <td className="px-4 py-3">
                  {vehicle.make} {vehicle.model}
                </td>
                <td className="px-4 py-3">{vehicle.year}</td>
                <td className="px-4 py-3">${vehicle.price.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    vehicle.status === 'available' ? 'bg-green-100 text-green-800' :
                    vehicle.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {fixStatusCheck(vehicle.status)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="outline" size="sm" className="mr-2" onClick={() => onEdit(vehicle.id)}>
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onDelete(vehicle.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
