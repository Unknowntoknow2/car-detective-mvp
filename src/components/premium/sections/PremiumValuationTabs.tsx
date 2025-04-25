
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { VinLookup } from "../lookup/VinLookup";
import { useState } from "react";
import { ValueEstimateCard } from "./ValueEstimateCard";

export function PremiumValuationTabs() {
  const [estimatedValue, setEstimatedValue] = useState(0);
  
  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="info" className="space-y-6">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="info">Enter Info</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="accidents">Accident History</TabsTrigger>
              <TabsTrigger value="market">Market Offers</TabsTrigger>
              <TabsTrigger value="carfax">CARFAX Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <Card className="p-6">
                <VinLookup />
              </Card>
            </TabsContent>

            <TabsContent value="features">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Vehicle Features</h3>
                {/* Feature selection will be implemented */}
              </Card>
            </TabsContent>

            <TabsContent value="accidents">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Accident History</h3>
                {/* Accident history form will be implemented */}
              </Card>
            </TabsContent>

            <TabsContent value="market">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Market Offers</h3>
                {/* Market offers will be implemented */}
              </Card>
            </TabsContent>

            <TabsContent value="carfax">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">CARFAX Report Analysis</h3>
                {/* CARFAX analysis will be implemented */}
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <ValueEstimateCard estimatedValue={estimatedValue} />
        </div>
      </div>
    </div>
  );
}
