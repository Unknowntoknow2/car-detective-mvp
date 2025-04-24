
import React from 'react';
import { VehicleScoreInfo } from './scoring/VehicleScoreInfo';
import { ValuationBreakdown, ValuationBreakdownItem } from './scoring/ValuationBreakdown';

export interface VehicleScoringProps {
  baseValue: number;
  valuationBreakdown: ValuationBreakdownItem[];
  confidenceScore: number;
  estimatedValue: number;
  comparableVehicles: number;
}

export const VehicleScoring = ({ 
  baseValue,
  valuationBreakdown,
  confidenceScore,
  estimatedValue,
  comparableVehicles
}: VehicleScoringProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <VehicleScoreInfo 
          label="Estimated Value"
          value={estimatedValue}
          tooltipContent={
            <div>
              <p className="font-medium mb-1">Base Value: ${baseValue.toLocaleString()}</p>
              <p className="text-sm mb-2">Adjustments based on:</p>
              <ul className="text-sm list-disc pl-4">
                {valuationBreakdown.map((item, idx) => (
                  <li key={idx}>{item.factor}: {item.impact > 0 ? '+' : ''}{item.impact}%</li>
                ))}
              </ul>
            </div>
          }
        />
        <ValuationBreakdown 
          valuationBreakdown={valuationBreakdown}
          baseValue={baseValue}
          comparableVehicles={comparableVehicles}
        />
      </div>
      
      <VehicleScoreInfo 
        label="Confidence Score"
        value={`${confidenceScore}%`}
        tooltipContent={
          <div>
            <p className="font-medium mb-1">Data Confidence Rating</p>
            <p className="text-sm">Based on {comparableVehicles} comparable vehicles in your area.</p>
            <ul className="text-sm list-disc pl-4 mt-2">
              <li>Market sample size</li>
              <li>Data completeness</li>
              <li>Regional price accuracy</li>
            </ul>
          </div>
        }
      />
      
      <VehicleScoreInfo 
        label="Market Analysis"
        value={`${comparableVehicles} Comparables`}
        tooltipContent={
          <div>
            <p className="font-medium mb-1">Market Data Analysis</p>
            <p className="text-sm">Based on real sales data from {comparableVehicles} similar vehicles sold in your region in the last 30 days.</p>
          </div>
        }
      />
    </div>
  );
};
