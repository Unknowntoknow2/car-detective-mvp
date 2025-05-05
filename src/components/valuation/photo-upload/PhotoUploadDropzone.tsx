
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Upload } from 'lucide-react';
import { z } from 'zod';
import { toast } from 'sonner';
import { MIN_FILES, MAX_FILES } from '@/types/photo';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

const fileSchema = z.object({
  name: z.string(),
  size: z.number().max(MAX_FILE_SIZE, 'File size must be less than 5MB'),
  type: z.enum(['image/jpeg', 'image/png', 'image/jpg'], {
    message: 'Only JPEG and PNG images are accepted'
  }),
});

interface PhotoUploadDropzoneProps {
  onFilesSelect: (files: File[]) => Promise<void>;
  isLoading: boolean;
  currentFileCount: number;
}

export function PhotoUploadDropzone({ 
  onFilesSelect, 
  isLoading, 
  currentFileCount
}: PhotoUploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const remainingFiles = MAX_FILES - currentFileCount;

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFileSelection(Array.from(e.dataTransfer.files));
    }
  };
  
  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await handleFileSelection(Array.from(e.target.files));
    }
  };
  
  const handleFileSelection = async (files: File[]) => {
    try {
      if (files.length + currentFileCount > MAX_FILES) {
        toast.error(`You can only upload up to ${MAX_FILES} images in total. ${MAX_FILES - currentFileCount} remaining.`);
        return;
      }
      
      // Validate each file
      const validFiles: File[] = [];
      const errors: string[] = [];
      
      for (const file of files) {
        try {
          fileSchema.parse(file);
          validFiles.push(file);
        } catch (err) {
          if (err instanceof z.ZodError) {
            errors.push(`${file.name}: ${err.errors[0].message}`);
          }
        }
      }
      
      if (errors.length > 0) {
        errors.forEach(error => toast.error(error));
      }
      
      if (validFiles.length > 0) {
        await onFilesSelect(validFiles);
      }
    } catch (err) {
      toast.error('Failed to process images');
      console.error('File upload error:', err);
    }
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (MAX_FILES - currentFileCount <= 0) {
    return null;
  }

  return (
    <div
      className={`border-2 ${
        isDragging ? 'border-primary' : 'border-dashed border-gray-300'
      } rounded-lg p-6 text-center transition-all ${
        isLoading ? 'opacity-50 pointer-events-none' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        disabled={isLoading}
        multiple
      />
      
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="p-3 bg-primary/10 rounded-full">
          <Upload className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium">
            {currentFileCount === 0 
              ? 'Upload 3-5 photos of your vehicle for better analysis'
              : `Add up to ${remainingFiles} more photos`}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            JPEG or PNG, max 5MB each
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={triggerFileInput}
          disabled={isLoading}
        >
          Select Photos
        </Button>
      </div>
    </div>
  );
}
