import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ComprehensiveValuationReportProps {
  valuationData: any; // Replace 'any' with the actual type of your valuation data
}

export function ComprehensiveValuationReport({ valuationData }: ComprehensiveValuationReportProps) {
  return (
    <Card className="shadow-md rounded-md">
      <CardHeader>
        <CardTitle>Comprehensive Valuation Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Vehicle Overview Section */}
        <section>
          <h2 className="text-lg font-semibold">Vehicle Overview</h2>
          <p>Make: {valuationData?.vehicle?.make}</p>
          <p>Model: {valuationData?.vehicle?.model}</p>
          <p>Year: {valuationData?.vehicle?.year}</p>
          {/* Add more vehicle details here */}
        </section>

        {/* Valuation Summary Section */}
        <section>
          <h2 className="text-lg font-semibold">Valuation Summary</h2>
          <p>Estimated Value: {valuationData?.estimatedValue}</p>
          <p>Price Range: {valuationData?.priceRange?.min} - {valuationData?.priceRange?.max}</p>
          <p>Confidence: {valuationData?.confidence}</p>
          {/* Add more valuation details here */}
        </section>

        {/* Condition Assessment Section */}
        <section>
          <h2 className="text-lg font-semibold">Condition Assessment</h2>
          {/* Display condition factors and their impact */}
          {valuationData?.factors?.map((factor: any) => (
            <div key={factor.id}>
              <p>{factor.name}: {factor.value} (Impact: {factor.impact})</p>
              {/* Add more details about each factor */}
            </div>
          ))}
        </section>

        {/* Market Data Section */}
        <section>
          <h2 className="text-lg font-semibold">Market Data</h2>
          <p>Comparable Vehicles: {valuationData?.marketData?.comparable?.length}</p>
          {/* Display market trends and other relevant data */}
        </section>

        {/* Auction History Section */}
        {/* <AuctionHistorySection vin={valuationData?.vehicle?.vin} /> */}

        {/* Add more sections as needed */}
      </CardContent>
    </Card>
  );
}
