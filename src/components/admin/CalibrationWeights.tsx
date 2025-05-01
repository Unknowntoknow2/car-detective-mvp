
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface FactorWeight {
  factor: string;
  weight: number;
}

export const CalibrationWeights = () => {
  const [weights, setWeights] = useState<FactorWeight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCalibrationWeights = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('depreciation_calibration')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(1)
          .single();
          
        if (error) throw error;
        
        if (data && data.factor_weights) {
          // Convert the factor_weights object to an array of { factor, weight } objects
          const weightArray = Object.entries(data.factor_weights).map(([factor, weight]) => ({
            factor,
            weight: weight as number
          }));
          
          setWeights(weightArray);
        }
      } catch (err) {
        console.error('Error fetching calibration weights:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch calibration weights');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCalibrationWeights();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Calibration Weights</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-gray-500">Loading calibration weights...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || weights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Calibration Weights</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-sm text-gray-500">
            {error ? `Error: ${error}` : 'No calibration weights available'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Calibration Weights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {weights.map(({ factor, weight }) => (
            <div key={factor} className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium capitalize">{factor.replace('_', ' ')}</p>
              </div>
              <div className="w-1/2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${weight * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-16 text-right">
                <p className="text-sm">{(weight * 100).toFixed(1)}%</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
