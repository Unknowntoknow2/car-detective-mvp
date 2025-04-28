
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { z } from 'zod';
import { Upload, X, ImageIcon, Camera, Loader2, CheckCircle } from 'lucide-react';
import { usePhotoScoring } from '@/hooks/usePhotoScoring';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

const fileSchema = z.object({
  name: z.string(),
  size: z.number().max(MAX_FILE_SIZE, 'File size must be less than 5MB'),
  type: z.enum(ACCEPTED_FILE_TYPES, 'Only JPEG and PNG images are accepted'),
});

interface PhotoUploadAndScoreProps {
  valuationId: string;
  onScoreChange?: (score: number) => void;
}

export function PhotoUploadAndScore({ valuationId, onScoreChange }: PhotoUploadAndScoreProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    uploadPhoto,
    photoUrl,
    thumbnailUrl,
    photoScore,
    isUploading,
    isScoring,
    uploadProgress,
    error,
    resetUpload
  } = usePhotoScoring(valuationId);
  
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
      
      // Upload and score the photo
      const score = await uploadPhoto(file);
      
      // Call the onScoreChange callback if provided
      if (score && onScoreChange) {
        onScoreChange(score);
      }
      
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
  
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-500 text-white';
    if (score >= 0.5) return 'bg-yellow-500 text-white';
    return 'bg-red-500 text-white';
  };
  
  const formatScorePercentage = (score: number) => {
    return Math.round(score * 100);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Vehicle Photo Analysis</h3>
        <Badge variant="outline" className="bg-primary/10">AI-Powered</Badge>
      </div>
      
      {!photoUrl ? (
        <div
          className={`border-2 ${
            isDragging ? 'border-primary' : 'border-dashed border-gray-300'
          } rounded-lg p-6 text-center transition-all ${
            isUploading || isScoring ? 'opacity-50 pointer-events-none' : ''
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
            disabled={isUploading || isScoring}
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
              disabled={isUploading || isScoring}
            >
              Select Photo
            </Button>
          </div>
        </div>
      ) : (
        <Card className="relative overflow-hidden">
          {isScoring && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white z-10">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p>Analyzing photo...</p>
            </div>
          )}
          
          <div className="aspect-video relative overflow-hidden">
            <img 
              src={thumbnailUrl || photoUrl} 
              alt="Vehicle" 
              className="w-full h-full object-cover"
            />
            {photoScore !== null && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-white font-medium">Analysis Complete</span>
                  </div>
                  <Badge className={getScoreColor(photoScore)}>
                    Score: {formatScorePercentage(photoScore)}%
                  </Badge>
                </div>
              </div>
            )}
            
            <button 
              className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-black/80 transition"
              onClick={resetUpload}
              aria-label="Remove photo"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {isUploading && (
            <div className="p-3">
              <p className="text-sm font-medium mb-1">Uploading...</p>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
        </Card>
      )}
      
      {error && (
        <div className="text-sm text-red-500 flex items-center gap-1">
          <X className="h-4 w-4" />
          {error}
        </div>
      )}
      
      <div className="text-xs text-gray-500">
        <p>Upload a clear photo of your vehicle to improve valuation accuracy.</p>
        <p>Our AI will analyze the condition and features to provide a more personalized estimate.</p>
      </div>
    </div>
  );
}
