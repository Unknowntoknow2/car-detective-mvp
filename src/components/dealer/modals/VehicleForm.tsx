
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { VehicleFormData } from '../schemas/vehicleSchema';
import { PhotoUploadSection } from './PhotoUploadSection';
import { VehicleInformationSection } from './VehicleInformationSection';

interface VehicleFormProps {
  form: UseFormReturn<VehicleFormData>;
  onSubmit: (data: VehicleFormData) => Promise<void>;
  photoUrls: string[];
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removePhoto: (index: number) => void;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({
  form,
  onSubmit,
  photoUrls,
  handlePhotoUpload,
  removePhoto
}) => {
  return (
    <form id="vehicle-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Vehicle Information Section */}
      <VehicleInformationSection form={form} />
      
      {/* Photo Upload Section */}
      <PhotoUploadSection 
        photoUrls={photoUrls} 
        onPhotoUpload={handlePhotoUpload} 
        onRemovePhoto={removePhoto} 
      />
    </form>
  );
};
