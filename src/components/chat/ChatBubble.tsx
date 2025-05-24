
import React from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ChatBubbleProps {
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ content, sender, timestamp }) => {
  const isUser = sender === 'user';
  
  return (
    <div className={cn(
      "flex w-full",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] rounded-lg p-3",
        isUser 
          ? "bg-primary text-primary-foreground" 
          : "bg-muted"
      )}>
        <p className="break-words">{content}</p>
        <div className={cn(
          "text-xs mt-1",
          isUser ? "text-primary-foreground/80" : "text-muted-foreground"
        )}>
          {format(timestamp, 'h:mm a')}
        </div>
      </div>
    </div>
  );
};
