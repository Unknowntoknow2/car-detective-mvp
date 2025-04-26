
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CarFront, FileText, Search, Camera, Building, ChartBar, Calendar, Shield } from "lucide-react";
import { useState } from "react";
import { useVehicleLookup } from "@/hooks/useVehicleLookup";
import { toast } from "sonner";
import { TabHeader } from "./valuation-tabs/TabHeader";
import { PhotoUploadTab } from "./valuation-tabs/PhotoUploadTab";
import { UnauthorizedRedirectTab } from "./valuation-tabs/UnauthorizedRedirectTab";
import { VinLookupTab } from "./valuation-tabs/VinLookupTab";
import { PlateLookupTab } from "./valuation-tabs/PlateLookupTab";
import { ManualEntryTab } from "./valuation-tabs/ManualEntryTab";
import { ManualEntryFormData } from "@/components/lookup/types/manualEntry";

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

  const handleManualSubmit = (data: ManualEntryFormData) => {
    lookupVehicle('manual', 'manual-entry', undefined, data);
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
        <TabsList className="flex w-full mb-12 overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-200 p-1">
          {services.map((service) => (
            <TabsTrigger
              key={service.id}
              value={service.id}
              className="flex flex-col items-center justify-center gap-2 py-4 px-2 sm:px-6 rounded-lg min-w-[90px] sm:min-w-[110px] data-[state=active]:bg-primary data-[state=active]:text-white transition-colors"
            >
              <service.icon className="h-5 w-5" />
              <span className="font-medium text-xs sm:text-sm text-center whitespace-nowrap">{service.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        <div className="mt-6 space-y-6">
          <TabsContent value="vin">
            <VinLookupTab 
              vinValue={vinValue}
              isLoading={isLoading}
              vehicle={vehicle}
              onVinChange={setVinValue}
              onLookup={handleVinLookup}
            />
          </TabsContent>

          <TabsContent value="plate">
            <PlateLookupTab
              plateValue={plateValue}
              stateValue={plateState}
              isLoading={isLoading}
              vehicle={vehicle}
              onPlateChange={setPlateValue}
              onStateChange={setPlateState}
              onLookup={handlePlateLookup}
            />
          </TabsContent>

          <TabsContent value="manual">
            <ManualEntryTab 
              onSubmit={handleManualSubmit}
              isLoading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="photo">
            <PhotoUploadTab />
          </TabsContent>
          
          <TabsContent value="dealers">
            <UnauthorizedRedirectTab setActiveTab={setActiveTab} />
          </TabsContent>
          
          <TabsContent value="market">
            <UnauthorizedRedirectTab setActiveTab={setActiveTab} />
          </TabsContent>
          
          <TabsContent value="forecast">
            <UnauthorizedRedirectTab setActiveTab={setActiveTab} />
          </TabsContent>
          
          <TabsContent value="carfax">
            <UnauthorizedRedirectTab setActiveTab={setActiveTab} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
