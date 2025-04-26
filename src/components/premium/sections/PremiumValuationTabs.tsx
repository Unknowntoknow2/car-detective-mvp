
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VinLookup } from "../lookup/VinLookup";
import { PlateLookup } from "../lookup/PlateLookup";
import { ManualLookup } from "../lookup/ManualLookup";
import { Card } from "@/components/ui/card";
import { CarFront, FileText, Search, Camera, Building, ChartBar, Calendar, Shield } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useVehicleLookup } from "@/hooks/useVehicleLookup";
import { toast } from "sonner";

export function PremiumValuationTabs() {
  const [activeTab, setActiveTab] = useState("vin");
  const [vinValue, setVinValue] = useState("");
  const [plateValue, setPlateValue] = useState("");
  const [plateState, setPlateState] = useState("");
  const { lookupVehicle, isLoading, vehicle } = useVehicleLookup();
  
  const handleVinLookup = async () => {
    if (!vinValue || vinValue.length < 17) {
      toast.error("Please enter a valid 17-character VIN");
      return;
    }
    
    await lookupVehicle('vin', vinValue);
  };
  
  const handlePlateLookup = async () => {
    if (!plateValue) {
      toast.error("Please enter a license plate number");
      return;
    }
    
    if (!plateState) {
      toast.error("Please select a state");
      return;
    }
    
    await lookupVehicle('plate', plateValue, plateState);
  };

  const services = [
    {
      id: "vin",
      title: "VIN Lookup",
      icon: CarFront,
      description: "Enter your Vehicle Identification Number for precise vehicle matching"
    },
    {
      id: "plate",
      title: "Plate Lookup",
      icon: Search,
      description: "Use your license plate number for quick vehicle identification"
    },
    {
      id: "manual",
      title: "Manual Entry",
      icon: FileText,
      description: "Manually enter your vehicle details if VIN is unavailable"
    },
    {
      id: "photo",
      title: "Photo Analysis",
      icon: Camera,
      description: "Upload photos for AI-powered condition assessment"
    },
    {
      id: "dealers",
      title: "Dealer Offers",
      icon: Building,
      description: "Compare real dealer offers in your area"
    },
    {
      id: "market",
      title: "Market Analysis",
      icon: ChartBar,
      description: "View current market trends and pricing"
    },
    {
      id: "forecast",
      title: "12-Month Forecast",
      icon: Calendar,
      description: "See future value projections for your vehicle"
    },
    {
      id: "carfax",
      title: "CARFAX Report",
      icon: Shield,
      description: "Access complete vehicle history and records"
    }
  ];
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4 sm:grid-cols-8 mb-12 bg-white rounded-xl shadow-sm border border-slate-200 p-1 overflow-x-auto">
          {services.map((service) => (
            <TabsTrigger
              key={service.id}
              value={service.id}
              className="flex flex-col items-center gap-1 py-3 px-4 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-colors"
            >
              <service.icon className="h-5 w-5" />
              <span className="font-medium text-sm whitespace-nowrap">{service.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        <div className="mt-6 space-y-6">
          <TabsContent value="vin">
            <Card className="p-8 border border-slate-200 shadow-sm rounded-xl bg-white">
              <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2 text-slate-900">VIN Lookup</h3>
                  <p className="text-slate-600">Enter your Vehicle Identification Number for the most accurate valuation</p>
                </div>
                
                <VinLookup 
                  value={vinValue}
                  onChange={setVinValue}
                  onLookup={handleVinLookup}
                  isLoading={isLoading}
                />
                
                {vehicle && (
                  <div className="mt-8 p-6 bg-slate-50 rounded-lg border border-slate-200">
                    <h4 className="font-semibold text-xl mb-4">Vehicle Found</h4>
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
                        <p className="text-sm text-slate-500">Engine</p>
                        <p className="font-medium">{vehicle.engine || "Not available"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Transmission</p>
                        <p className="font-medium">{vehicle.transmission || "Not available"}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <Button className="bg-primary">Continue to Valuation</Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="plate">
            <Card className="p-8 border border-slate-200 shadow-sm rounded-xl bg-white">
              <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2 text-slate-900">Plate Lookup</h3>
                  <p className="text-slate-600">Enter your license plate and state for quick vehicle identification</p>
                </div>
                
                <PlateLookup
                  plateValue={plateValue}
                  stateValue={plateState}
                  onPlateChange={setPlateValue}
                  onStateChange={setPlateState}
                  onLookup={handlePlateLookup}
                  isLoading={isLoading}
                />
                
                {vehicle && (
                  <div className="mt-8 p-6 bg-slate-50 rounded-lg border border-slate-200">
                    <h4 className="font-semibold text-xl mb-4">Vehicle Found</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-500">Year, Make, Model</p>
                        <p className="font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Color</p>
                        <p className="font-medium">{vehicle.exteriorColor || "Not available"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">VIN</p>
                        <p className="font-medium">{vehicle.vin || "Not available"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Registered State</p>
                        <p className="font-medium">{plateState}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <Button className="bg-primary">Continue to Valuation</Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="manual">
            <Card className="p-8 border border-slate-200 shadow-sm rounded-xl bg-white">
              <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2 text-slate-900">Manual Entry</h3>
                  <p className="text-slate-600">Manually enter your vehicle details for a custom valuation</p>
                </div>
                
                <ManualLookup />
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="photo">
            <Card className="p-8 border border-slate-200 shadow-sm rounded-xl bg-white">
              <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2 text-slate-900">Photo Analysis</h3>
                  <p className="text-slate-600">Upload photos for AI-powered condition assessment</p>
                </div>
                
                <div className="p-12 border-2 border-dashed border-slate-300 rounded-lg text-center">
                  <Camera className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                  <p className="text-slate-600 mb-4">Drag and drop up to 5 photos of your vehicle</p>
                  <Button variant="outline">Upload Photos</Button>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          {["dealers", "market", "forecast", "carfax"].map((tabId) => (
            <TabsContent key={tabId} value={tabId}>
              <Card className="p-8 border border-slate-200 shadow-sm rounded-xl bg-white">
                <div className="max-w-3xl mx-auto">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-2 text-slate-900">
                      {services.find(s => s.id === tabId)?.title}
                    </h3>
                    <p className="text-slate-600">
                      {services.find(s => s.id === tabId)?.description}
                    </p>
                  </div>
                  
                  <div className="p-12 bg-slate-50 rounded-lg border border-slate-200 text-center">
                    <p className="text-slate-600 mb-4">First enter your vehicle information using VIN, plate, or manual entry</p>
                    <Button 
                      variant="default" 
                      onClick={() => setActiveTab("vin")}
                    >
                      Start Vehicle Lookup
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
