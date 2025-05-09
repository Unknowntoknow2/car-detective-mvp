
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, Image, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { PhotoFile, MAX_FILES } from '@/types/photo';

interface MockPhotoUploaderProps {
  onComplete: (photoUrls: string[]) => void;
}

export function MockPhotoUploader({ onComplete }: MockPhotoUploaderProps) {
  const [photos, setPhotos] = useState<PhotoFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: MAX_FILES,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: (acceptedFiles) => {
      // Convert files to PhotoFile objects with previews
      const newPhotos = acceptedFiles.map(file => ({
        file,
        id: Math.random().toString(36).substring(2),
        preview: URL.createObjectURL(file)
      }));
      
      setPhotos(prev => [...prev, ...newPhotos].slice(0, MAX_FILES));
    },
    onDropRejected: (fileRejections) => {
      const errors = fileRejections.map(rejection => {
        if (rejection.errors[0].code === 'file-too-large') {
          return `${rejection.file.name} is too large (max 10MB)`;
        }
        return rejection.errors[0].message;
      });
      
      setError(errors[0]);
      toast.error(errors[0]);
    }
  });
  
  const handleRemovePhoto = (id: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id));
  };
  
  const handleUpload = async () => {
    if (photos.length === 0) {
      toast.error('Please add at least one photo');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    try {
      // Mock upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock URLs
      const mockUrls = photos.map(photo => photo.preview);
      
      // Call the callback with the mock URLs
      onComplete(mockUrls);
      
      toast.success('Photos uploaded successfully');
    } catch (err) {
      console.error('Error uploading photos:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload photos';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-8 w-8 text-gray-400" />
          <p className="text-sm font-medium">
            Drag & drop your vehicle photos here
          </p>
          <p className="text-xs text-muted-foreground">
            Or click to browse (max {MAX_FILES} photos, 10MB each)
          </p>
        </div>
      </div>
      
      {photos.length > 0 && (
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="text-sm font-medium mb-3">Selected Photos ({photos.length}/{MAX_FILES})</h3>
          
          <div className="grid grid-cols-3 gap-2">
            {photos.map(photo => (
              <div key={photo.id} className="relative group">
                <div className="aspect-square rounded-md overflow-hidden bg-gray-100">
                  <img 
                    src={photo.preview} 
                    alt="Vehicle" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <button 
                  type="button"
                  onClick={() => handleRemovePhoto(photo.id)}
                  className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button 
              onClick={handleUpload}
              disabled={isUploading || photos.length === 0}
            >
              {isUploading ? 'Uploading...' : 'Upload Photos'}
            </Button>
          </div>
        </div>
      )}
      
      {error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default MockPhotoUploader;
