
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VinLookup } from "../lookup/VinLookup";
import { PlateLookup } from "../lookup/PlateLookup";
import { ManualLookup } from "../lookup/ManualLookup";
import { useTranslation } from "react-i18next";

export function PremiumValuationTabs() {
  const { t } = useTranslation('common');
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Tabs defaultValue="vin" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="vin">VIN Lookup</TabsTrigger>
          <TabsTrigger value="plate">Plate Lookup</TabsTrigger>
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
        </TabsList>
        <TabsContent value="vin">
          <VinLookup />
        </TabsContent>
        <TabsContent value="plate">
          <PlateLookup />
        </TabsContent>
        <TabsContent value="manual">
          <ManualLookup />
        </TabsContent>
      </Tabs>
    </div>
  );
}
