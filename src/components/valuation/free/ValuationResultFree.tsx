import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share, Download, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { supabase } from '@/utils/supabaseClient';

interface ValuationResultFreeProps {
  valuationData: any;
  valuationId: string | null;
}

export function ValuationResultFree({ valuationData, valuationId }: ValuationResultFreeProps) {
  const [makeDisplay, setMakeDisplay] = useState<string>('');
  const [modelDisplay, setModelDisplay] = useState<string>('');
  
  // Fetch make and model names if we have a valuation ID
  useEffect(() => {
    async function fetchVehicleDetails() {
      if (!valuationId) return;
      
      try {
        const { data, error } = await supabase
          .from('valuations')
          .select('make, model, year')
          .eq('id', valuationId)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setMakeDisplay(data.make);
          setModelDisplay(data.model);
        }
      } catch (err) {
        console.error('Error fetching valuation details:', err);
      }
    }
    
    fetchVehicleDetails();
  }, [valuationId]);
  
  if (!valuationData) return null;
  
  const { finalValue, baseValue, confidenceScore, priceRange } = valuationData;
  
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-medium text-primary">Estimated Value</h3>
        <div className="mt-2 flex items-baseline">
          <span className="text-4xl font-bold text-primary">
            {formatCurrency(finalValue)}
          </span>
          <span className="ml-2 text-sm text-muted-foreground">
            {confidenceScore >= 80 ? 'High confidence' : 
             confidenceScore >= 60 ? 'Medium confidence' : 'Low confidence'}
          </span>
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>Value Range:</span>
            <span>{formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Base Value:</span>
            <span>{formatCurrency(baseValue)}</span>
          </div>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Vehicle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Make:</span>
              <span>{makeDisplay}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Model:</span>
              <span>{modelDisplay}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Year:</span>
              <span>{valuationData.year}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Mileage:</span>
              <span>{valuationData.mileage.toLocaleString()} miles</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Condition:</span>
              <span className="capitalize">{valuationData.condition}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" className="flex-1 gap-2">
          <Share className="h-4 w-4" />
          Share Result
        </Button>
        <Button variant="outline" className="flex-1 gap-2">
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
        <Button className="flex-1 gap-2">
          Get Premium Report
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default ValuationResultFree;
