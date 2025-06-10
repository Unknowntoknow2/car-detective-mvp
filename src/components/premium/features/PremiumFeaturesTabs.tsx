import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PremiumFeatures } from "./PremiumFeatures";
import { PremiumCondition } from "./PremiumCondition";
import { PremiumHistory } from "./PremiumHistory";

interface PremiumFeaturesTabsProps {
  onConditionChange: (value: any) => void;
}

export const PremiumFeaturesTabs: React.FC<PremiumFeaturesTabsProps> = ({
  onConditionChange,
}) => {
  const tabs = [
    { value: "features", children: "Features", isPremium: false },
    { value: "condition", children: "Condition", isPremium: true },
    { value: "history", children: "History", isPremium: true },
  ];

  return (
    <Tabs defaultValue="features" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        {tabs.map((tab) => (
          <TabsTrigger 
            key={tab.value} 
            value={tab.value}
            className={`data-[state=active]:bg-primary data-[state=active]:text-primary-foreground ${
              tab.isPremium ? "border-l-4 border-l-yellow-400" : ""
            }`}
          >
            {tab.children}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="features" className="space-y-4">
        <PremiumFeatures />
      </TabsContent>
      <TabsContent value="condition" className="space-y-4">
        <PremiumCondition onConditionChange={onConditionChange} />
      </TabsContent>
      <TabsContent value="history" className="space-y-4">
        <PremiumHistory />
      </TabsContent>
    </Tabs>
  );
};
