
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImagePlus, X } from 'lucide-react';

interface ImageUploadSectionProps {
  onChange: (photos: File[]) => void;
  maxPhotos?: number;
  onPhotosChange?: (newPhotos: File[]) => void; // Add the missing prop
}

export const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  onChange,
  maxPhotos = 5,
  onPhotosChange
}) => {
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles = Array.from(e.target.files).slice(0, maxPhotos - photos.length);
    if (newFiles.length === 0) return;
    
    const updatedPhotos = [...photos, ...newFiles];
    setPhotos(updatedPhotos);
    
    // Generate previews
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
    
    // Notify parent using either callback
    onChange(updatedPhotos);
    if (onPhotosChange) {
      onPhotosChange(updatedPhotos);
    }
    
    // Reset input
    e.target.value = '';
  };
  
  const removePhoto = (index: number) => {
    // Release object URL to prevent memory leaks
    URL.revokeObjectURL(previews[index]);
    
    const updatedPreviews = previews.filter((_, i) => i !== index);
    const updatedPhotos = photos.filter((_, i) => i !== index);
    
    setPreviews(updatedPreviews);
    setPhotos(updatedPhotos);
    
    // Notify parent using either callback
    onChange(updatedPhotos);
    if (onPhotosChange) {
      onPhotosChange(updatedPhotos);
    }
  };
  
  return (
    <div className="space-y-4">
      <div>
        <Label className="block mb-2">Vehicle Photos</Label>
        <p className="text-sm text-muted-foreground mb-4">
          Upload up to {maxPhotos} photos of your vehicle. The first photo will be used as the main image.
        </p>
      </div>
      
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <img 
                src={preview} 
                alt={`Vehicle preview ${index + 1}`}
                className="object-cover w-full h-32 rounded-md"
              />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full 
                           opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove photo"
              >
                <X className="h-4 w-4" />
              </button>
              {index === 0 && (
                <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground px-2 py-0.5 rounded text-xs font-medium">
                  Main Photo
                </span>
              )}
            </div>
          ))}
        </div>
      )}
      
      {photos.length < maxPhotos && (
        <div className="flex items-center justify-center w-full">
          <Label 
            htmlFor="photo-upload" 
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <ImagePlus className="w-8 h-8 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG or WEBP (Max. {maxPhotos - photos.length} more)</p>
            </div>
            <Input 
              id="photo-upload" 
              type="file" 
              accept="image/png, image/jpeg, image/webp"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </Label>
        </div>
      )}
    </div>
  );
};
