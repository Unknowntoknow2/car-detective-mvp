// Update the import to use the correct Heading component
import { Heading } from "@/components/ui-kit/typography";
import { BodyS } from "@/components/ui-kit/typography";
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { useValuationResult } from '@/hooks/useValuationResult';

export const Header = () => {
  const { valuationResult, vehicle } = useValuationResult();
  
  if (!valuationResult || !vehicle) {
    return null;
  }
  
  const { 
    estimated_value, 
    confidence_score, 
    condition,
    value_range
  } = valuationResult;
  
  const { year, make, model, trim, vin } = vehicle;
  
  // Determine confidence level text and color
  const getConfidenceLevel = (score: number) => {
    if (score >= 85) return { text: 'High', color: 'text-green-600' };
    if (score >= 70) return { text: 'Medium', color: 'text-amber-600' };
    return { text: 'Low', color: 'text-red-600' };
  };
  
  const confidenceLevel = getConfidenceLevel(confidence_score);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Heading className="text-2xl font-bold mb-4">Vehicle Valuation</Heading>
      
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            {year} {make} {model} {trim}
          </h3>
          <p className="text-sm text-gray-500 mt-1">VIN: {vin}</p>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {condition} Condition
            </Badge>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className={`bg-opacity-10 ${confidenceLevel.color} border-current flex items-center gap-1`}>
                    <span>{confidenceLevel.text} Confidence</span>
                    <InfoIcon size={12} />
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm max-w-xs">
                    Confidence score: {confidence_score}%. This indicates how certain we are about this valuation based on available data.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-primary/5 p-4 rounded-lg text-center min-w-[200px]"
        >
          <BodyS className="text-muted-foreground mb-1">Estimated Value</BodyS>
          <div className="text-3xl font-bold text-primary">
            {formatCurrency(estimated_value)}
          </div>
          {value_range && (
            <BodyS className="text-muted-foreground mt-1">
              Range: {formatCurrency(value_range.min)} - {formatCurrency(value_range.max)}
            </BodyS>
          )}
        </motion.div>
      </div>
    </div>
  );
};
