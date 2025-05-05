
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === 'user';
  const formattedTime = timestamp 
    ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    : '';

  return (
    <div className={cn(
      "flex w-full gap-2 py-2",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="/images/car-detective-avatar.png" alt="Car Detective" />
          <AvatarFallback className="bg-primary text-white">CD</AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        "flex flex-col max-w-[80%] sm:max-w-[70%]",
        isUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "px-4 py-2.5 rounded-xl",
          isUser 
            ? "bg-primary text-primary-foreground rounded-tr-none" 
            : "bg-muted rounded-tl-none"
        )}>
          <p className="whitespace-pre-wrap">{content}</p>
        </div>
        
        {timestamp && (
          <span className="text-xs text-muted-foreground mt-1">
            {formattedTime}
          </span>
        )}
      </div>
      
      {isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-muted">U</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
