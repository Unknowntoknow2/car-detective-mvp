
import { useState } from "react";
import { TabContentWrapper } from "./TabContentWrapper";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Camera, Upload, X, Check, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useVehicleLookup } from "@/hooks/useVehicleLookup";
import { useNavigate } from "react-router-dom";

export function PhotoUploadTab() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const { lookupVehicle, vehicle } = useVehicleLookup();
  const navigate = useNavigate();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Reset analysis states
      setAnalysisComplete(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Reset analysis states
      setAnalysisComplete(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnalysisComplete(false);
  };

  const handleAnalyzePhoto = async () => {
    if (!selectedFile) {
      toast.error("Please upload a vehicle photo first");
      return;
    }

    setIsAnalyzing(true);

    try {
      // In a real implementation, we would upload the image to a server
      // and perform vehicle recognition. Here we'll simulate the process
      // with a timeout and mock data
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Mock successful lookup - in production this would come from the API
      const mockVehicleData = {
        make: "Toyota",
        model: "Camry",
        year: 2020,
        exteriorColor: "Silver"
      };
      
      // Use the mock data with our lookup function
      await lookupVehicle('manual', 'photo-analysis', undefined, mockVehicleData);
      
      setAnalysisComplete(true);
      toast.success("Vehicle successfully identified from photo");
    } catch (error) {
      toast.error("Could not identify vehicle from photo. Please try another image or use manual entry.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleContinue = () => {
    if (vehicle) {
      // Save the data to local storage for the premium form
      localStorage.setItem("premium_vehicle", JSON.stringify({
        identifierType: 'photo',
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        exteriorColor: vehicle.exteriorColor
      }));
      
      // Navigate to premium valuation
      toast.success("Vehicle information saved. Continuing to premium valuation.");
      navigate("/premium-valuation");
    }
  };

  return (
    <TabContentWrapper
      title="Photo Analysis"
      description="Upload a photo of your vehicle for automatic identification and valuation"
    >
      <Card className="border border-gray-200 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/30">
              <Camera className="h-3.5 w-3.5 mr-1" />
              Photo Analysis
            </Badge>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <div
                className={`border-2 border-dashed rounded-lg p-6 ${
                  !previewUrl ? 'border-gray-300 bg-gray-50' : 'border-primary/20 bg-primary/5'
                } transition-colors duration-200 flex flex-col items-center justify-center text-center`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                style={{ minHeight: "300px" }}
              >
                {!previewUrl ? (
                  <>
                    <div className="mb-4 p-3 bg-primary/10 rounded-full">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Drag & Drop Vehicle Photo</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Or click below to browse from your device
                    </p>
                    <Input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Label
                      htmlFor="photo-upload"
                      className="bg-primary text-white px-4 py-2 rounded-md cursor-pointer hover:bg-primary/90 transition-colors"
                    >
                      Choose Photo
                    </Label>
                  </>
                ) : (
                  <div className="relative w-full">
                    <img
                      src={previewUrl}
                      alt="Vehicle preview"
                      className="rounded-md w-full object-cover"
                      style={{ maxHeight: "280px" }}
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 rounded-full h-8 w-8"
                      onClick={handleRemoveFile}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="mt-4 text-sm text-muted-foreground">
                <p>For best results:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Use a clear, well-lit photo of your vehicle</li>
                  <li>Capture the entire vehicle in frame</li>
                  <li>Take the photo from the front 3/4 angle if possible</li>
                  <li>Avoid glare or shadows that may obscure details</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 flex-1">
                <h3 className="text-lg font-semibold mb-4">Vehicle Identification Status</h3>
                
                {!selectedFile ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-8">
                    <div className="bg-gray-100 p-4 rounded-full mb-4">
                      <Camera className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-muted-foreground">
                      Upload a photo to identify your vehicle
                    </p>
                  </div>
                ) : !analysisComplete ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <span>Photo uploaded successfully</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      {isAnalyzing ? (
                        <>
                          <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center">
                            <Loader2 className="h-4 w-4 text-amber-500 animate-spin" />
                          </div>
                          <span className="text-amber-700">Analyzing vehicle photo...</span>
                        </>
                      ) : (
                        <>
                          <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                          </div>
                          <span className="text-muted-foreground">Waiting for analysis</span>
                        </>
                      )}
                    </div>
                    
                    <Button
                      onClick={handleAnalyzePhoto}
                      disabled={isAnalyzing}
                      className="w-full mt-4"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        "Analyze Photo"
                      )}
                    </Button>
                  </div>
                ) : vehicle ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-green-700">Vehicle successfully identified</span>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-md p-4 border border-green-200">
                      <h4 className="font-medium text-sm text-green-800 mb-2">Identified Vehicle</h4>
                      <div className="text-lg font-semibold mb-1 text-gray-900">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </div>
                      {vehicle.exteriorColor && (
                        <div className="text-sm text-muted-foreground">
                          Exterior Color: {vehicle.exteriorColor}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 flex flex-col md:flex-row gap-3">
                      <Button onClick={handleContinue} className="flex-1">
                        Continue to Valuation
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={handleRemoveFile}
                        className="flex-1"
                      >
                        Try Different Photo
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 rounded-md p-4 border border-red-200">
                    <h4 className="font-medium text-red-800 mb-2">Identification Failed</h4>
                    <p className="text-sm text-red-700 mb-4">
                      We couldn't identify your vehicle from the photo. Please try a different photo or use another method.
                    </p>
                    <Button variant="outline" onClick={handleRemoveFile} size="sm">
                      Try Another Photo
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabContentWrapper>
  );
}
