
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';

interface AIChatBubbleProps {
  message?: string;
}

export const AIChatBubble: React.FC<AIChatBubbleProps> = ({ 
  message = "Hello! I'm here to help you with your vehicle valuation." 
}) => {
  return (
    <Card className="max-w-md">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <MessageCircle className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-700">{message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
