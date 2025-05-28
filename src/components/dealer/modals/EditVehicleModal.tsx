
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DealerVehicle } from '@/types/dealerVehicle';
import AddEditVehicleForm from '../AddEditVehicleForm';

interface EditVehicleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: DealerVehicle | null;
  onVehicleUpdated?: () => void;
}

const EditVehicleModal: React.FC<EditVehicleModalProps> = ({ 
  open, 
  onOpenChange,
  vehicle,
  onVehicleUpdated
}) => {
  const handleSuccess = () => {
    onOpenChange(false);
    if (onVehicleUpdated) {
      onVehicleUpdated();
    }
  };

  if (!vehicle) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Vehicle</DialogTitle>
          <DialogDescription>
            Update the details of this vehicle in your inventory
          </DialogDescription>
        </DialogHeader>
        <AddEditVehicleForm 
          vehicle={vehicle}
          vehicleId={vehicle.id}
          onSuccess={handleSuccess} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditVehicleModal;
