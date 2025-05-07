
import React, { useState, useRef } from 'react';
import { UploadCloud, ImagePlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MAX_FILES } from '@/types/photo';

interface PhotoUploadDropzoneProps {
  onFilesSelect: (files: File[]) => void;
  isLoading: boolean;
  currentFileCount: number;
  additionalMode?: boolean;
  minRequired?: number;
}

export function PhotoUploadDropzone({
  onFilesSelect,
  isLoading,
  currentFileCount,
  additionalMode = false,
  minRequired = 3
}: PhotoUploadDropzoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const remainingFiles = MAX_FILES - currentFileCount;
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files)
        .filter(file => file.type.startsWith('image/'))
        .slice(0, remainingFiles);
        
      if (files.length > 0) {
        onFilesSelect(files);
      }
    }
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
        .filter(file => file.type.startsWith('image/'))
        .slice(0, remainingFiles);
        
      if (files.length > 0) {
        onFilesSelect(files);
      }
    }
    
    // Reset input value to allow selecting the same files again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Compact version used when photos already exist
  if (additionalMode) {
    return (
      <div className="mb-6">
        <Button
          variant="outline"
          className="w-full flex items-center gap-2"
          onClick={openFileDialog}
          disabled={isLoading || remainingFiles <= 0}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <ImagePlus className="h-4 w-4" />
              Add More Photos ({remainingFiles} remaining)
            </>
          )}
          <Input 
            ref={fileInputRef}
            type="file" 
            accept="image/*" 
            multiple 
            className="hidden"
            onChange={handleFileInputChange}
            disabled={isLoading}
          />
        </Button>
      </div>
    );
  }
  
  // Full dropzone when no photos exist yet
  return (
    <div
      className={`border-2 ${
        dragActive ? 'border-primary' : 'border-dashed border-gray-300'
      } rounded-lg p-8 text-center transition-colors ${
        isLoading ? 'opacity-70 pointer-events-none' : ''
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="bg-primary/10 p-4 rounded-full">
          <UploadCloud className="h-8 w-8 text-primary" />
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium">
            Drop your vehicle photos here
          </p>
          <p className="text-xs text-muted-foreground">
            Upload up to {remainingFiles} photos (JPG, PNG, WebP)
          </p>
          <p className="text-xs text-muted-foreground">
            {minRequired && currentFileCount < minRequired && 
              `We recommend at least ${minRequired} photos for accurate condition assessment`}
          </p>
        </div>
        
        <Button
          variant="secondary"
          onClick={openFileDialog}
          disabled={isLoading || remainingFiles <= 0}
          className="relative"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Select Photos'
          )}
          <Input 
            ref={fileInputRef}
            type="file" 
            accept="image/*" 
            multiple 
            className="hidden"
            onChange={handleFileInputChange}
            disabled={isLoading}
          />
        </Button>
      </div>
    </div>
  );
}
