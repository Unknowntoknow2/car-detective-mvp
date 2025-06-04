<<<<<<< HEAD

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Flame, Thermometer } from 'lucide-react';
=======
import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface LocalMarketCardProps {
  similarVehiclesNearby: number;
  demandScore: number; // 1-10 scale
}

<<<<<<< HEAD
export function LocalMarketCard({ 
  similarVehiclesNearby, 
  demandScore 
}: LocalMarketCardProps) {
  // Get demand description based on score
  const getDemandDescription = (score: number) => {
    if (score >= 8) return 'Very High';
    if (score >= 6) return 'High';
    if (score >= 4) return 'Moderate';
    if (score >= 2) return 'Low';
    return 'Very Low';
  };
  
  // Get demand text color based on score
  const getDemandColor = (score: number) => {
    if (score >= 8) return 'text-red-600';
    if (score >= 6) return 'text-orange-500';
    if (score >= 4) return 'text-yellow-500';
    if (score >= 2) return 'text-blue-500';
    return 'text-blue-700';
  };
  
  // Get demand explanation based on score
  const getDemandExplanation = (score: number) => {
    if (score >= 8) return 'This vehicle is in very high demand in your area.';
    if (score >= 6) return 'There is strong demand for this vehicle in your area.';
    if (score >= 4) return 'This vehicle has moderate demand in your area.';
    if (score >= 2) return 'Demand is relatively low for this vehicle in your area.';
    return 'There is very little demand for this vehicle in your area.';
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Local Market</h3>
            {demandScore >= 6 ? (
              <Flame className="h-5 w-5 text-red-500" />
            ) : (
              <Thermometer className="h-5 w-5 text-blue-500" />
            )}
          </div>
          
          <div className="text-2xl font-bold">
            <span className={getDemandColor(demandScore)}>
              {getDemandDescription(demandScore)} Demand
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground">
            {getDemandExplanation(demandScore)}
          </p>
          
          <div className="pt-4 space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Similar Vehicles Nearby</p>
              <p className="text-lg font-medium">{similarVehiclesNearby}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Demand Score</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div 
                  className={`h-2.5 rounded-full ${
                    demandScore >= 8 ? 'bg-red-600' : 
                    demandScore >= 6 ? 'bg-orange-500' : 
                    demandScore >= 4 ? 'bg-yellow-500' : 
                    demandScore >= 2 ? 'bg-blue-500' : 
                    'bg-blue-700'
                  }`}
                  style={{ width: `${demandScore * 10}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Low</span>
                <span>Moderate</span>
                <span>High</span>
              </div>
            </div>
=======
export function LocalMarketCard(
  { similarVehiclesNearby, demandScore }: LocalMarketCardProps,
) {
  // Determine demand level based on score (1-10 scale)
  let demandLevel: string;
  let demandColor: string;

  if (demandScore >= 8) {
    demandLevel = "High";
    demandColor = "text-green-600";
  } else if (demandScore >= 5) {
    demandLevel = "Medium";
    demandColor = "text-amber-600";
  } else {
    demandLevel = "Low";
    demandColor = "text-red-600";
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <MapPin className="h-4 w-4" /> Local Market
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-2">
          {similarVehiclesNearby}
        </div>
        <p className="text-sm text-slate-500 mb-4">Similar vehicles nearby</p>

        <div className="pt-2 border-t border-slate-100">
          <div className="mb-1 flex justify-between items-center">
            <span className="text-sm font-medium">Demand</span>
            <span className={`text-sm font-medium ${demandColor}`}>
              {demandLevel}
            </span>
          </div>

          <div className="h-2 w-full bg-slate-200 rounded-full">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${demandScore * 10}%` }}
            />
          </div>

          <div className="mt-2 text-xs text-slate-500">
            Based on search interest and inventory levels
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
