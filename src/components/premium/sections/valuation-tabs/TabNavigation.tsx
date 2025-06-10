
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Car,
  FileText,
  Camera,
  TrendingUp,
  Calendar,
  Shield,
  Users,
} from "lucide-react";
import { ValuationServiceId } from "./services";

interface TabNavigationProps {
  activeTab: ValuationServiceId;
  vehicleFound?: boolean;
}

export function TabNavigation({ activeTab, vehicleFound }: TabNavigationProps) {
  const tabs = [
    {
      id: "vin" as ValuationServiceId,
      label: "VIN Lookup",
      icon: Car,
      badge: vehicleFound ? "Found" : undefined,
    },
    {
      id: "plate" as ValuationServiceId,
      label: "License Plate",
      icon: FileText,
    },
    {
      id: "manual" as ValuationServiceId,
      label: "Manual Entry",
      icon: FileText,
    },
    {
      id: "photo" as ValuationServiceId,
      label: "Photo Analysis",
      icon: Camera,
      premium: true,
    },
    {
      id: "market" as ValuationServiceId,
      label: "Market Analysis",
      icon: TrendingUp,
      premium: true,
    },
    {
      id: "forecast" as ValuationServiceId,
      label: "12-Month Forecast",
      icon: Calendar,
      premium: true,
    },
    {
      id: "carfax" as ValuationServiceId,
      label: "CARFAX® Report",
      icon: Shield,
      premium: true,
    },
  ];

  return (
    <div className="border-b border-border bg-background">
      <div className="container mx-auto px-4">
        <TabsList className="h-auto p-0 bg-transparent space-x-6 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="relative flex items-center gap-2 px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent bg-transparent text-muted-foreground data-[state=active]:text-primary hover:text-primary transition-colors"
              >
                <Icon className="h-4 w-4" />
                <span className="whitespace-nowrap">{tab.label}</span>
                {tab.premium && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                    Premium
                  </Badge>
                )}
                {tab.badge && (
                  <Badge variant="default" className="text-xs px-1.5 py-0.5">
                    {tab.badge}
                  </Badge>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>
    </div>
  );
}
