
import React, { useState, useCallback } from 'react';
import { FormData } from '@/types/premium-valuation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface PhotoUploadStepProps {
  step: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity: (step: number, isValid: boolean) => void;
}

export const PhotoUploadStep: React.FC<PhotoUploadStepProps> = ({
  step,
  formData,
  setFormData,
  updateValidity,
}) => {
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>(formData.photos || []);
  const [photoUrls, setPhotoUrls] = useState<string[]>(formData.photoUrls || []);
  const [isUploading, setIsUploading] = useState(false);

  // Set initial validity based on existing data
  React.useEffect(() => {
    // Photos are optional, so this step is always valid
    updateValidity(step, true);
  }, [step, updateValidity]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    // Create preview URLs
    const newUrls = acceptedFiles.map(file => URL.createObjectURL(file));
    
    // Update state
    setUploadedPhotos(prev => [...prev, ...acceptedFiles]);
    setPhotoUrls(prev => [...prev, ...newUrls]);
    
    // Simulate upload
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      
      // Update form data
      setFormData(prev => ({
        ...prev,
        photos: [...(prev.photos || []), ...acceptedFiles],
        photoUrls: [...(prev.photoUrls || []), ...newUrls]
      }));
    }, 1500);
  }, [setFormData]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.heic']
    },
    maxSize: 10485760 // 10MB
  });

  const removePhoto = (index: number) => {
    const newPhotos = [...uploadedPhotos];
    const newUrls = [...photoUrls];
    
    // Release object URL to avoid memory leaks
    URL.revokeObjectURL(newUrls[index]);
    
    newPhotos.splice(index, 1);
    newUrls.splice(index, 1);
    
    setUploadedPhotos(newPhotos);
    setPhotoUrls(newUrls);
    
    setFormData(prev => ({
      ...prev,
      photos: newPhotos,
      photoUrls: newUrls
    }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Upload Vehicle Photos</h2>
        <p className="text-muted-foreground">
          Adding photos helps us provide a more accurate valuation based on your vehicle's condition.
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium mb-1">Drag and drop photos here</p>
        <p className="text-sm text-muted-foreground mb-4">
          or click to browse files (JPEG, PNG, up to 10MB)
        </p>
        <Button variant="outline" type="button" disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Select Photos'}
        </Button>
      </div>

      {photoUrls.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium">Uploaded Photos ({photoUrls.length})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photoUrls.map((url, index) => (
              <Card key={index} className="overflow-hidden group relative">
                <CardContent className="p-0">
                  <div className="relative pt-[75%] bg-muted">
                    <img
                      src={url}
                      alt={`Vehicle photo ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removePhoto(index);
                      }}
                      className="absolute top-2 right-2 bg-background/80 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-background/80 py-1 px-2 text-xs truncate">
                      Photo {index + 1}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="bg-muted/40 rounded-lg p-4 flex items-start space-x-3">
        <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
        <div className="text-sm">
          <p className="font-medium">Photo tips for the best valuation:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
            <li>Include exterior photos from multiple angles</li>
            <li>Show the interior, including dashboard and seats</li>
            <li>Capture any damage or special features</li>
            <li>Good lighting helps us assess condition better</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
