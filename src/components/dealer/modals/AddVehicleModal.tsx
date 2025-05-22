
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import AddEditVehicleForm from '../AddEditVehicleForm';

interface AddVehicleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVehicleAdded?: () => void;
}

const AddVehicleModal: React.FC<AddVehicleModalProps> = ({ 
  open, 
  onOpenChange,
  onVehicleAdded
}) => {
  const handleSuccess = () => {
    onOpenChange(false);
    if (onVehicleAdded) {
      onVehicleAdded();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Vehicle</DialogTitle>
          <DialogDescription>
            Enter the details of the vehicle you want to add to your inventory
          </DialogDescription>
        </DialogHeader>
        <AddEditVehicleForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default AddVehicleModal;
