<<<<<<< HEAD

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Send, Loader2, MessageCircle, X } from 'lucide-react';
import { askAIN } from '@/services/ainService';
import { VehicleContext } from '@/types/assistant';
import { EnrichedVehicleData } from '@/enrichment/getEnrichedVehicleData';

interface ValuationData {
  id?: string;
  vin?: string;
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  mileage?: number;
  condition?: string;
  zipCode?: string;
  estimatedValue?: number;
  estimated_value?: number;
  zip?: string;
  created_at: string;
}

interface AIChatBubbleProps {
  valuation: ValuationData;
  enrichedData?: EnrichedVehicleData | null;
}

export const AIChatBubble: React.FC<AIChatBubbleProps> = ({ valuation, enrichedData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
=======
import React, { useEffect, useState } from "react";
import { ChatBubble } from "./ChatBubble";
import { Valuation } from "@/types/valuation-history";

interface AIChatBubbleProps {
  valuation?: Valuation | null;
  position?: "bottom-right" | "bottom-left";
}

export function AIChatBubble(
  { valuation, position = "bottom-right" }: AIChatBubbleProps,
) {
  const [initialMessage, setInitialMessage] = useState(
    "Tell me about my car's valuation",
  );

  // Generate a more specific initial message if we have valuation data
  useEffect(() => {
    if (valuation) {
      const year = valuation.year || "";
      const make = valuation.make || "";
      const model = valuation.model || "";

      if (year && make && model) {
        setInitialMessage(
          `Tell me about my ${year} ${make} ${model} valuation`,
        );
      }
    }
  }, [valuation]);
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

  const vehicleContext: VehicleContext = {
    make: valuation.make,
    model: valuation.model,
    year: valuation.year,
    trim: valuation.trim,
    mileage: valuation.mileage,
    condition: valuation.condition,
    vin: valuation.vin,
    zipCode: valuation.zipCode || valuation.zip,
    estimatedValue: valuation.estimatedValue || valuation.estimated_value,
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await askAIN(userMessage, vehicleContext, messages);
      
      if (response.error) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `I apologize, but I'm experiencing technical difficulties: ${response.error}. Please try again in a moment.`
        }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: response.answer }]);
      }
    } catch (error) {
      console.error('Error sending message to AIN:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startConversation = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      const welcomeMessage = enrichedData?.sources?.statVin 
        ? `Hello! I'm AIN, your automotive intelligence assistant. I have access to your vehicle's comprehensive history including auction records, damage reports, and title information. How can I help you understand your ${valuation.year} ${valuation.make} ${valuation.model}?`
        : `Hello! I'm AIN, your automotive intelligence assistant. I can help you understand your ${valuation.year} ${valuation.make} ${valuation.model} valuation, market conditions, and answer any automotive questions you have. How can I assist you today?`;
        
      setMessages([{ role: 'assistant', content: welcomeMessage }]);
    }
  };

  if (!isOpen) {
    return (
      <Card className="fixed bottom-6 right-6 w-80 shadow-lg border-2 border-primary/20 hover:border-primary/40 transition-all cursor-pointer z-50"
            onClick={startConversation}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Ask AIN Assistant</h3>
              <p className="text-xs text-muted-foreground">
                {enrichedData?.sources?.statVin 
                  ? "Get expert insights with auction & history data"
                  : "Get expert insights about your valuation"
                }
              </p>
            </div>
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
<<<<<<< HEAD
    <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-xl border-2 border-primary/20 flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <span className="font-semibold">AIN Assistant</span>
          {enrichedData?.sources?.statVin && (
            <span className="text-xs bg-primary-foreground/20 px-2 py-1 rounded">Premium</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="h-8 w-8 p-0 hover:bg-primary-foreground/10"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg text-sm ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted p-3 rounded-lg flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">AIN is thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={enrichedData?.sources?.statVin 
              ? "Ask about auction history, damage records, or market value..."
              : "Ask about your valuation, market conditions, or automotive advice..."
            }
            className="flex-1 min-h-[40px] max-h-[100px] resize-none"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            size="sm"
            className="px-3"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
=======
    <ChatBubble
      valuationId={valuation.id}
      initialMessage={initialMessage}
      position={position}
      title="Ask about your valuation"
    />
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  );
};
