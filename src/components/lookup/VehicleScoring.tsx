
import React from 'react';
import { ConfidenceScore } from './scoring/ConfidenceScore';
import { BreakdownList } from './scoring/BreakdownList';
import { VehicleScoreInfo } from './scoring/VehicleScoreInfo';

export interface VehicleScoringProps {
  baseValue: number;
  valuationBreakdown: {
    factor: string;
    impact: number;
    description: string;
  }[];
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
        <BreakdownList 
          items={valuationBreakdown}
          baseValue={baseValue}
          comparableVehicles={comparableVehicles}
        />
      </div>
      
      <ConfidenceScore 
        score={confidenceScore}
        comparableVehicles={comparableVehicles}
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

