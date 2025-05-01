
import React from 'react';
import { useCensus } from '@/hooks/useCensus';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, DollarSign } from 'lucide-react';

interface CensusIncomeTipProps {
  zip: string;
}

export const CensusIncomeTip: React.FC<CensusIncomeTipProps> = ({ zip }) => {
  const { data, isLoading, error } = useCensus(zip);
  
  const getIncomeImpact = (censusData: any): { percentage: number; description: string } => {
    if (!censusData?.data || !censusData.data.medianIncome) {
      return { percentage: 0, description: 'Income data unavailable' };
    }
    
    const medianIncome = censusData.data.medianIncome;
    
    // National median household income is around $70,000
    if (medianIncome > 120000) {
      return { 
        percentage: 3, 
        description: 'High-income area adds value' 
      };
    }
    else if (medianIncome > 90000) {
      return { 
        percentage: 2, 
        description: 'Above-average income area adds value' 
      };
    }
    else if (medianIncome < 50000) {
      return { 
        percentage: -1, 
        description: 'Below-average income area' 
      };
    }
    
    return { 
      percentage: 0, 
      description: 'Average income area' 
    };
  };
  
  const impact = data ? getIncomeImpact(data) : { percentage: 0, description: 'Processing income data' };

  if (isLoading) {
    return (
      <Card className="bg-primary-50 border border-primary-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <p className="text-sm text-primary-700">Analyzing income data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data || !data.data.medianIncome) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className={`${impact.percentage > 0 ? 'bg-green-50 border-green-200' : impact.percentage < 0 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'} border`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <DollarSign className={`h-5 w-5 ${impact.percentage > 0 ? 'text-green-600' : impact.percentage < 0 ? 'text-red-600' : 'text-gray-600'} mt-0.5`} />
          <div>
            <h4 className="text-sm font-medium">Local Market</h4>
            <p className="text-sm text-gray-700">
              Median Income: {formatCurrency(data.data.medianIncome)}
            </p>
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
