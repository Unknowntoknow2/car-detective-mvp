
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import AddEditVehicleForm from '../AddEditVehicleForm';

interface EditVehicleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleId: string;
  onVehicleUpdated?: () => void;
}

const EditVehicleModal: React.FC<EditVehicleModalProps> = ({ 
  open, 
  onOpenChange,
  vehicleId,
  onVehicleUpdated
}) => {
  const handleSuccess = () => {
    onOpenChange(false);
    if (onVehicleUpdated) {
      onVehicleUpdated();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Vehicle</DialogTitle>
          <DialogDescription>
            Update the details of your vehicle listing
          </DialogDescription>
        </DialogHeader>
        <AddEditVehicleForm 
          vehicleId={vehicleId} 
          onSuccess={handleSuccess} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditVehicleModal;
