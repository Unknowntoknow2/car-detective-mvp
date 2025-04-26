
import { TabContentWrapper } from "./TabContentWrapper";
import { PhotoUpload } from "../../lookup/PhotoUpload";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import { AlertCircle } from "lucide-react";

export function PhotoUploadTab() {
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<any>(null);

  const handlePhotoAnalysisComplete = (vehicleData: any) => {
    setVehicle(vehicleData);
    // Persist data in session storage for better state management between tabs
    sessionStorage.setItem("analyzed_vehicle", JSON.stringify(vehicleData));
  };

  const handleContinueToValuation = () => {
    if (!vehicle) return;
    
    // Save the vehicle details to local storage for the premium form
    localStorage.setItem("premium_vehicle", JSON.stringify({
      identifierType: 'photo',
      identifier: 'photo-analysis',
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      trim: vehicle.trim || "Standard",
      exteriorColor: vehicle.exteriorColor,
      // Adding additional data for better persistence between tabs
      mileage: vehicle.mileage || null,
      features: vehicle.features || [],
      condition: vehicle.condition || 50
    }));
    
    toast.success("Vehicle information saved. Continuing to premium valuation.");
    navigate("/premium-valuation");
  };

  // Retrieve previously analyzed vehicle data for persistence between tabs
  useState(() => {
    const savedVehicle = sessionStorage.getItem("analyzed_vehicle");
    if (savedVehicle) {
      try {
        setVehicle(JSON.parse(savedVehicle));
      } catch (error) {
        console.error("Error parsing saved vehicle data:", error);
      }
    }
  });

  return (
    <TabContentWrapper
      title="Photo Analysis"
      description="Upload photos of your vehicle and let our AI identify it"
    >
      <PhotoUpload onPhotoAnalysisComplete={handlePhotoAnalysisComplete} />
      
      {vehicle && (
        <div className="mt-8 p-6 bg-slate-50 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-xl mb-4">Vehicle Identified</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500">Year, Make, Model</p>
              <p className="font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Trim</p>
              <p className="font-medium">{vehicle.trim || "Standard"}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Color</p>
              <p className="font-medium">{vehicle.exteriorColor || "Not detected"}</p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button className="bg-primary" onClick={handleContinueToValuation}>Continue to Valuation</Button>
          </div>
        </div>
      )}

      {!vehicle && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-700">
              Take clear photos of your vehicle from multiple angles for the best results.
              Our AI will analyze the images to identify your vehicle's make, model, and year.
            </p>
          </div>
        </div>
      )}
    </TabContentWrapper>
  );
}
