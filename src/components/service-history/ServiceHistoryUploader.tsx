
import React, { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { FileDropzone } from './FileDropzone';
import { ServiceDetailsForm } from './ServiceDetailsForm';
import { UploadStatusButton } from './UploadStatusButton';

interface ServiceHistoryUploaderProps {
  vin: string;
  onUploadComplete?: (fileUrl: string) => void;
}

export function ServiceHistoryUploader({ vin, onUploadComplete }: ServiceHistoryUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [serviceDate, setServiceDate] = useState('');
  const [mileage, setMileage] = useState('');
  const [description, setDescription] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (files.length === 0) {
      toast.error("Please select at least one service receipt to upload");
      return false;
    }

    if (!serviceDate) {
      toast.error("Please enter the service date");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsUploading(true);
    
    try {
      // Upload file to storage
      const file = files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${vin}_${Date.now()}.${fileExt}`;
      const filePath = `${vin}/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('service-receipts')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) throw error;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('service-receipts')
        .getPublicUrl(filePath);
      
      // Save service record to database
      const { error: insertError } = await supabase
        .from('service_history')
        .insert({
          vin,
          service_date: serviceDate,
          mileage: mileage ? parseInt(mileage) : null,
          description,
          receipt_url: urlData?.publicUrl
        });
      
      if (insertError) throw insertError;
      
      // Update the vehicle record to indicate it has service history
      await supabase
        .from('vehicles')
        .update({ has_full_service_history: true })
        .eq('vin', vin);
      
      toast.success("Service record has been saved");

      if (onUploadComplete && urlData?.publicUrl) {
        onUploadComplete(urlData.publicUrl);
      }
      
      // Reset form
      setFiles([]);
      setServiceDate('');
      setMileage('');
      setDescription('');
      
    } catch (error: any) {
      toast.error(error.message || "An error occurred while uploading the file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-md border">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-medium">Upload Service Records</h3>
        <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          Improves valuation accuracy
        </div>
      </div>
      
      <ServiceDetailsForm 
        serviceDate={serviceDate}
        mileage={mileage}
        description={description}
        onServiceDateChange={setServiceDate}
        onMileageChange={setMileage}
        onDescriptionChange={setDescription}
      />
      
      <FileDropzone 
        files={files}
        onFileChange={handleFileChange}
        onRemoveFile={removeFile}
      />

      <div className="mt-4">
        <UploadStatusButton 
          isUploading={isUploading}
          disabled={files.length === 0}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
