
import { useState } from "react";
import { TabContentWrapper } from "./TabContentWrapper";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Loader2, Check, FileWarning } from "lucide-react";
import { toast } from "sonner";
import { useVehicleLookup } from "@/hooks/useVehicleLookup";
import { useNavigate } from "react-router-dom";

export function PhotoUploadTab() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { lookupVehicle, isLoading, vehicle } = useVehicleLookup();
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File too large. Please select an image under 10MB.");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file.");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzePhoto = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    
    try {
      // For demo purposes, we'll simulate a successful analysis
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Simulate vehicle detection with mock data
      const mockDetectedVehicle = {
        make: "Toyota",
        model: "Camry",
        year: 2020,
        trim: "SE",
        exteriorColor: "Silver",
        bodyType: "Sedan"
      };
      
      // Use the vehicle lookup hook with the detected data
      await lookupVehicle('photo', 'photo-analysis', undefined, mockDetectedVehicle);
      
      setIsSuccess(true);
      toast.success("Vehicle successfully identified!");
    } catch (error) {
      toast.error("Failed to analyze image. Please try a different photo or method.");
      console.error("Photo analysis error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleContinueToValuation = () => {
    if (!vehicle) return;
    
    // Save the vehicle details to local storage for the premium form
    localStorage.setItem("premium_vehicle", JSON.stringify({
      identifierType: 'photo',
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      exteriorColor: vehicle.exteriorColor || null
    }));
    
    toast.success("Vehicle information saved. Continuing to premium valuation.");
    navigate("/premium-valuation");
  };

  return (
    <TabContentWrapper
      title="Photo Analysis"
      description="Upload a clear photo of your vehicle for AI-powered identification"
    >
      <div className="space-y-6">
        {!selectedFile ? (
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-10 text-center bg-slate-50 space-y-4">
            <div className="flex justify-center">
              <Camera className="h-12 w-12 text-slate-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-slate-700">Upload Vehicle Photo</h3>
              <p className="text-slate-500 mt-1">
                Take a clear photo of your vehicle from the front or side for best results
              </p>
            </div>
            <div className="flex justify-center mt-4">
              <label className="cursor-pointer">
                <Button className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Select Image
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-lg border border-slate-200 max-h-[400px] flex justify-center">
              <img
                src={preview || ''}
                alt="Vehicle preview"
                className="object-contain max-h-[400px] max-w-full"
              />
              
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/50 flex flex-col gap-3 items-center justify-center text-white">
                  <Loader2 className="h-10 w-10 animate-spin" />
                  <p className="font-medium">Analyzing vehicle...</p>
                </div>
              )}
              
              {isSuccess && (
                <div className="absolute top-4 right-4 bg-green-600 text-white p-2 rounded-full">
                  <Check className="h-6 w-6" />
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedFile(null);
                  setPreview(null);
                  setIsSuccess(false);
                }}
                disabled={isAnalyzing}
              >
                Change Photo
              </Button>
              
              {!isSuccess ? (
                <Button 
                  onClick={handleAnalyzePhoto} 
                  disabled={isAnalyzing}
                  className="flex items-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Camera className="h-4 w-4" />
                      Analyze Photo
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleContinueToValuation}
                  className="flex items-center gap-2 bg-primary"
                >
                  Continue to Valuation
                </Button>
              )}
            </div>
          </div>
        )}
        
        {vehicle && (
          <div className="mt-6 p-6 bg-slate-50 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-xl mb-4">Vehicle Identified</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Year, Make, Model</p>
                <p className="font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Color</p>
                <p className="font-medium">{vehicle.exteriorColor || "Not detected"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Body Style</p>
                <p className="font-medium">{vehicle.bodyType || "Sedan"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Confidence</p>
                <p className="font-medium">High (95%)</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="rounded-lg bg-amber-50 border border-amber-100 p-4 flex gap-3 mt-4">
          <FileWarning className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-medium">Photo Analysis Tips:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Use daylight or well-lit conditions</li>
              <li>Capture the entire vehicle in frame</li>
              <li>Try to get front 3/4 view for best results</li>
              <li>Avoid obstructions like people or other vehicles</li>
            </ul>
          </div>
        </div>
      </div>
    </TabContentWrapper>
  );
}
