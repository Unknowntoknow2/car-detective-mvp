
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UnifiedValuationHeader } from './header/UnifiedValuationHeader';
import { supabase } from '@/utils/supabaseClient';
import { formatCurrency } from '@/utils/formatters';

interface UnifiedValuationResultProps {
  valuationId?: string;
  displayMode?: 'simple' | 'detailed' | 'full';
  estimatedValue?: number;
  confidenceScore?: number;
  priceRange?: [number, number];
  adjustments?: {
    factor: string;
    impact: number;
    description: string;
  }[];
  onDownloadPdf?: () => void;
  onEmailReport?: () => void;
  vehicleInfo?: {
    year: number;
    make: string;
    model: string;
    mileage?: number;
    condition?: string;
    vin?: string;
  };
}

export function UnifiedValuationResult({ 
  valuationId,
  displayMode = 'detailed',
  estimatedValue,
  confidenceScore,
  priceRange,
  adjustments,
  onDownloadPdf,
  onEmailReport,
  vehicleInfo
}: UnifiedValuationResultProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [valuationData, setValuationData] = useState<any | null>(null);
  
  useEffect(() => {
    async function fetchValuationData() {
      // If direct props are provided, use them instead of fetching
      if (estimatedValue && vehicleInfo) {
        setValuationData({
          estimated_value: estimatedValue,
          confidence_score: confidenceScore || 85,
          year: vehicleInfo.year,
          make: vehicleInfo.make,
          model: vehicleInfo.model,
          mileage: vehicleInfo.mileage,
          condition: vehicleInfo.condition,
          vin: vehicleInfo.vin,
          price_range: priceRange
        });
        setIsLoading(false);
        return;
      }
      
      if (!valuationId) {
        // Try to get from localStorage
        const storedId = localStorage.getItem('latest_valuation_id');
        if (storedId) {
          console.log('Using valuation ID from localStorage:', storedId);
          fetchData(storedId);
        } else {
          setError('No valuation ID found');
          setIsLoading(false);
        }
        return;
      }
      
      fetchData(valuationId);
    }
    
    async function fetchData(id: string) {
      try {
        setIsLoading(true);
        
        // Fetch from supabase
        const { data, error } = await supabase
          .from('valuations')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          console.log('Valuation data loaded:', data);
          setValuationData(data);
        } else {
          setError('Valuation not found');
        }
      } catch (err: any) {
        console.error('Error fetching valuation:', err);
        setError(err.message || 'Failed to load valuation data');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchValuationData();
  }, [valuationId, estimatedValue, confidenceScore, vehicleInfo, priceRange]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading valuation data...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  if (!valuationData) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Data</AlertTitle>
        <AlertDescription>
          No valuation data is available. Please try a different valuation ID or create a new valuation.
        </AlertDescription>
      </Alert>
    );
  }
  
  // Default or mock data if we don't have the actual values
  const priceRangeToDisplay = valuationData.price_range || priceRange || [
    valuationData.estimated_value * 0.9,
    valuationData.estimated_value * 1.1
  ];
  
  return (
    <div className="valuation-result space-y-6">
      <UnifiedValuationHeader
        year={valuationData.year}
        make={valuationData.make}
        model={valuationData.model}
        valuation={valuationData.estimated_value}
        confidenceScore={valuationData.confidence_score}
        condition={valuationData.condition}
        location={valuationData.state || valuationData.zip}
        mileage={valuationData.mileage}
        onDownloadPdf={onDownloadPdf}
        onShareReport={onEmailReport}
      />
      
      {displayMode !== 'simple' && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Price Range</h3>
                <div className="flex justify-between items-center mt-2">
                  <span>{formatCurrency(priceRangeToDisplay[0])}</span>
                  <div className="h-2 bg-primary/20 rounded-full flex-1 mx-4">
                    <div 
                      className="h-2 bg-primary rounded-full" 
                      style={{ width: '50%' }}
                    ></div>
                  </div>
                  <span>{formatCurrency(priceRangeToDisplay[1])}</span>
                </div>
              </div>
              
              {valuationData.base_price && (
                <div>
                  <h3 className="text-sm font-medium">Base Value</h3>
                  <p className="text-lg">{formatCurrency(valuationData.base_price)}</p>
                </div>
              )}
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-2">Vehicle Details</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Year</p>
                    <p>{valuationData.year}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Make</p>
                    <p>{valuationData.make}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Model</p>
                    <p>{valuationData.model}</p>
                  </div>
                  {valuationData.mileage && (
                    <div>
                      <p className="text-sm text-muted-foreground">Mileage</p>
                      <p>{valuationData.mileage.toLocaleString()} miles</p>
                    </div>
                  )}
                  {valuationData.condition && (
                    <div>
                      <p className="text-sm text-muted-foreground">Condition</p>
                      <p className="capitalize">{valuationData.condition}</p>
                    </div>
                  )}
                  {valuationData.vin && (
                    <div>
                      <p className="text-sm text-muted-foreground">VIN</p>
                      <p className="font-mono text-sm">{valuationData.vin}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default UnifiedValuationResult;
