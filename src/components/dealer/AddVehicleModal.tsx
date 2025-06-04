import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
<<<<<<< HEAD
} from '@/components/ui/dialog';
import AddEditVehicleForm from './AddEditVehicleForm';
=======
} from "@/components/ui/dialog";
import AddEditVehicleForm from "./AddEditVehicleForm";
import { VehicleFormData } from "./schemas/vehicleSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vehicleSchema } from "./schemas/vehicleSchema";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface AddVehicleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVehicleAdded?: () => void;
}

const AddVehicleModal: React.FC<AddVehicleModalProps> = ({
  open,
  onOpenChange,
  onVehicleAdded,
}) => {
<<<<<<< HEAD
=======
  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      make: "",
      model: "",
      year: new Date().getFullYear(),
      mileage: null,
      price: 0,
      condition: "Good",
      status: "available",
      photos: [],
    },
  });

>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
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
