
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { manualEntryFormSchema, ManualEntryFormData } from './types/manualEntry';
import MakeModelSelect from './form-parts/MakeModelSelect';
import VehicleDetailsInputs from './form-parts/VehicleDetailsInputs';
import ConditionAndFuelInputs from './form-parts/ConditionAndFuelInputs';
import { useNavigate } from 'react-router-dom';

interface ManualEntryFormProps {
  onSubmit: (data: ManualEntryFormData) => void;
  isLoading?: boolean;
}

const ManualEntryForm: React.FC<ManualEntryFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const form = useForm<ManualEntryFormData>({
    resolver: zodResolver(manualEntryFormSchema),
    defaultValues: {
      make: '',
      model: '',
      year: 0,
      mileage: 0,
      fuelType: '',
      condition: '',
      zipCode: '',
    },
  });

  const handleFormSubmit = (data: ManualEntryFormData) => {
    if (isLoading) return;
    
    try {
      onSubmit(data);
      toast.success('Vehicle information submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit vehicle information. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Vehicle Details</h3>
          <Separator />
          
          <MakeModelSelect form={form} />
          <VehicleDetailsInputs form={form} />
          <ConditionAndFuelInputs form={form} />
        </div>

        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Submit'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ManualEntryForm;
