
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, File, X, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ServiceHistoryUploaderProps {
  vin: string;
  onUploadComplete?: (fileUrl: string) => void;
}

export function ServiceHistoryUploader({ vin, onUploadComplete }: ServiceHistoryUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [serviceDate, setServiceDate] = useState('');
  const [mileage, setMileage] = useState('');
  const [description, setDescription] = useState('');
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one service receipt to upload",
        variant: "destructive"
      });
      return;
    }

    if (!serviceDate) {
      toast({
        title: "Missing information",
        description: "Please enter the service date",
        variant: "destructive"
      });
      return;
    }

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
      const { error: dbError } = await supabase
        .from('service_history')
        .insert({
          vin,
          service_date: serviceDate,
          mileage: mileage ? parseInt(mileage) : null,
          description,
          receipt_url: urlData?.publicUrl
        });
      
      if (dbError) throw dbError;
      
      // Update the vehicle record to indicate it has service history
      await supabase
        .from('vehicles')
        .upsert({ 
          vin, 
          has_full_service_history: true 
        }, { 
          onConflict: 'vin'
        });
      
      toast({
        title: "Upload successful",
        description: "Service record has been saved",
        variant: "default"
      });

      if (onUploadComplete && urlData?.publicUrl) {
        onUploadComplete(urlData.publicUrl);
      }
      
      // Reset form
      setFiles([]);
      setServiceDate('');
      setMileage('');
      setDescription('');
      
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "An error occurred while uploading the file",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
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
      
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 mb-4">
          <div>
            <Label htmlFor="service-date">Service Date</Label>
            <Input 
              id="service-date" 
              type="date" 
              value={serviceDate}
              onChange={(e) => setServiceDate(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="mileage">Mileage at Service</Label>
            <Input 
              id="mileage" 
              type="number" 
              placeholder="e.g. 45000"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="description">Service Description</Label>
            <Input 
              id="description" 
              placeholder="e.g. Oil change, brake service"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex flex-col gap-2 mb-4">
          <Label htmlFor="file-upload">Upload Receipt/Documentation</Label>
          
          <div className="border-2 border-dashed rounded-md p-6 text-center hover:bg-gray-50 transition-colors">
            <Input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center gap-2">
              <Upload size={24} className="text-gray-400" />
              <span className="text-sm text-gray-500">Click to select file or drag and drop</span>
              <span className="text-xs text-gray-400">PDF, JPG or PNG (max 5MB)</span>
            </label>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Selected Files:</h4>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <File size={16} className="text-blue-500" />
                  <span className="text-sm flex-1 truncate">{file.name}</span>
                  <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(0)} KB</span>
                  <button 
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button type="submit" disabled={isUploading || files.length === 0}>
          {isUploading ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <CheckCircle2 size={16} className="mr-2" />
              Save Service Record
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
