
import React from 'react';
import { DealerInventoryItem } from '@/types/vehicle';
import { formatCurrency } from '@/utils/formatters';

interface DealerInventoryListProps {
  vehicles: DealerInventoryItem[];
  onEdit?: (vehicle: DealerInventoryItem) => void;
  onDelete?: (vehicle: DealerInventoryItem) => void;
}

export const DealerInventoryList: React.FC<DealerInventoryListProps> = ({
  vehicles,
  onEdit,
  onDelete
}) => {
  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">No vehicles in inventory</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {vehicles.map((vehicle) => (
        <div key={vehicle.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h3>
              <p className="text-muted-foreground">VIN: {vehicle.vin}</p>
              <p className="text-lg font-bold">{formatCurrency(vehicle.price)}</p>
            </div>
            <div className="flex gap-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(vehicle)}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(vehicle)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
