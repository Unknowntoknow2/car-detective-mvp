
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Camera, Loader2, Upload, X } from 'lucide-react';
import { useVehicleLookup } from '@/hooks/useVehicleLookup';
import { toast } from 'sonner';
import { ErrorState } from '@/components/premium/common/ErrorState';
import { LoadingState } from '@/components/premium/common/LoadingState';

interface PhotoUploadProps {
  onPhotoAnalysisComplete?: (vehicleData: any) => void;
}

export function PhotoUpload({ onPhotoAnalysisComplete }: PhotoUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { lookupVehicle, isLoading } = useVehicleLookup();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length > 5) {
        setError("Maximum 5 images allowed");
        return;
      }
      
      // Validate file types
      const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
      if (invalidFiles.length > 0) {
        setError("Only image files are allowed");
        return;
      }
      
      // Generate preview URLs
      const newPreviews = files.map(file => URL.createObjectURL(file));
      
      setSelectedFiles(files);
      setPreviewUrls(newPreviews);
      setError(null);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError("Please select at least one image");
      return;
    }
    
    setUploading(true);
    
    try {
      // In a production app, you would upload these files to storage
      // For now, we'll use our mock analysis endpoint
      
      // Mock vehicle data from photo analysis
      const mockVehicleData = {
        make: "Toyota",
        model: "Camry",
        year: 2019,
        trim: "SE",
        exteriorColor: "Silver"
      };
      
      toast.info("Analyzing vehicle photos...");
      
      // Call the lookupVehicle function with 'photo' type and a special identifier
      const result = await lookupVehicle('photo', 'photo-analysis', undefined, mockVehicleData);
      
      if (result) {
        toast.success("Photo analysis complete!");
        onPhotoAnalysisComplete?.(result);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to analyze photos";
      setError(errorMessage);
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
                    <img 
                      src={url} 
                      alt={`Vehicle preview ${index+1}`} 
                      className="h-36 w-full object-cover rounded-md border border-slate-200"
                    />
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
                      accept="image/*" 
                      multiple 
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>
              
              <Button 
                onClick={handleUpload}
                disabled={uploading || isLoading}
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
                accept="image/*" 
                multiple 
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          )}
        </div>
        
        {error ? (
          <ErrorState
            message={error}
            variant="inline"
            className="mt-2"
          />
        ) : (
          <div className="flex items-start gap-2 text-xs text-slate-500">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p>
              Upload up to 5 photos of your vehicle. Our AI will analyze them to determine make, model, year, and condition.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
