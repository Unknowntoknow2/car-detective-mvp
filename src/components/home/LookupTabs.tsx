
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VinDecoderForm } from "@/components/lookup/VinDecoderForm";
import PlateDecoderForm from "@/components/lookup/PlateDecoderForm";
import ManualEntryForm from "@/components/lookup/ManualEntryForm";
import { CarFront, Search, FileText } from "lucide-react";
import { ManualEntryFormData } from "@/components/lookup/types/manualEntry";
import { toast } from "sonner";

interface LookupTabsProps {
  defaultTab?: string;
  onSubmit?: (type: string, value: string, state?: string) => void;
}

export function LookupTabs({ defaultTab = "vin", onSubmit }: LookupTabsProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  // Handle VIN submission
  const handleVinSubmit = (vin: string) => {
    console.log("VIN form submitted:", vin);
    if (onSubmit) {
      onSubmit("vin", vin);
    } else {
      handleDefaultSubmit("vin", vin);
    }
  };

  // Handle plate submission
  const handlePlateSubmit = (plate: string, state: string) => {
    console.log("Plate form submitted:", { plate, state });
    if (onSubmit) {
      onSubmit("plate", plate, state);
    } else {
      handleDefaultSubmit("plate", plate, state);
    }
  };

  // Handle manual entry form submission
  const handleManualSubmit = (data: ManualEntryFormData) => {
    console.log("Manual entry form submitted:", data);
    
    if (onSubmit) {
      onSubmit("manual", JSON.stringify(data));
    } else {
      handleDefaultSubmit("manual", JSON.stringify(data));
    }
  };

  // Default submission handler when no onSubmit prop is provided
  const handleDefaultSubmit = (type: string, value: string, state?: string) => {
    console.log(`Default ${type} submission handler:`, { value, state });
    
    try {
      // Save form data to localStorage for use in results page
      if (type === "manual") {
        localStorage.setItem('manual_entry_data', value);
      }
      
      // Generate a temporary ID for the valuation
      const tempId = crypto.randomUUID();
      localStorage.setItem('latest_valuation_id', tempId);
      
      // Create a temp valuation object if this is manual data
      if (type === "manual") {
        const data = JSON.parse(value);
        const tempValuation = {
          id: tempId,
          make: data.make,
          model: data.model,
          year: parseInt(data.year.toString()),
          mileage: parseInt(data.mileage.toString()),
          estimated_value: Math.floor(Math.random() * (35000 - 15000) + 15000),
          condition_score: 70,
          is_manual_entry: true
        };
        
        localStorage.setItem('temp_valuation_data', JSON.stringify(tempValuation));
      }
      
      // Show success message
      toast.success('Vehicle information submitted successfully');
      
      // Navigate to results page
      window.location.href = `/result?valuationId=${tempId}&temp=true`;
    } catch (error) {
      console.error(`Error processing ${type} entry:`, error);
      toast.error('Error processing your information');
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 h-auto p-1 rounded-lg tabs-navigation">
        <TabsTrigger 
          value="vin" 
          className="py-4 px-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white z-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <CarFront className="w-5 h-5" />
            <span>VIN Lookup</span>
          </div>
        </TabsTrigger>
        
        <TabsTrigger 
          value="plate" 
          className="py-4 px-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white z-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Search className="w-5 h-5" />
            <span>Plate Lookup</span>
          </div>
        </TabsTrigger>
        
        <TabsTrigger 
          value="manual" 
          className="py-4 px-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white z-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <FileText className="w-5 h-5" />
            <span>Manual Entry</span>
          </div>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="vin" className="mt-6 z-0">
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle>VIN Lookup</CardTitle>
            <CardDescription>Enter your Vehicle Identification Number for a detailed analysis</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Fix for error #1: Correct props for VinDecoderForm */}
            <VinDecoderForm onSubmit={(vin: string) => handleVinSubmit(vin)} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="plate" className="mt-6 z-0">
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle>License Plate Lookup</CardTitle>
            <CardDescription>Look up your vehicle using license plate information</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Fix for error #2: Correct props for PlateDecoderForm */}
            <PlateDecoderForm onSubmit={(plate: string, state: string) => handlePlateSubmit(plate, state)} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="manual" className="mt-6 z-0">
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle>Manual Entry</CardTitle>
            <CardDescription>Enter vehicle details manually for a custom valuation</CardDescription>
          </CardHeader>
          <CardContent>
            <ManualEntryForm onSubmit={handleManualSubmit} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
