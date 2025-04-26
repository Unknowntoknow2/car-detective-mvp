import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VinLookup } from "../lookup/VinLookup";
import { PlateLookup } from "../lookup/PlateLookup";
import { ManualLookup } from "../lookup/ManualLookup";
import { Card } from "@/components/ui/card";
import { CarFront, FileText, Search, Camera, Building, ChartBar, Calendar, Shield } from "lucide-react";
import { useState } from "react";
import { useVehicleLookup } from "@/hooks/useVehicleLookup";
import { toast } from "sonner";
import { TabHeader } from "./valuation-tabs/TabHeader";
import { TabContentWrapper } from "./valuation-tabs/TabContentWrapper";
import { PhotoUploadTab } from "./valuation-tabs/PhotoUploadTab";
import { UnauthorizedRedirectTab } from "./valuation-tabs/UnauthorizedRedirectTab";

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
    { id: "vin", title: "VIN Lookup", icon: CarFront },
    { id: "plate", title: "Plate Lookup", icon: Search },
    { id: "manual", title: "Manual Entry", icon: FileText },
    { id: "photo", title: "Photo Analysis", icon: Camera },
    { id: "dealers", title: "Dealer Offers", icon: Building },
    { id: "market", title: "Market Analysis", icon: ChartBar },
    { id: "forecast", title: "12-Month Forecast", icon: Calendar },
    { id: "carfax", title: "CARFAX Report", icon: Shield }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0">
      <TabHeader />
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
            <TabContentWrapper
              title="VIN Lookup"
              description="Enter your Vehicle Identification Number for the most accurate valuation"
            >
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
            </TabContentWrapper>
          </TabsContent>

          <TabsContent value="plate">
            <TabContentWrapper
              title="Plate Lookup"
              description="Enter your license plate and state for quick vehicle identification"
            >
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
            </TabContentWrapper>
          </TabsContent>

          <TabsContent value="manual">
            <TabContentWrapper
              title="Manual Entry"
              description="Manually enter your vehicle details for a custom valuation"
            >
              <ManualLookup />
            </TabContentWrapper>
          </TabsContent>
          
          <TabsContent value="photo">
            <PhotoUploadTab />
          </TabsContent>
          
          {["dealers", "market", "forecast", "carfax"].map((tabId) => (
            <TabsContent key={tabId} value={tabId}>
              <UnauthorizedRedirectTab setActiveTab={setActiveTab} />
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
