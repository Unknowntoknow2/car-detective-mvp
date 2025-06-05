
import React, { useState } from "react";
import { toast } from "sonner";
import { useDealerInventory } from "./hooks/useDealerInventory";
import { DealerVehicle } from "@/types/vehicle";
import { DealerInventoryTable } from "./DealerInventoryTable";
import { Button } from "@/components/ui/button";

interface DealerInventoryProps {
  onRefresh?: () => void;
}

export const DealerInventory: React.FC<DealerInventoryProps> = (
  { onRefresh },
) => {
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<DealerVehicle | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    vehicles,
    isLoading,
    error,
    deleteVehicle,
    refetch,
  } = useDealerInventory();

  // Handle add vehicle
  const handleVehicleAdded = () => {
    setIsAddVehicleModalOpen(false);
    toast.success("Vehicle added successfully!");
    if (onRefresh) {
      onRefresh();
    }
  };

  // Handle delete vehicle confirmation
  const handleDeleteClick = (vehicle: DealerVehicle) => {
    setVehicleToDelete(vehicle);
  };

  // Handle actual deletion
  const handleConfirmDelete = async () => {
    if (!vehicleToDelete) return;

    setIsDeleting(true);
    const result = await deleteVehicle(vehicleToDelete.id);
    setIsDeleting(false);

    if (result.success) {
      toast.success("Vehicle deleted successfully");
      if (onRefresh) {
        onRefresh();
      }
    } else if (result.error) {
      toast.error(result.error);
    }

    setVehicleToDelete(null);
  };

  return (
    <div className="container max-w-7xl py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Your Inventory</h2>
        <Button onClick={() => setIsAddVehicleModalOpen(true)}>
          Add Vehicle
        </Button>
      </div>

      <DealerInventoryTable />
    </div>
  );
};

export default DealerInventory;
