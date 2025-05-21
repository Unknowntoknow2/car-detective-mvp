
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useVehicleLookup } from '@/hooks/useVehicleLookup';
import { Upload, Camera, ImageIcon } from 'lucide-react';

export interface PhotoUploadProps {
  onSuccess?: (result: any) => void;
  onPhotoAnalysisComplete?: (vehicleData: any) => void;
}

export function PhotoUpload({ onSuccess, onPhotoAnalysisComplete }: PhotoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { lookupVehicle, isLoading, error } = useVehicleLookup();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    
    try {
      // This will be a placeholder until we implement actual photo processing
      const result = await lookupVehicle('photo', 'photo-upload', undefined, {
        fileType: selectedFile.type,
        fileName: selectedFile.name
      });
      
      if (result) {
        if (onSuccess) {
          onSuccess(result);
        }
        
        if (onPhotoAnalysisComplete) {
          onPhotoAnalysisComplete(result);
        }
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-4">
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center w-full h-48 bg-gray-50 hover:bg-gray-100 cursor-pointer"
            onClick={() => document.getElementById('photo-upload')?.click()}
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain" />
            ) : (
              <>
                <ImageIcon className="h-16 w-16 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Click to upload or take a photo</p>
              </>
            )}
            <input 
              id="photo-upload" 
              type="file" 
              accept="image/*"
              className="hidden" 
              onChange={handleFileChange}
            />
          </div>
          
          <div className="flex space-x-2">
            <Button 
              onClick={() => document.getElementById('photo-upload')?.click()}
              variant="outline"
              size="sm"
              className="flex items-center"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
            <Button 
              onClick={() => document.getElementById('photo-upload')?.click()}
              variant="outline"
              size="sm"
              className="flex items-center"
            >
              <Camera className="h-4 w-4 mr-2" />
              Take Photo
            </Button>
          </div>
          
          {selectedFile && (
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Processing...' : 'Process Photo'}
            </Button>
          )}
          
          {error && (
            <p className="text-sm text-red-500 mt-2">{error}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
