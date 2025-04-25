
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VinLookup } from "../lookup/VinLookup";
import { PlateLookup } from "../lookup/PlateLookup";
import { ManualLookup } from "../lookup/ManualLookup";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { CarFront, FileText, Search } from "lucide-react";

export function PremiumValuationTabs() {
  const { t } = useTranslation('common');
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Tabs defaultValue="vin" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/50 backdrop-blur-sm border-2 p-1 rounded-xl shadow-sm">
          <TabsTrigger 
            value="vin" 
            className="flex items-center gap-2 py-3 px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors"
          >
            <CarFront className="h-4 w-4" />
            <span className="font-medium">VIN Lookup</span>
          </TabsTrigger>
          <TabsTrigger 
            value="plate"
            className="flex items-center gap-2 py-3 px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors"
          >
            <Search className="h-4 w-4" />
            <span className="font-medium">Plate Lookup</span>
          </TabsTrigger>
          <TabsTrigger 
            value="manual"
            className="flex items-center gap-2 py-3 px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors"
          >
            <FileText className="h-4 w-4" />
            <span className="font-medium">Manual Entry</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6 space-y-6">
          <TabsContent value="vin">
            <Card className="p-6 border-2 border-border/40 shadow-sm">
              <VinLookup />
            </Card>
          </TabsContent>

          <TabsContent value="plate">
            <Card className="p-6 border-2 border-border/40 shadow-sm">
              <PlateLookup />
            </Card>
          </TabsContent>

          <TabsContent value="manual">
            <Card className="p-6 border-2 border-border/40 shadow-sm">
              <ManualLookup />
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
