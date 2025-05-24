
import React from 'react';
import { ChatBubble } from '@/components/chat/ChatBubble';
import { Valuation } from '@/types/valuation-history';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { CalendarIcon, CarIcon, InfoIcon } from 'lucide-react';

interface ValuationHeaderProps {
  valuation: Valuation;
}

export const ValuationHeader: React.FC<ValuationHeaderProps> = ({ valuation }) => {
  const { year, make, model } = valuation;
  // Use optional chaining for properties that might not exist
  const trimValue = valuation.trim?.toString() || '';  // Safely access trim which might not exist in type
  const formattedDate = valuation.created_at ? new Date(valuation.created_at).toLocaleDateString() : 'N/A';
  const estimatedValue = valuation.estimated_value || 0;
  
  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold">
            {year} {make} {model} {trimValue}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <CarIcon className="h-3 w-3" />
              <span>{year}</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <CalendarIcon className="h-3 w-3" />
              <span>Valued on {formattedDate}</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <InfoIcon className="h-3 w-3" />
              <span>VIN: {valuation.vin || 'Not provided'}</span>
            </Badge>
          </div>
        </div>
        
        <div className="bg-primary/10 p-3 rounded-lg">
          <div className="text-sm text-muted-foreground">Estimated Value</div>
          <div className="text-2xl font-bold text-primary">
            {formatCurrency(estimatedValue)}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <ChatBubble 
          content="Ask me about your valuation"
          sender="assistant"
          timestamp={new Date()}
          valuationId={valuation.id}
        />
      </div>
    </div>
  );
};
