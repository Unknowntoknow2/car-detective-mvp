
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, Upload } from 'lucide-react';
import { FileDropzone } from './FileDropzone';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ServiceDetailsForm } from './ServiceDetailsForm';
import { UploadStatusButton } from './UploadStatusButton';

interface ServiceHistoryUploaderProps {
  initialVin?: string;
  onUploadComplete?: () => void;
}

export function ServiceHistoryUploader({ initialVin, onUploadComplete }: ServiceHistoryUploaderProps) {
  const [vin, setVin] = useState(initialVin || '');
  const [file, setFile] = useState<File | null>(null);
  const [serviceDate, setServiceDate] = useState('');
  const [mileage, setMileage] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const resetForm = () => {
    setFile(null);
    setServiceDate('');
    setMileage(null);
    setDescription('');
    setUploadProgress(0);
  };

  const validateForm = () => {
    if (!vin || vin.length !== 17) {
      toast.error('Please enter a valid 17-character VIN');
      return false;
    }
    
    if (!serviceDate) {
      toast.error('Please select a service date');
      return false;
    }
    
    if (!description) {
      toast.error('Please provide a description of the service');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsUploading(true);
    setUploadProgress(10);
    
    try {
      // First check if vehicle exists, if not create it
      const { data: vehicleData, error: vehicleError } = await supabase
        .from('vehicles')
        .select('vin')
        .eq('vin', vin)
        .maybeSingle();
      
      if (vehicleError) throw vehicleError;
      
      if (!vehicleData) {
        // Create vehicle record
        const { error: createVehicleError } = await supabase
          .from('vehicles')
          .insert({ 
            vin, 
            has_full_service_history: false,
            num_owners: 1,
            title_brand: 'Clean'
          });
        
        if (createVehicleError) throw createVehicleError;
      }
      
      setUploadProgress(30);
      
      let receiptUrl = '';
      
      // Upload receipt file if provided
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${vin}_${Date.now()}.${fileExt}`;
        const filePath = `service_receipts/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('service_documents')
          .upload(filePath, file);
        
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data } = supabase.storage
          .from('service_documents')
          .getPublicUrl(filePath);
        
        receiptUrl = data.publicUrl;
      }
      
      setUploadProgress(70);
      
      // Create service history record
      const { error: serviceHistoryError } = await supabase
        .from('service_history')
        .insert({
          vin,
          service_date: serviceDate,
          mileage,
          description,
          receipt_url: receiptUrl || null
        });
      
      if (serviceHistoryError) throw serviceHistoryError;
      
      // Update vehicle to indicate it has service history
      const { error: updateVehicleError } = await supabase
        .from('vehicles')
        .update({ has_full_service_history: true })
        .eq('vin', vin);
      
      if (updateVehicleError) throw updateVehicleError;
      
      setUploadProgress(100);
      toast.success('Service record added successfully');
      
      // Reset form
      resetForm();
      
      // Call the callback if provided
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error: any) {
      console.error('Error uploading service record:', error);
      toast.error(`Failed to add service record: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Add Service History Record
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vin">Vehicle Identification Number (VIN)</Label>
            <Input
              id="vin"
              value={vin}
              onChange={(e) => setVin(e.target.value.toUpperCase())}
              placeholder="Enter 17-character VIN"
              maxLength={17}
              className="font-mono"
              disabled={isUploading || !!initialVin}
            />
          </div>
          
          <ServiceDetailsForm 
            serviceDate={serviceDate}
            setServiceDate={setServiceDate}
            mileage={mileage}
            setMileage={setMileage}
            description={description}
            setDescription={setDescription}
            isDisabled={isUploading}
          />
          
          <div className="space-y-2">
            <Label>Service Receipt (Optional)</Label>
            <FileDropzone onFileSelect={handleFileSelect} selectedFile={file} disabled={isUploading} />
          </div>
          
          <UploadStatusButton 
            isUploading={isUploading}
            uploadProgress={uploadProgress}
            onCancel={() => setIsUploading(false)}
          />
        </form>
      </CardContent>
    </Card>
  );
}
