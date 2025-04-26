
import { TabsContent } from "@/components/ui/tabs";
import { VinLookupTab } from "./VinLookupTab";
import { PlateLookupTab } from "./PlateLookupTab";
import { ManualEntryTab } from "./ManualEntryTab";
import { PhotoUploadTab } from "./PhotoUploadTab";
import { UnauthorizedRedirectTab } from "./UnauthorizedRedirectTab";
import { DealerOffersTab } from "./DealerOffersTab";
import { MarketAnalysisTab } from "./MarketAnalysisTab";
import { TwelveMonthForecastTab } from "./TwelveMonthForecastTab";
import { CarfaxReportTab } from "./CarfaxReportTab";
import { ValuationServiceId } from "./services";

interface TabContentProps {
  activeTab: ValuationServiceId;
  setActiveTab: (tab: ValuationServiceId) => void;
  vinValue: string;
  plateValue: string;
  plateState: string;
  isLoading: boolean;
  vehicle: any;
  onVinChange: (value: string) => void;
  onPlateChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onVinLookup: () => void;
  onPlateLookup: () => void;
  onManualSubmit: (data: any) => void;
}

export function TabContent({
  activeTab,
  setActiveTab,
  vinValue,
  plateValue,
  plateState,
  isLoading,
  vehicle,
  onVinChange,
  onPlateChange,
  onStateChange,
  onVinLookup,
  onPlateLookup,
  onManualSubmit,
}: TabContentProps) {
  return (
    <div className="space-y-6">
      <TabsContent value="vin" className="mt-0">
        <VinLookupTab 
          vinValue={vinValue}
          isLoading={isLoading}
          vehicle={vehicle}
          onVinChange={onVinChange}
          onLookup={onVinLookup}
        />
      </TabsContent>

      <TabsContent value="plate" className="mt-0">
        <PlateLookupTab
          plateValue={plateValue}
          stateValue={plateState}
          isLoading={isLoading}
          vehicle={vehicle}
          onPlateChange={onPlateChange}
          onStateChange={onStateChange}
          onLookup={onPlateLookup}
        />
      </TabsContent>

      <TabsContent value="manual" className="mt-0">
        <ManualEntryTab 
          onSubmit={onManualSubmit}
          isLoading={isLoading}
        />
      </TabsContent>
      
      <TabsContent value="photo" className="mt-0">
        <PhotoUploadTab />
      </TabsContent>
      
      <TabsContent value="dealers" className="mt-0">
        <DealerOffersTab 
          vehicleData={vehicle ? {
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            trim: vehicle.trim,
            vin: vinValue.length === 17 ? vinValue : undefined
          } : undefined}
        />
      </TabsContent>
      
      <TabsContent value="market" className="mt-0">
        <MarketAnalysisTab 
          vehicleData={vehicle ? {
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            trim: vehicle.trim
          } : undefined}
        />
      </TabsContent>
      
      <TabsContent value="forecast" className="mt-0">
        <TwelveMonthForecastTab 
          vehicleData={vehicle ? {
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            trim: vehicle.trim,
            vin: vinValue.length === 17 ? vinValue : undefined
          } : undefined}
        />
      </TabsContent>
      
      <TabsContent value="carfax" className="mt-0">
        <CarfaxReportTab 
          vin={vinValue.length === 17 ? vinValue : undefined}
        />
      </TabsContent>
    </div>
  );
}
