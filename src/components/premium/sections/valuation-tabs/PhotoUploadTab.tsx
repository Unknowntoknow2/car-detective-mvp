
import { useState } from "react";
import { TabContentWrapper } from "./TabContentWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Camera, Upload, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useVehicleLookup } from "@/hooks/useVehicleLookup";

export function PhotoUploadTab() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();
  const { lookupVehicle } = useVehicleLookup();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create a preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    try {
      // Mock upload delay for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsUploading(false);
      setIsAnalyzing(true);
      
      // Mock analysis delay for demonstration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock vehicle data that would come from image analysis
      const mockVehicleData = {
        make: "Toyota",
        model: "Camry",
        year: 2019,
        bodyType: "Sedan",
        color: "Silver"
      };
      
      // Call the lookupVehicle function with the mock data
      const result = await lookupVehicle(
        'photo', 
        'photo-analysis', 
        undefined, 
        mockVehicleData
      );
      
      if (result) {
        // Save the vehicle details to local storage for the premium form
        localStorage.setItem("premium_vehicle", JSON.stringify({
          identifierType: 'photo',
          make: result.make,
          model: result.model,
          year: result.year,
          exteriorColor: mockVehicleData.color
        }));
        
        toast.success("Vehicle successfully identified from photo");
        navigate("/premium-valuation");
      }
    } catch (error) {
      toast.error("Failed to analyze vehicle photo");
      console.error("Error analyzing photo:", error);
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  return (
    <TabContentWrapper
      title="Photo Analysis"
      description="Upload a photo of your vehicle for AI-powered identification and valuation"
    >
      <div className="space-y-6">
        <Card className="bg-slate-50 border-dashed border-2 border-slate-300 p-6 flex flex-col items-center justify-center text-center">
          {previewUrl ? (
            <div className="space-y-4">
              <div className="relative max-w-md mx-auto">
                <img 
                  src={previewUrl} 
                  alt="Vehicle preview" 
                  className="rounded-md max-h-64 mx-auto object-contain" 
                />
              </div>
              <p className="text-slate-600">Selected file: {selectedFile?.name}</p>
              <Button 
                type="button" 
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                variant="outline"
                className="mt-2"
              >
                Choose Different Photo
              </Button>
            </div>
          ) : (
            <div className="space-y-4 py-12">
              <div className="mx-auto bg-slate-100 h-16 w-16 rounded-full flex items-center justify-center">
                <Camera className="h-8 w-8 text-slate-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-900">Upload Vehicle Photo</h3>
                <p className="text-sm text-slate-500 mt-1">
                  For best results, upload a clear photo of the front or side of your vehicle
                </p>
              </div>
              <div className="mt-4">
                <Input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="photo-upload">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="cursor-pointer"
                    asChild
                  >
                    <span>
                      <Upload className="mr-2 h-4 w-4" />
                      Select Photo
                    </span>
                  </Button>
                </label>
              </div>
            </div>
          )}
        </Card>
        
        {previewUrl && (
          <div className="flex justify-end">
            <Button 
              onClick={handleUpload}
              disabled={isUploading || isAnalyzing}
              className="px-6"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Vehicle...
                </>
              ) : (
                "Analyze Vehicle"
              )}
            </Button>
          </div>
        )}
      </div>
    </TabContentWrapper>
  );
}
