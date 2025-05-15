
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import AddEditVehicleForm from './AddEditVehicleForm';

interface AddEditVehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleId?: string;
  onSuccess?: () => void;
}

const AddEditVehicleDialog: React.FC<AddEditVehicleDialogProps> = ({
  open,
  onOpenChange,
  vehicleId,
  onSuccess
}) => {
  const handleSuccess = () => {
    onOpenChange(false);
    if (onSuccess) onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{vehicleId ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
          <DialogDescription>
            {vehicleId 
              ? 'Update the details of your vehicle listing' 
              : 'Enter the details of the vehicle you want to add to your inventory'}
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

export default AddEditVehicleDialog;
