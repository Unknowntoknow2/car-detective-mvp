
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ValuationData } from '@/types/unified';
import { formatCurrency } from '@/utils/formatters';

interface ComprehensiveValuationReportProps {
  valuationData: ValuationData;
  marketData?: {
    comparable?: any[];
    trends?: any;
  };
  auctionData?: any[];
}

export function ComprehensiveValuationReport({ 
  valuationData, 
  marketData,
  auctionData 
}: ComprehensiveValuationReportProps) {
  return (
    <div className="space-y-6">
      {/* Vehicle Overview Section */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Make</p>
              <p className="text-lg">{valuationData.vehicle.make}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Model</p>
              <p className="text-lg">{valuationData.vehicle.model}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Year</p>
              <p className="text-lg">{valuationData.vehicle.year}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Mileage</p>
              <p className="text-lg">{valuationData.vehicle.mileage.toLocaleString()} miles</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Condition</p>
              <Badge>{valuationData.vehicle.condition}</Badge>
            </div>
            {valuationData.vehicle.vin && (
              <div>
                <p className="text-sm font-medium text-gray-500">VIN</p>
                <p className="text-sm font-mono">{valuationData.vehicle.vin}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Valuation Summary Section */}
      <Card>
        <CardHeader>
          <CardTitle>Valuation Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(valuationData.estimatedValue)}
              </p>
              <p className="text-sm text-gray-500">Estimated Value</p>
            </div>
            {valuationData.priceRange && (
              <div className="text-center">
                <p className="text-lg font-semibold">
                  {formatCurrency(valuationData.priceRange[0])} - {formatCurrency(valuationData.priceRange[1])}
                </p>
                <p className="text-sm text-gray-500">Price Range</p>
              </div>
            )}
            <div className="text-center">
              <p className="text-lg font-semibold">{valuationData.confidenceScore}%</p>
              <p className="text-sm text-gray-500">Confidence Score</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Value Adjustments Section */}
      {valuationData.adjustments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Value Adjustments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {valuationData.adjustments.map((adjustment, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{adjustment.factor}</p>
                    <p className="text-sm text-gray-500">{adjustment.description}</p>
                  </div>
                  <div className={`text-right ${
                    adjustment.impact > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <p className="font-semibold">
                      {adjustment.impact > 0 ? '+' : ''}{formatCurrency(adjustment.impact)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Market Data Section */}
      {marketData && (
        <Card>
          <CardHeader>
            <CardTitle>Market Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Based on analysis of {marketData.comparable?.length || 0} comparable vehicles
            </p>
            {/* Add more market analysis here */}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
