
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { z } from 'zod';
import { toast } from 'sonner';

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
  onFileSelect: (file: File) => Promise<void>;
  isLoading: boolean;
}

export function PhotoUploadDropzone({ onFileSelect, isLoading }: PhotoUploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      await handleFileSelection(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await handleFileSelection(e.target.files[0]);
    }
  };
  
  const handleFileSelection = async (file: File) => {
    try {
      // Validate file
      fileSchema.parse(file);
      await onFileSelect(file);
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast.error(err.errors[0].message);
      } else {
        toast.error('Failed to process image');
        console.error('File upload error:', err);
      }
    }
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

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
      />
      
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="p-3 bg-primary/10 rounded-full">
          <Camera className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium">
            Drag and drop or click to upload a photo
          </p>
          <p className="text-xs text-gray-500 mt-1">
            JPEG or PNG, max 5MB
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={triggerFileInput}
          disabled={isLoading}
        >
          Select Photo
        </Button>
      </div>
    </div>
  );
}
