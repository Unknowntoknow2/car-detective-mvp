
import { TabContentWrapper } from "./TabContentWrapper";
import { ManualEntryForm } from "@/components/lookup/ManualEntryForm";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ManualEntryFormData } from "@/components/lookup/types/manualEntry";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

interface ManualEntryTabProps {
  onSubmit: (data: ManualEntryFormData) => void;
  isLoading: boolean;
}

export function ManualEntryTab({ onSubmit, isLoading }: ManualEntryTabProps) {
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<ManualEntryFormData | null>(null);

  const handleFormSubmit = async (data: ManualEntryFormData) => {
    try {
      // Call the parent onSubmit handler
      onSubmit(data);
      setVehicle(data);
      toast.success("Vehicle details submitted successfully");
    } catch (error) {
      toast.error("Failed to submit vehicle details");
      console.error("Error submitting manual entry:", error);
    }
  };

  const handleContinueToValuation = () => {
    if (!vehicle) return;
    
    // Save the vehicle details to local storage for the premium form
    localStorage.setItem("premium_vehicle", JSON.stringify({
      identifierType: 'manual',
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      mileage: vehicle.mileage,
      fuelType: vehicle.fuelType,
      condition: vehicle.condition,
      zipCode: vehicle.zipCode,
      accident: vehicle.accident,
      accidentDetails: vehicle.accidentDetails,
      selectedFeatures: vehicle.selectedFeatures
    }));
    
    toast.success("Vehicle information saved. Continuing to premium valuation.");
    navigate("/premium-valuation");
  };

  return (
    <TabContentWrapper
      title="Manual Vehicle Entry"
      description="Enter your vehicle details manually for a comprehensive valuation"
    >
      <ManualEntryForm 
        onSubmit={handleFormSubmit} 
        isLoading={isLoading}
        submitButtonText="Submit Vehicle Details"
        isPremium={true}
      />
      
      {vehicle && (
        <Card className="mt-8 p-6 bg-slate-50 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-xl mb-4">Vehicle Details Submitted</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500">Year, Make, Model</p>
              <p className="font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Mileage</p>
              <p className="font-medium">{vehicle.mileage?.toLocaleString() || 0} miles</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Fuel Type</p>
              <p className="font-medium">{vehicle.fuelType || "Not specified"}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Condition</p>
              <p className="font-medium capitalize">{vehicle.condition}</p>
            </div>
            {vehicle.selectedFeatures && vehicle.selectedFeatures.length > 0 && (
              <div className="col-span-2">
                <p className="text-sm text-slate-500 mb-2">Selected Features</p>
                <div className="flex flex-wrap gap-2">
                  {vehicle.selectedFeatures.map((feature, index) => (
                    <div key={index} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs flex items-center">
                      <Check className="h-3 w-3 mr-1" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button className="bg-primary" onClick={handleContinueToValuation}>Continue to Valuation</Button>
          </div>
        </Card>
      )}
    </TabContentWrapper>
  );
}
