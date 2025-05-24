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
  const { year, make, model, trim, valuationDate, estimatedValue } = valuation;
  
  const formattedDate = valuationDate ? new Date(valuationDate).toLocaleDateString() : 'N/A';
  
  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold">
            {year} {make} {model} {trim}
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
            {formatCurrency(estimatedValue || 0)}
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
