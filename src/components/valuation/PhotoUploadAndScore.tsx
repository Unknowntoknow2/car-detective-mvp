
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Upload, X, Check, AlertCircle, Image } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface PhotoUploadAndScoreProps {
  valuationId?: string;
  onPhotoAnalysisComplete?: (data: any) => void;
  onScoreChange?: (score: number, condition?: any) => void; // Add this missing prop
  isPremium?: boolean;
}

export function PhotoUploadAndScore({
  valuationId,
  onPhotoAnalysisComplete,
  onScoreChange, // Add this to the destructuring
  isPremium = false
}: PhotoUploadAndScoreProps) {
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [photoScores, setPhotoScores] = useState<any[]>([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.heic']
    },
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const errors = rejectedFiles.map(file => {
          if (file.errors[0].code === 'file-too-large') {
            return 'File is too large. Maximum size is 10MB.';
          }
          return file.errors[0].message;
        });
        setError(errors.join(' '));
        return;
      }
      
      if (acceptedFiles.length > 0) {
        setError(null);
        // Add new files to existing array
        setPhotos(prevPhotos => [...prevPhotos, ...acceptedFiles]);
        
        // Generate preview URLs
        const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));
        setPreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
      }
    }
  });

  const removePhoto = (index: number) => {
    // Remove photo and its preview
    setPhotos(photos.filter((_, i) => i !== index));
    
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(previews[index]);
    setPreviews(previews.filter((_, i) => i !== index));
    
    // Remove score if it exists
    setPhotoScores(photoScores.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!valuationId || photos.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const uploadPromises = photos.map(async (photo, index) => {
        // Create a unique filename
        const fileExt = photo.name.split('.').pop();
        const fileName = `${valuationId}_${Date.now()}_${index}.${fileExt}`;
        const filePath = `${valuationId}/${fileName}`;
        
        // Upload to storage
        const { data, error } = await supabase.storage
          .from('vehicle_photos')
          .upload(filePath, photo, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (error) throw error;
        
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('vehicle_photos')
          .getPublicUrl(filePath);
        
        // Update progress
        setUploadProgress(prev => prev + (100 / photos.length));
        
        return urlData.publicUrl;
      });
      
      const uploadedUrls = await Promise.all(uploadPromises);
      
      // Now analyze photos if premium
      if (isPremium) {
        const analysisPromises = uploadedUrls.map(async (url) => {
          const { data, error } = await supabase.functions.invoke('analyze-vehicle-photo', {
            body: {
              photoUrl: url,
              valuationId
            }
          });
          
          if (error) throw error;
          return data;
        });
        
        const analysisResults = await Promise.all(analysisPromises);
        setPhotoScores(analysisResults);
        
        if (onPhotoAnalysisComplete) {
          // Find the best photo based on score
          const bestResult = analysisResults.reduce(
            (best, current) => (current.score > best.score ? current : best),
            { score: 0 }
          );
          
          onPhotoAnalysisComplete(bestResult);
        }

        // Call onScoreChange if provided
        if (onScoreChange && analysisResults.length > 0) {
          const bestResult = analysisResults.reduce(
            (best, current) => (current.score > best.score ? current : best),
            { score: 0 }
          );
          onScoreChange(bestResult.score, bestResult);
        }
      }
      
      toast.success("Photos uploaded successfully");
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload photos. Please try again.');
      toast.error("Error uploading photos");
    } finally {
      setIsUploading(false);
      setUploadProgress(100);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          <span>Vehicle Photos</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors mb-4 
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/20 hover:bg-muted/50'}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            {isDragActive ? (
              <p>Drop the files here...</p>
            ) : (
              <>
                <p className="text-sm font-medium">Drag & drop photos here or click to browse</p>
                <p className="text-xs text-muted-foreground">
                  Upload up to 5 photos of your vehicle (max 10MB each)
                </p>
              </>
            )}
          </div>
        </div>
        
        {previews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <div className="overflow-hidden rounded-md aspect-square bg-muted">
                  <img
                    src={preview}
                    alt={`Vehicle preview ${index + 1}`}
                    className="h-full w-full object-cover transition-all group-hover:scale-105"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-background/80 text-foreground hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
                {photoScores[index] && (
                  <div className="absolute bottom-2 left-2 right-2 bg-background/80 rounded-md p-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span>Quality:</span>
                      <span className={`font-medium
                        ${photoScores[index].score > 80 ? 'text-green-600' : 
                          photoScores[index].score > 60 ? 'text-amber-600' : 'text-red-600'}
                      `}>
                        {photoScores[index].score}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {isUploading && (
          <div className="mb-4">
            <Progress value={uploadProgress} className="h-2 mb-2" />
            <p className="text-xs text-center text-muted-foreground">
              Uploading photos... {Math.round(uploadProgress)}%
            </p>
          </div>
        )}
        
        {previews.length > 0 && (
          <div className="flex justify-end">
            <Button
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? (
                <>Processing...</>
              ) : photoScores.length > 0 ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Photos Analyzed
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload & Analyze
                </>
              )}
            </Button>
          </div>
        )}
        
        {previews.length === 0 && (
          <div className="py-8 flex flex-col items-center justify-center text-center text-muted-foreground">
            <Image className="h-12 w-12 mb-3 opacity-30" />
            <p>No photos added yet</p>
            <p className="text-xs mt-1">
              Adding clear photos helps improve valuation accuracy
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default PhotoUploadAndScore;
