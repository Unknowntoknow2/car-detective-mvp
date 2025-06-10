
import React from "react";
import { AuctionHistorySection } from "./AuctionHistorySection";
import { MarketplaceDataSection } from "./MarketplaceDataSection";
import { IndustryLeaderDataSection } from "./IndustryLeaderDataSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ComprehensiveValuationReportProps {
  vehicleData: {
    vin: string;
    make: string;
    model: string;
    year: number;
    estimatedValue: number;
    zipCode?: string;
  };
}

export function ComprehensiveValuationReport({ vehicleData }: ComprehensiveValuationReportProps) {
  const { vin, make, model, year, estimatedValue, zipCode = "90210" } = vehicleData;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Comprehensive Market Analysis</CardTitle>
          <p className="text-muted-foreground">
            Complete market data for {year} {make} {model}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-primary">${estimatedValue.toLocaleString()}</h3>
              <p className="text-sm text-muted-foreground">Our Estimate</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-green-600">Live Data</h3>
              <p className="text-sm text-muted-foreground">Real-time Market</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-blue-600">Multi-Source</h3>
              <p className="text-sm text-muted-foreground">Complete Coverage</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AuctionHistorySection vin={vin} />
        <MarketplaceDataSection 
          make={make} 
          model={model} 
          year={year} 
          zipCode={zipCode} 
        />
      </div>

      <IndustryLeaderDataSection 
        vin={vin}
        make={make}
        model={model}
        year={year.toString()}
        estimatedValue={estimatedValue}
      />
    </div>
  );
}
