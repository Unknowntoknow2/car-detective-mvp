
import React from "react";
import { TabContentWrapper } from "./TabContentWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Download } from "lucide-react";

interface TwelveMonthForecastTabProps {
  vehicle?: any;
}

export function TwelveMonthForecastTab({ vehicle }: TwelveMonthForecastTabProps) {
  const downloadForecast = () => {
    console.log("Downloading 12-month forecast for vehicle:", vehicle);
  };

  return (
    <TabContentWrapper
      title="12-Month Value Forecast"
      description="Projected value changes over the next year"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Value Projection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  12-month forecast data will be displayed here.
                </p>
              </div>
              
              <div className="flex justify-center">
                <Button className="gap-2" onClick={downloadForecast}>
                  <Download className="h-4 w-4" />
                  Download Forecast Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TabContentWrapper>
  );
}
