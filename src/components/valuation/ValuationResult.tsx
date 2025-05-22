
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { ValuationEmptyState } from './ValuationEmptyState';
import { useAuth } from '@/hooks/useAuth';

interface ValuationResultProps {
  data?: any;
  isPremium?: boolean;
  isLoading?: boolean;
  error?: string;
  valuationId?: string;
}

export function ValuationResult({
  data,
  isPremium = false,
  isLoading = false,
  error,
  valuationId
}: ValuationResultProps) {
  const { user } = useAuth();
  
  // If no data provided, render placeholder
  if (!data) {
    return (
      <ValuationEmptyState 
        message="No valuation data available. Please try a different search method or vehicle."
        actionLabel="Try Again"
      />
    );
  }
  
  // Get values from data or use defaults
  const {
    make = 'Unknown',
    model = 'Unknown',
    year = new Date().getFullYear(),
    mileage = 0,
    condition = 'Good',
    estimatedValue = 0,
    confidenceScore = 0,
    conditionScore = 0,
    fuelType,
    transmission
  } = data;
  
  return (
    <div className="space-y-6">
      {/* Header with vehicle info and estimated value */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold">
            {year} {make} {model}
          </h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {mileage > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {mileage.toLocaleString()} miles
              </span>
            )}
            {condition && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {condition}
              </span>
            )}
            {fuelType && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {fuelType}
              </span>
            )}
            {transmission && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {transmission}
              </span>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-500 mb-1">Estimated Value</p>
          <p className="text-3xl font-bold text-primary">
            {formatCurrency(estimatedValue)}
          </p>
        </div>
      </div>
      
      {/* Confidence and condition scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Confidence Score</h3>
              <span className="text-lg font-semibold">{confidenceScore}%</span>
            </div>
            <div className="mt-2 bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-primary rounded-full h-2.5" 
                style={{ width: `${confidenceScore}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              How certain we are about this valuation based on available data
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Condition Score</h3>
              <span className="text-lg font-semibold">{conditionScore}%</span>
            </div>
            <div className="mt-2 bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-500 rounded-full h-2.5" 
                style={{ width: `${conditionScore}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Vehicle condition rating based on age, mileage, and reported condition
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {isPremium ? (
          <Button className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            Download Full Report
          </Button>
        ) : (
          <Button className="flex-1 bg-amber-600 hover:bg-amber-700 text-white">
            <ExternalLink className="mr-2 h-4 w-4" />
            Get Premium Report
          </Button>
        )}
        
        {user && (
          <Button variant="outline" className="flex-1">
            Save Valuation
          </Button>
        )}
      </div>
    </div>
  );
}

export default ValuationResult;
