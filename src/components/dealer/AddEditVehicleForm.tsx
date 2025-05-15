
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { vehicleSchema, VehicleFormValues } from './schemas/vehicleSchema';
import { useVehicleUpload } from './hooks/useVehicleUpload';
import Loading from '@/components/ui/loading';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { VehicleForm } from './modals/VehicleForm';

interface AddEditVehicleFormProps {
  onSuccess?: () => void;
}

const AddEditVehicleForm: React.FC<AddEditVehicleFormProps> = ({ onSuccess }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  
  const {
    isUploading,
    photoUrls,
    setPhotoUrls,
    handlePhotoUpload,
    removePhoto,
    addVehicle,
    updateVehicle,
    fetchVehicle
  } = useVehicleUpload();
  
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      make: '',
      model: '',
      year: new Date().getFullYear(),
      price: 0,
      mileage: null,
      condition: 'Good',
      status: 'available',
      transmission: undefined,
      fuel_type: undefined,
      zip_code: ''
    }
  });
  
  useEffect(() => {
    const loadVehicle = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const vehicle = await fetchVehicle(id);
          if (vehicle) {
            form.reset({
              make: vehicle.make,
              model: vehicle.model,
              year: vehicle.year,
              price: vehicle.price,
              mileage: vehicle.mileage,
              condition: vehicle.condition as "Excellent" | "Good" | "Fair" | "Poor",
              status: vehicle.status as "available" | "pending" | "sold",
              transmission: vehicle.transmission as "Automatic" | "Manual" | undefined,
              fuel_type: vehicle.fuel_type as "Gasoline" | "Diesel" | "Hybrid" | "Electric" | undefined,
              zip_code: vehicle.zip_code || ''
            });
            
            if (vehicle.photos && Array.isArray(vehicle.photos)) {
              setPhotoUrls(vehicle.photos);
            }
          } else {
            toast.error('Vehicle not found');
            navigate('/dealer/inventory');
          }
        } catch (error) {
          toast.error('Failed to load vehicle');
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadVehicle();
  }, [id, fetchVehicle, form, navigate, setPhotoUrls]);
  
  const onSubmit = async (data: VehicleFormValues) => {
    try {
      setIsSubmitting(true);
      
      if (id) {
        await updateVehicle(id, data);
        toast.success('Vehicle updated successfully');
      } else {
        await addVehicle(data);
        toast.success('Vehicle added successfully');
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/dealer/inventory');
      }
    } catch (error) {
      console.error('Error saving vehicle:', error);
      toast.error('Failed to save vehicle');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loading />
      </div>
    );
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <VehicleForm
          form={form}
          onSubmit={onSubmit}
          photoUrls={photoUrls}
          handlePhotoUpload={handlePhotoUpload}
          removePhoto={removePhoto}
        />
        
        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/dealer/inventory')}
            disabled={isSubmitting || isUploading}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting || isUploading ? 'Saving...' : id ? 'Update Vehicle' : 'Add Vehicle'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddEditVehicleForm;
