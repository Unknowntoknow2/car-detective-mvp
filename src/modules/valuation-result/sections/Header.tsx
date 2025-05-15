
import { Heading, BodyS } from "@/components/ui-kit/typography";
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface HeaderProps {
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  condition?: string;
  estimatedValue?: number;
  isPremium?: boolean;
  additionalInfo?: Record<string, string>;
}

export const Header: React.FC<HeaderProps> = ({ 
  make = '', 
  model = '', 
  year = 0, 
  mileage = 0, 
  condition = 'Good', 
  estimatedValue = 0,
  isPremium = false,
  additionalInfo = {}
}) => {
  // Determine confidence level text and color based on premium status
  const confidenceLevel = isPremium 
    ? { text: 'High', color: 'text-green-600' }
    : { text: 'Medium', color: 'text-amber-600' };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Heading className="text-2xl font-bold mb-4">Vehicle Valuation</Heading>
      
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            {year} {make} {model}
          </h3>
          {mileage > 0 && (
            <p className="text-sm text-gray-500 mt-1">Mileage: {mileage.toLocaleString()} miles</p>
          )}
          
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
                    This indicates how certain we are about this valuation based on available data.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Display additional info badges */}
            {Object.entries(additionalInfo).map(([key, value]) => (
              <Badge key={key} variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                {value}
              </Badge>
            ))}
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
            {formatCurrency(estimatedValue)}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Header;
