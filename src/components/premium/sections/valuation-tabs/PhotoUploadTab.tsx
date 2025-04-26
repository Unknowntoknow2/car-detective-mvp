
import { useState, useRef } from "react";
import { TabContentWrapper } from "./TabContentWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload, Check, AlertTriangle, Car } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { LoadingState } from "../../common/LoadingState";

export function PhotoUploadTab() {
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [detectedVehicle, setDetectedVehicle] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset states
    setError(null);
    setDetectedVehicle(null);
    setIsUploading(true);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG, etc.)');
      setIsUploading(false);
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image is too large. Please upload an image under 10MB.');
      setIsUploading(false);
      return;
    }

    try {
      // Read file as data URL
      const reader = new FileReader();
      reader.onload = async (event) => {
        const imageDataUrl = event.target?.result as string;
        setUploadedImage(imageDataUrl);
        setIsUploading(false);
        
        // Start analyzing the image
        await analyzeImage(imageDataUrl);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image. Please try again.');
      setIsUploading(false);
    }
  };

  const analyzeImage = async (imageDataUrl: string) => {
    setIsAnalyzing(true);
    
    try {
      // For demo purposes, we'll simulate AI detection with a delay
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // For demo, randomly decide if vehicle is detected
      const randomSuccess = Math.random() > 0.2; // 80% success rate
      
      if (!randomSuccess) {
        setError('No vehicle detected in the image. Please upload a clear photo of the vehicle.');
        setIsAnalyzing(false);
        return;
      }
      
      // Mock detected vehicle data
      const detectedVehicleData = {
        make: 'Toyota',
        model: 'Camry',
        year: 2019,
        confidence: 0.87,
        color: 'Silver',
        bodyType: 'Sedan'
      };
      
      setDetectedVehicle(detectedVehicleData);
      toast.success("Vehicle successfully detected!");
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleContinueToValuation = () => {
    if (!detectedVehicle) return;
    
    // Save the vehicle details to local storage for the premium form
    localStorage.setItem("premium_vehicle", JSON.stringify({
      identifierType: 'photo',
      make: detectedVehicle.make,
      model: detectedVehicle.model,
      year: detectedVehicle.year,
      exteriorColor: detectedVehicle.color,
      bodyType: detectedVehicle.bodyType
    }));
    
    toast.success("Vehicle information saved. Continuing to premium valuation.");
    navigate("/premium-valuation");
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <TabContentWrapper
      title="Photo Analysis"
      description="Upload a photo of your vehicle for AI-powered identification and valuation"
    >
      <div className="space-y-6">
        {!uploadedImage ? (
          <Card className="border-dashed border-2 border-slate-300 bg-slate-50">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Camera className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Upload Vehicle Photo</h3>
                  <p className="text-sm text-slate-500 max-w-md">
                    Take a clear photo of your vehicle from the front or side. Our AI will identify your vehicle make, model, and year automatically.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button onClick={triggerFileInput} className="bg-primary">
                    <Upload className="h-4 w-4 mr-2" />
                    Browse Files
                  </Button>
                  <Button variant="outline" onClick={triggerFileInput}>
                    <Camera className="h-4 w-4 mr-2" />
                    Take Photo
                  </Button>
                </div>
                <p className="text-xs text-slate-400">
                  Supported formats: JPEG, PNG, WebP. Max size: 10MB
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                  capture="environment"
                />
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="relative rounded-lg overflow-hidden border border-slate-200">
              <img 
                src={uploadedImage} 
                alt="Uploaded vehicle" 
                className="w-full h-auto object-cover max-h-[400px]" 
              />
              
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <LoadingState text="Analyzing vehicle..." size="lg" />
                </div>
              )}
              
              {detectedVehicle && (
                <div className="absolute top-3 right-3 bg-green-100 text-green-800 px-3 py-1.5 rounded-full flex items-center">
                  <Check className="h-4 w-4 mr-1.5" />
                  <span className="text-sm font-medium">Vehicle Detected</span>
                </div>
              )}
              
              {error && (
                <div className="absolute top-3 right-3 bg-red-100 text-red-800 px-3 py-1.5 rounded-full flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1.5" />
                  <span className="text-sm font-medium">Detection Failed</span>
                </div>
              )}
            </div>
            
            {isUploading && <LoadingState text="Uploading image..." />}
            
            {error && !isUploading && (
              <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800 mb-1">Detection Error</h4>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-3 justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setUploadedImage(null);
                      setError(null);
                    }}
                  >
                    Try Different Image
                  </Button>
                </div>
              </div>
            )}
            
            {detectedVehicle && !isAnalyzing && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Vehicle Detected</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-slate-500">Make</p>
                      <p className="font-medium">{detectedVehicle.make}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Model</p>
                      <p className="font-medium">{detectedVehicle.model}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Year</p>
                      <p className="font-medium">{detectedVehicle.year}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Color</p>
                      <p className="font-medium">{detectedVehicle.color}</p>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-5">
                    <div className="flex items-center gap-2">
                      <Car className="h-5 w-5 text-amber-600" />
                      <p className="text-sm text-amber-800">
                        Recognition confidence: <span className="font-medium">{Math.round(detectedVehicle.confidence * 100)}%</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setUploadedImage(null);
                        setDetectedVehicle(null);
                      }}
                    >
                      Try Different Image
                    </Button>
                    <Button className="bg-primary" onClick={handleContinueToValuation}>
                      Continue with This Vehicle
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </TabContentWrapper>
  );
}
