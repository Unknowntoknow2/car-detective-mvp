
import React, { useState } from 'react';
import { FormData } from '@/types/premium-valuation';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, X, Camera, ImageIcon, Check } from 'lucide-react';
import { Photo, MAX_FILES, MIN_FILES } from '@/types/photo';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface PhotoUploadStepProps {
  step: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity: (step: number, isValid: boolean) => void;
}

export function PhotoUploadStep({
  step,
  formData,
  setFormData,
  updateValidity
}: PhotoUploadStepProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  React.useEffect(() => {
    // Photos are optional but helpful, so mark step as valid by default
    updateValidity(step, true);
  }, [step, updateValidity]);
  
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const filesArray = Array.from(e.target.files);
    
    if (photos.length + filesArray.length > MAX_FILES) {
      toast.error(`You can upload a maximum of ${MAX_FILES} photos`);
      return;
    }
    
    setIsUploading(true);
    
    // Simulate upload process
    const newPhotos: Photo[] = filesArray.map((file) => {
      const id = Math.random().toString(36).substring(2, 15);
      const photo: Photo = {
        id,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview: URL.createObjectURL(file),
        uploading: true,
      };
      return photo;
    });
    
    setPhotos([...photos, ...newPhotos]);
    
    // Simulate upload completion
    setTimeout(() => {
      setPhotos(prev => 
        prev.map(p => ({
          ...p,
          uploading: false,
          uploaded: true,
          url: p.preview, // In a real app, this would be the server URL
          score: Math.random() * 0.3 + 0.7 // Simulate a score between 0.7 and 1.0
        }))
      );
      
      // Update form data with the best photo URL
      const bestPhoto = [...photos, ...newPhotos].sort((a, b) => 
        (b.score || 0) - (a.score || 0)
      )[0];
      
      if (bestPhoto?.preview) {
        setFormData(prev => ({
          ...prev,
          bestPhotoUrl: bestPhoto.preview
        }));
      }
      
      setIsUploading(false);
    }, 1500);
    
    // Reset file input
    e.target.value = '';
  };
  
  const removePhoto = (id: string) => {
    const photoToRemove = photos.find(p => p.id === id);
    if (photoToRemove?.preview) {
      URL.revokeObjectURL(photoToRemove.preview);
    }
    
    setPhotos(photos.filter(p => p.id !== id));
    
    // If we removed the best photo, update the form data
    if (formData.bestPhotoUrl === photoToRemove?.preview) {
      const remainingPhotos = photos.filter(p => p.id !== id);
      const newBestPhoto = remainingPhotos.sort((a, b) => 
        (b.score || 0) - (a.score || 0)
      )[0];
      
      setFormData(prev => ({
        ...prev,
        bestPhotoUrl: newBestPhoto?.preview || undefined
      }));
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Vehicle Photos</h2>
        <p className="text-muted-foreground">
          Upload photos of your vehicle to get a more accurate valuation. Photos of the 
          exterior, interior, and any damage will help us provide the most precise estimate.
        </p>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-square rounded-md overflow-hidden border border-gray-200 group"
              >
                <img
                  src={photo.preview}
                  alt={photo.name}
                  className="w-full h-full object-cover"
                />
                
                {photo.uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
                      <Upload className="w-6 h-6 text-primary animate-pulse" />
                    </div>
                  </div>
                )}
                
                {!photo.uploading && (
                  <>
                    <button
                      onClick={() => removePhoto(photo.id)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                    
                    {photo.score && (
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                        {Math.round(photo.score * 100)}%
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            ))}
            
            {photos.length < MAX_FILES && (
              <motion.label
                htmlFor="photo-upload"
                className="aspect-square rounded-md border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Camera className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Add Photo</span>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={isUploading}
                  className="hidden"
                  multiple
                />
              </motion.label>
            )}
          </div>
          
          <div className="mt-6">
            <Label className="text-sm font-medium">Photo Tips:</Label>
            <ul className="mt-2 text-sm text-muted-foreground space-y-1">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Take photos in good lighting
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Include all sides of the vehicle (front, back, sides)
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Add photos of the interior, including dashboard and seats
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Document any damage or scratches clearly
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <div className="bg-blue-50 border border-blue-100 rounded-md p-4 text-blue-800">
        <div className="flex items-start">
          <ImageIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
          <div>
            <p className="text-sm font-medium">Better photos = more accurate valuation</p>
            <p className="text-xs mt-1">
              Photos help us verify the condition of your vehicle and can increase your valuation
              by up to 12% if they show your vehicle in excellent condition.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
