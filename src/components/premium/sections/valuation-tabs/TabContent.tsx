
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { VinLookupTab } from "./VinLookupTab";
import { PlateLookupTab } from "./PlateLookupTab";
import { ManualEntryTab } from "./ManualEntryTab";
import { PhotoLookupTab } from "./PhotoLookupTab";
import { ValuationServiceId } from "./services";

export interface TabContentProps {
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
  onManualSubmit
}: TabContentProps) {
  return (
    <>
      <TabsContent value="vin">
        <VinLookupTab
          vinValue={vinValue}
          isLoading={isLoading}
          vehicle={vehicle}
          onVinChange={onVinChange}
          onLookup={onVinLookup}
        />
      </TabsContent>
      
      <TabsContent value="plate">
        <PlateLookupTab
          plateValue={plateValue}
          plateState={plateState}
          isLoading={isLoading}
          vehicle={vehicle}
          onPlateChange={onPlateChange}
          onStateChange={onStateChange}
          onLookup={onPlateLookup}
        />
      </TabsContent>
      
      <TabsContent value="manual">
        <ManualEntryTab
          onSubmit={onManualSubmit}
          isLoading={isLoading}
        />
      </TabsContent>
      
      <TabsContent value="photo">
        <PhotoLookupTab
          isLoading={isLoading}
          vehicle={vehicle}
          onPhotoUpload={() => {}}
        />
      </TabsContent>
    </>
  );
}
