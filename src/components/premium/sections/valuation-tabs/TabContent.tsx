
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VinLookupTab } from "./VinLookupTab";
import { PlateLookupTab } from "./PlateLookupTab";
import { PhotoUploadTab } from "./PhotoUploadTab";
import { TwelveMonthForecastTab } from "./TwelveMonthForecastTab";
import { useValuationState } from "./hooks/useValuationState";

export function TabContent() {
  const {
    activeTab,
    setActiveTab,
    vinData,
    setVinData,
    plateData,
    setPlateData,
    vehicleData,
    isLoading,
    handleVinLookup,
    handlePlateLookup,
  } = useValuationState();

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="vin">VIN Lookup</TabsTrigger>
        <TabsTrigger value="plate">License Plate</TabsTrigger>
        <TabsTrigger value="photos">Photo Analysis</TabsTrigger>
        <TabsTrigger value="forecast">12-Month Forecast</TabsTrigger>
      </TabsList>

      <TabsContent value="vin">
        <VinLookupTab
          value={vinData}
          onChange={setVinData}
          onLookup={handleVinLookup}
          isLoading={isLoading}
        />
      </TabsContent>

      <TabsContent value="plate">
        <PlateLookupTab
          value={plateData.plate}
          state={plateData.state}
          onPlateChange={(plate) => setPlateData(prev => ({ ...prev, plate }))}
          onStateChange={(state) => setPlateData(prev => ({ ...prev, state }))}
          onLookup={handlePlateLookup}
          isLoading={isLoading}
          vehicle={vehicleData}
        />
      </TabsContent>

      <TabsContent value="photos">
        <PhotoUploadTab
          isLoading={isLoading}
          vehicle={vehicleData}
          onPhotoUpload={(files: File[]) => console.log("Photos uploaded:", files)}
        />
      </TabsContent>

      <TabsContent value="forecast">
        <TwelveMonthForecastTab
          vehicleData={vehicleData ? {
            make: vehicleData.make,
            model: vehicleData.model,
            year: vehicleData.year,
            trim: vehicleData.trim,
            vin: vehicleData.vin,
          } : undefined}
        />
      </TabsContent>
    </Tabs>
  );
}
