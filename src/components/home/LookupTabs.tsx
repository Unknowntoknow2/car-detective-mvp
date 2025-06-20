import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnifiedPlateLookup } from "@/components/lookup/UnifiedPlateLookup";
import { ManualEntryForm } from "@/components/lookup/manual/ManualEntryForm";

interface LookupTabsProps {
  onVehicleFound: (vehicle: any) => void;
  tier?: "free" | "premium";
  defaultTab?: string;
  onSubmit?: (type: string, value: string, state?: string) => Promise<void>;
}

export function LookupTabs({ onVehicleFound, tier = "free", defaultTab = "plate" }: LookupTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="plate">License Plate</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>
          
          <TabsContent value="plate" className="mt-6">
            <UnifiedPlateLookup
              tier={tier}
              onVehicleFound={onVehicleFound}
            />
          </TabsContent>
          
          <TabsContent value="manual" className="mt-6">
            <ManualEntryForm
              onSubmit={onVehicleFound}
              tier={tier}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
