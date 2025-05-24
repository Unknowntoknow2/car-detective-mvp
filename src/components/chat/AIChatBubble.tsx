
import React, { useState, useEffect } from 'react';
import { ChatBubble } from './ChatBubble';
import { Valuation } from '@/types/valuation-history';

interface AIChatBubbleProps {
  valuation?: Valuation | null;
  position?: 'bottom-right' | 'bottom-left';
}

export function AIChatBubble({ valuation, position = 'bottom-right' }: AIChatBubbleProps) {
  const [content, setContent] = useState("Tell me about my car's valuation");
  
  // Generate a more specific initial message if we have valuation data
  useEffect(() => {
    if (valuation) {
      const year = valuation.year || '';
      const make = valuation.make || '';
      const model = valuation.model || '';
      
      if (year && make && model) {
        setContent(`Tell me about my ${year} ${make} ${model} valuation`);
      }
    }
  }, [valuation]);

  if (!valuation) return null;

  return (
    <ChatBubble 
      content={content}
      sender="assistant"
      timestamp={new Date()}
      position={position}
      title="Ask about your valuation"
      valuationId={valuation.id}
    />
  );
}
