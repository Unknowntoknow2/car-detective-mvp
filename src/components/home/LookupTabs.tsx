
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VinDecoderForm } from "@/components/lookup/VinDecoderForm";
import PlateDecoderForm from "@/components/lookup/PlateDecoderForm";
import ManualEntryForm from "@/components/lookup/ManualEntryForm";
import { CarFront, Search, FileText } from "lucide-react";
import { ManualEntryFormData } from "@/components/lookup/types/manualEntry";

interface LookupTabsProps {
  defaultTab?: string;
}

export function LookupTabs({ defaultTab = "vin" }: LookupTabsProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  // Add debugging logs for component mounting
  console.log("LookupTabs rendering with activeTab:", activeTab);

  // Add a mock onSubmit function for ManualEntryForm
  const handleManualSubmit = (data: ManualEntryFormData) => {
    console.log("Manual entry form submitted:", data);
    // Here you would typically handle the form submission
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
            <VinDecoderForm />
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
            <PlateDecoderForm />
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
