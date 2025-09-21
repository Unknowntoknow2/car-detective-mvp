
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVehicleData } from "@/hooks/useVehicleData";
import { BarChart, RefreshCw } from "lucide-react";

export const VehicleDataInfo = () => {
  const { getYearOptions, getCurrentYear } = useVehicleData();

  const handleRefreshData = () => {
  };

  const currentYear = getCurrentYear();
  const yearOptions = getYearOptions(2000);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5" />
          Vehicle Data Information
        </CardTitle>
        <CardDescription>
          Current vehicle data statistics and options
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h4 className="font-medium">Current Year</h4>
            <p className="text-lg font-semibold">{currentYear}</p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Available Years</h4>
            <p className="text-lg font-semibold">{yearOptions.length} years</p>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button 
            onClick={handleRefreshData} 
            variant="outline" 
            className="w-full"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleDataInfo;
