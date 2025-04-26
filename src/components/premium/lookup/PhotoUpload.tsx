
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Camera, Loader2, Upload, X, CheckCircle, Image } from 'lucide-react';
import { useVehicleLookup } from '@/hooks/useVehicleLookup';
import { toast } from 'sonner';
import { ErrorState } from '@/components/premium/common/ErrorState';
import { LoadingState } from '@/components/premium/common/LoadingState';

interface PhotoUploadProps {
  onPhotoAnalysisComplete?: (vehicleData: any) => void;
}

// Allowed file types for vehicle images
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function PhotoUpload({ onPhotoAnalysisComplete }: PhotoUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const { lookupVehicle, isLoading, error: lookupError } = useVehicleLookup();

  // Cleanup function to prevent memory leaks
  useEffect(() => {
    return () => {
      // Revoke object URLs to avoid memory leaks
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return `"${file.name}" is not a supported image format. Please use JPEG, PNG, WebP, or HEIC.`;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return `"${file.name}" exceeds the maximum file size of 10MB.`;
    }
    
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newErrors: string[] = [];
      
      // Check total number of files
      if (files.length + selectedFiles.length > 5) {
        newErrors.push("Maximum 5 images allowed. Please remove some images before adding more.");
        setErrors(newErrors);
        return;
      }
      
      // Validate each file
      const validFiles: File[] = [];
      const newPreviewUrls: string[] = [];
      
      files.forEach(file => {
        const errorMessage = validateFile(file);
        if (errorMessage) {
          newErrors.push(errorMessage);
        } else {
          validFiles.push(file);
          newPreviewUrls.push(URL.createObjectURL(file));
        }
      });
      
      if (validFiles.length > 0) {
        setSelectedFiles(prev => [...prev, ...validFiles]);
        setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
        setSuccessMessage(`Added ${validFiles.length} image${validFiles.length > 1 ? 's' : ''} successfully`);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      }
      
      setErrors(newErrors);
      
      // Clear file input
      e.target.value = '';
    }
  };

  const removeFile = (index: number) => {
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setErrors([]);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setErrors(["Please select at least one image"]);
      return;
    }
    
    setUploading(true);
    setErrors([]);
    
    try {
      // In a production app, we would upload these files to storage
      // For now, we'll create a simplified representation to send to our mock analysis endpoint
      const imageData = selectedFiles.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified
      }));
      
      toast.info("Analyzing vehicle photos...");
      
      // Call the lookupVehicle function with 'photo' type and image data
      const result = await lookupVehicle('photo', 'photo-analysis', undefined, undefined, imageData);
      
      if (result) {
        toast.success("Photo analysis complete!");
        onPhotoAnalysisComplete?.(result);
      } else if (lookupError) {
        setErrors([lookupError]);
        toast.error("Photo analysis failed");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to analyze photos";
      setErrors([errorMessage]);
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/30">
            <Image className="h-4 w-4 mr-1" />
            Advanced
          </Badge>
          <p className="text-sm text-slate-500">AI-Powered Recognition</p>
        </div>
        
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
          {previewUrls.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="relative h-36 w-full overflow-hidden rounded-md border border-slate-200">
                      <img 
                        src={url} 
                        alt={`Vehicle preview ${index+1}`} 
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                
                {previewUrls.length < 5 && (
                  <label className="h-36 border border-dashed border-slate-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                    <Camera className="h-6 w-6 text-slate-400 mb-2" />
                    <span className="text-xs text-slate-500">Add more</span>
                    <Input 
                      type="file" 
                      accept="image/jpeg,image/png,image/webp,image/heic" 
                      multiple 
                      className="hidden"
                      onChange={handleFileChange}
                      disabled={isLoading || uploading}
                    />
                  </label>
                )}
              </div>
              
              <Button 
                onClick={handleUpload}
                disabled={uploading || isLoading || selectedFiles.length === 0}
                className="w-full"
              >
                {uploading || isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Photos...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Analyze Vehicle Photos
                  </>
                )}
              </Button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-36 cursor-pointer">
              <Camera className="h-10 w-10 text-slate-400 mb-3" />
              <p className="text-sm text-slate-600 mb-1">Upload vehicle photos for AI analysis</p>
              <p className="text-xs text-slate-500">Take clear photos of the exterior, interior, and VIN plate</p>
              <Input 
                type="file" 
                accept="image/jpeg,image/png,image/webp,image/heic" 
                multiple 
                className="hidden"
                onChange={handleFileChange}
                disabled={isLoading || uploading}
              />
            </label>
          )}
        </div>
        
        {errors.length > 0 && (
          <div className="mt-2 space-y-1">
            {errors.map((error, index) => (
              <ErrorState
                key={index}
                message={error}
                variant="inline"
              />
            ))}
          </div>
        )}
        
        {successMessage && (
          <div className="flex items-center gap-2 text-green-600 text-sm mt-2">
            <CheckCircle className="h-4 w-4" />
            <span>{successMessage}</span>
          </div>
        )}
        
        <div className="flex items-start gap-2 text-xs text-slate-500 mt-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <div>
            <p>
              Upload up to 5 photos of your vehicle. Our AI will analyze them to determine make, model, year, and condition.
            </p>
            <ul className="mt-1 list-disc pl-4 space-y-1">
              <li>Take photos in good lighting from multiple angles</li>
              <li>Include front, side, and rear views</li>
              <li>Capture the VIN plate and interior if possible</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
