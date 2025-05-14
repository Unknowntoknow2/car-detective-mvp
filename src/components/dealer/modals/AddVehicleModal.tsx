
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { VehicleFormData, vehicleSchema } from '../schemas/vehicleSchema';
import { VehicleForm } from './VehicleForm';
import { AddVehicleDialogWrapper } from './AddVehicleDialogWrapper';
import { useVehicleUpload } from '../hooks/useVehicleUpload';

interface AddVehicleModalProps {
  onVehicleAdded?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const AddVehicleModal: React.FC<AddVehicleModalProps> = ({ 
  onVehicleAdded, 
  open, 
  onOpenChange 
}) => {
  const [openState, setOpen] = useState(open || false);
  const { user } = useAuth();
  
  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      make: '',
      model: '',
      year: new Date().getFullYear(),
      mileage: null,
      price: 0,
      condition: 'Good',
      transmission: 'Automatic',
      fuel_type: 'Gasoline',
      zip_code: '',
      photos: [],
      status: 'available'
    }
  });

  const { 
    photoUrls, 
    uploadedPhotos, 
    photoUploading, 
    submitting,
    setUploadedPhotos, 
    setPhotoUrls, 
    setSubmitting,
    uploadPhotosToStorage,
    handlePhotoUpload, 
    removePhoto 
  } = useVehicleUpload(user?.id);

  // Reset the form when the dialog is closed
  useEffect(() => {
    if (!openState) {
      form.reset();
      setUploadedPhotos([]);
      setPhotoUrls([]);
    }
  }, [openState, form, setUploadedPhotos, setPhotoUrls]);

  // Handle form submission
  const onSubmit = async (data: VehicleFormData) => {
    if (!user?.id) {
      toast.error('You must be logged in to add a vehicle');
      return;
    }

    try {
      setSubmitting(true);

      // Upload photos to storage
      const photoUrls = await uploadPhotosToStorage();

      // Insert vehicle data into the database
      const { data: vehicleData, error } = await supabase
        .from('dealer_vehicles')
        .insert({
          dealer_id: user.id,
          make: data.make,
          model: data.model,
          year: data.year,
          mileage: data.mileage,
          price: data.price,
          condition: data.condition,
          transmission: data.transmission,
          fuel_type: data.fuel_type,
          zip_code: data.zip_code,
          photos: photoUrls,
          status: data.status
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding vehicle:', error);
        toast.error('Failed to add vehicle');
        return;
      }

      // Success!
      toast.success('Vehicle added successfully');
      if (onOpenChange) onOpenChange(false);
      
      // Call the callback if provided
      if (onVehicleAdded) {
        onVehicleAdded();
      }

    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AddVehicleDialogWrapper open={openState} onOpenChange={onOpenChange}>
      <VehicleForm 
        form={form}
        onSubmit={onSubmit}
        photoUrls={photoUrls}
        handlePhotoUpload={handlePhotoUpload}
        removePhoto={removePhoto}
      />
      <DialogFooter>
        <Button type="button" variant="outline" onClick={() => onOpenChange && onOpenChange(false)}>
          Cancel
        </Button>
        <Button 
          type="submit"
          form="vehicle-form"
          disabled={submitting || photoUploading}
          isLoading={submitting || photoUploading}
        >
          {submitting ? 'Adding...' : 'Add Vehicle'}
        </Button>
      </DialogFooter>
    </AddVehicleDialogWrapper>
  );
};

export default AddVehicleModal;
