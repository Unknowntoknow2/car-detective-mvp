// Update the import to use the correct Heading component
import { Heading } from "@/components/ui-kit/typography";
import { BodyM, BodyS } from "@/components/ui-kit/typography";
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export const Breakdown = () => {
  // Mock data for the breakdown
  const baseValue = 25000;
  const adjustments = [
    { name: "Mileage", value: -1200, direction: "down" },
    { name: "Condition", value: 800, direction: "up" },
    { name: "Market Demand", value: 1500, direction: "up" },
    { name: "Service History", value: 0, direction: "neutral" },
    { name: "Accident History", value: -500, direction: "down" },
  ];
  
  const finalValue = baseValue + adjustments.reduce((sum, adj) => sum + adj.value, 0);
  
  // Calculate the percentage impact of each adjustment
  const getPercentageImpact = (value: number) => {
    return Math.abs((value / baseValue) * 100);
  };
  
  // Get the appropriate icon for the adjustment direction
  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case "up":
        return <ArrowUp className="h-4 w-4 text-green-600" />;
      case "down":
        return <ArrowDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Heading className="text-2xl font-bold mb-4">Valuation Breakdown</Heading>
      
      <div className="space-y-6">
        <div>
          <BodyM className="text-muted-foreground mb-2">
            We start with a base value and apply adjustments based on your vehicle's specific details.
          </BodyM>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <BodyS className="text-muted-foreground">Base Value</BodyS>
                  <div className="text-xl font-bold">${baseValue.toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <BodyS className="text-muted-foreground">Final Value</BodyS>
                  <div className="text-2xl font-bold text-primary">${finalValue.toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <Heading className="text-lg font-semibold">Value Adjustments</Heading>
          
          {adjustments.map((adjustment, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {getDirectionIcon(adjustment.direction)}
                  <span>{adjustment.name}</span>
                </div>
                <span className={cn(
                  "font-medium",
                  adjustment.value > 0 ? "text-green-600" : 
                  adjustment.value < 0 ? "text-red-600" : "text-gray-500"
                )}>
                  {adjustment.value > 0 ? "+" : ""}{adjustment.value.toLocaleString()}
                </span>
              </div>
              <Progress 
                value={getPercentageImpact(adjustment.value)} 
                className={cn(
                  "h-1.5",
                  adjustment.value > 0 ? "bg-green-100" : 
                  adjustment.value < 0 ? "bg-red-100" : "bg-gray-100"
                )}
                indicatorClassName={
                  adjustment.value > 0 ? "bg-green-500" : 
                  adjustment.value < 0 ? "bg-red-500" : "bg-gray-400"
                }
              />
            </div>
          ))}
        </div>
        
        <Separator />
        
        <div>
          <BodyM className="mb-2">
            The final valuation represents our estimate of your vehicle's current market value based on all factors.
          </BodyM>
          <BodyS className="text-muted-foreground">
            This valuation is based on current market data and the specific details of your vehicle. Actual selling prices may vary.
          </BodyS>
        </div>
      </div>
    </div>
  );
};

export default Breakdown;
