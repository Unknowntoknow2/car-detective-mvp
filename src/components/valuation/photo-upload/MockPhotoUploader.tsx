
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { PhotoFile, Photo } from '@/types/photo';
import { v4 as uuidv4 } from 'uuid';

interface MockPhotoUploaderProps {
  onPhotosSelected: (photos: Photo[]) => void;
  maxFiles?: number;
}

export const MockPhotoUploader: React.FC<MockPhotoUploaderProps> = ({ 
  onPhotosSelected,
  maxFiles = 6
}) => {
  const [files, setFiles] = useState<PhotoFile[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const newFiles: PhotoFile[] = [];
    
    Array.from(e.target.files).forEach(file => {
      // Create a preview URL
      const preview = URL.createObjectURL(file);
      
      newFiles.push({
        id: uuidv4(),
        file,
        preview
      });
    });
    
    const combinedFiles = [...files, ...newFiles].slice(0, maxFiles);
    setFiles(combinedFiles);
    
    // Convert to Photo type for parent component
    const photos: Photo[] = combinedFiles.map(file => ({
      id: file.id,
      file: file.file,
      name: file.file.name,
      size: file.file.size,
      type: file.file.type,
      preview: file.preview,
      uploading: false,
      uploaded: false,
      url: undefined // Explicitly set url to undefined
    }));
    
    onPhotosSelected(photos);
  };

  const clearFiles = () => {
    // Release object URLs to avoid memory leaks
    files.forEach(file => {
      if (file.preview) URL.revokeObjectURL(file.preview);
    });
    
    setFiles([]);
    onPhotosSelected([]);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="photo-upload">Upload Vehicle Photos</Label>
        <Input 
          id="photo-upload" 
          type="file" 
          accept="image/*" 
          multiple 
          onChange={handleFileChange}
          disabled={files.length >= maxFiles}
          className="mt-2"
        />
        <p className="text-sm text-muted-foreground mt-1">
          {files.length} of {maxFiles} photos selected
        </p>
      </div>
      
      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
          {files.map(file => (
            <div key={file.id} className="relative aspect-square rounded-md overflow-hidden bg-muted">
              {file.preview && (
                <img 
                  src={file.preview} 
                  alt={file.file.name}
                  className="object-cover w-full h-full"
                />
              )}
            </div>
          ))}
        </div>
      )}
      
      {files.length > 0 && (
        <Button 
          type="button" 
          variant="outline" 
          onClick={clearFiles}
          className="mt-2"
        >
          Clear All Photos
        </Button>
      )}
    </div>
  );
};
