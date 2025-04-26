
import { useState } from "react";
import { TabContentWrapper } from "./TabContentWrapper";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Loader2, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function PhotoUploadTab() {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;
    
    if (selectedFiles.length > 5) {
      toast.error("You can only upload up to 5 photos");
      return;
    }
    
    const fileList: File[] = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      fileList.push(selectedFiles[i]);
    }
    
    setFiles(fileList);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please select at least one photo to upload");
      return;
    }
    
    setIsUploading(true);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsUploading(false);
    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsAnalyzing(false);
    setAnalysisComplete(true);
    
    toast.success("Photos analyzed successfully!");
    
    // Mock vehicle data based on analysis
    const mockVehicleData = {
      identifierType: 'photo',
      identifier: 'photo-analysis',
      make: "Toyota",
      model: "Camry",
      year: 2019,
      condition: 80,
      conditionLabel: "Good",
      features: ["Sunroof", "Leather Seats", "Navigation System"]
    };
    
    // Save to localStorage for the premium form
    localStorage.setItem("premium_vehicle", JSON.stringify(mockVehicleData));
    
    // Give the user a moment to see the success state before redirecting
    setTimeout(() => {
      navigate("/premium-valuation");
    }, 1000);
  };

  return (
    <TabContentWrapper
      title="Photo Analysis"
      description="Upload photos of your vehicle for AI-powered condition assessment and valuation"
    >
      <div className="space-y-6">
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
          {files.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <Check className="h-8 w-8 text-green-500 mr-2" />
                <span className="text-lg font-medium">{files.length} photo{files.length !== 1 ? 's' : ''} selected</span>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center">
                {Array.from(files).map((file, index) => (
                  <div key={index} className="relative w-24 h-24 overflow-hidden rounded border border-slate-200">
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt={`Vehicle photo ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => setFiles([])}
                className="mt-2"
              >
                Clear Selection
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Camera className="h-12 w-12 mx-auto text-slate-400" />
              <p className="text-lg">Drag and drop up to 5 photos of your vehicle, or click to browse</p>
              <p className="text-sm text-slate-500">
                For best results, include photos of the exterior from multiple angles, interior, and any damage
              </p>
            </div>
          )}
          
          <input 
            type="file" 
            id="photoUpload" 
            multiple 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileChange}
          />
          
          {files.length === 0 && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => document.getElementById('photoUpload')?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Select Photos
            </Button>
          )}
        </div>
        
        {files.length > 0 && (
          <div className="flex justify-end">
            <Button 
              onClick={handleUpload} 
              disabled={isUploading || isAnalyzing || analysisComplete}
              className="bg-primary"
            >
              {isUploading && (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              )}
              {isAnalyzing && (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing with AI...
                </>
              )}
              {analysisComplete && (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Analysis Complete
                </>
              )}
              {!isUploading && !isAnalyzing && !analysisComplete && (
                <>
                  Upload & Analyze Photos
                </>
              )}
            </Button>
          </div>
        )}
        
        <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <h4 className="font-medium mb-2 flex items-center">
            <Camera className="h-4 w-4 mr-2 text-primary" />
            How Photo Analysis Works
          </h4>
          <p className="text-sm text-slate-600">
            Our AI analyzes multiple photos of your vehicle to assess its condition, detect damage, 
            and evaluate wear patterns. This analysis increases valuation accuracy by up to 15% 
            compared to self-reported condition scores.
          </p>
        </div>
      </div>
    </TabContentWrapper>
  );
}
