
import React from 'react';
import { ValuationHeader } from './valuation-complete/ValuationHeader';
import { NextStepsCard } from './valuation-complete/NextStepsCard';
import { ChatBubble } from '@/components/chat/ChatBubble';
import { Valuation } from '@/types/valuation-history';

interface ValuationCompleteProps {
  valuation: Valuation;
}

export const ValuationComplete: React.FC<ValuationCompleteProps> = ({ valuation }) => {
  return (
    <div className="space-y-6">
      <ValuationHeader valuation={valuation} />
      <NextStepsCard valuationId={valuation.id} />
      
      {/* Instead of directly rendering a ChatBubble with missing props, 
          we'll render it with all required props */}
      <div className="mt-4">
        <ChatBubble 
          content={`Ask me about your ${valuation.year} ${valuation.make} ${valuation.model} valuation`}
          sender="assistant"
          timestamp={new Date()}
          valuationId={valuation.id}
          initialMessage="Tell me more about my valuation"
        />
      </div>
    </div>
  );
};
