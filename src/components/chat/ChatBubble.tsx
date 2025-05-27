
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, User, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatBubbleProps {
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  position?: 'bottom-right' | 'bottom-left';
  title?: string;
  valuationId?: string;
  initialMessage?: string;
  onClick?: () => void;
}

export function ChatBubble({
  content,
  sender,
  timestamp,
  position = 'bottom-right',
  title,
  valuationId,
  initialMessage,
  onClick
}: ChatBubbleProps) {
  const isAssistant = sender === 'assistant';
  
  return (
    <div className={cn(
      "flex items-start gap-2 mb-4",
      isAssistant ? "justify-start" : "justify-end"
    )}>
      {isAssistant && (
        <div className="flex-shrink-0">
          <Bot className="h-6 w-6 text-primary mt-1" />
        </div>
      )}
      
      <Card className={cn(
        "max-w-[80%] shadow-sm",
        isAssistant ? "bg-muted" : "bg-primary text-primary-foreground"
      )}>
        <CardContent className="p-3">
          {title && (
            <div className="font-medium text-sm mb-1">{title}</div>
          )}
          <div className="text-sm">{content}</div>
          {onClick && (
            <Button
              variant={isAssistant ? "outline" : "secondary"}
              size="sm"
              onClick={onClick}
              className="mt-2 text-xs"
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              Ask Question
            </Button>
          )}
          <div className="text-xs opacity-70 mt-1">
            {timestamp.toLocaleTimeString()}
          </div>
        </CardContent>
      </Card>
      
      {!isAssistant && (
        <div className="flex-shrink-0">
          <User className="h-6 w-6 text-muted-foreground mt-1" />
        </div>
      )}
    </div>
  );
}
