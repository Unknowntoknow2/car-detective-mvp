
import React from 'react';
import { useEpaMpg } from '@/hooks/useEpaMpg';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Droplets } from 'lucide-react';

interface EpaMpgTipProps {
  year: number;
  make: string;
  model: string;
}

export const EpaMpgTip: React.FC<EpaMpgTipProps> = ({ year, make, model }) => {
  const { data, isLoading, error } = useEpaMpg(year, make, model);
  
  const getCombinedMpg = () => {
    if (!data?.data) return null;
    
    // Extract MPG value from text (assuming format: "X MPG combined...")
    const mpgMatch = data.data.text.match(/(\d+)\s+MPG\s+combined/i);
    return mpgMatch ? parseInt(mpgMatch[1], 10) : null;
  };
  
  const combinedMpg = getCombinedMpg();
  
  const getPriceImpact = (mpg: number | null): { percentage: number; description: string } => {
    if (mpg === null) return { percentage: 0, description: 'No impact' };
    
    if (mpg >= 30) {
      return { 
        percentage: 3, 
        description: 'High fuel efficiency adds value' 
      };
    } 
    else if (mpg < 20) {
      return { 
        percentage: -3, 
        description: 'Low fuel efficiency reduces value' 
      };
    }
    
    return { percentage: 0, description: 'Average fuel efficiency' };
  };
  
  const impact = getPriceImpact(combinedMpg);

  if (isLoading) {
    return (
      <Card className="bg-primary-50 border border-primary-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <p className="text-sm text-primary-700">Loading fuel economy data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return null;
  }

  return (
    <Card className={`${impact.percentage > 0 ? 'bg-green-50 border-green-200' : impact.percentage < 0 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'} border`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Droplets className={`h-5 w-5 ${impact.percentage > 0 ? 'text-green-600' : impact.percentage < 0 ? 'text-red-600' : 'text-gray-600'} mt-0.5`} />
          <div>
            <h4 className="text-sm font-medium">Fuel Economy</h4>
            {combinedMpg ? (
              <>
                <p className="text-sm text-gray-700">Combined MPG: {combinedMpg}</p>
                <p className="text-xs mt-1 font-medium">
                  {impact.percentage > 0 ? (
                    <span className="text-green-600">+{impact.percentage}% value adjustment</span>
                  ) : impact.percentage < 0 ? (
                    <span className="text-red-600">{impact.percentage}% value adjustment</span>
                  ) : (
                    <span className="text-gray-600">No value adjustment</span>
                  )}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">{impact.description}</p>
              </>
            ) : (
              <p className="text-sm text-gray-700">MPG data unavailable</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
