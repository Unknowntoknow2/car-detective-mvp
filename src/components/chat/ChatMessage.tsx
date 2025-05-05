
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { BrainCircuit } from 'lucide-react';
import { format } from 'date-fns';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === 'user';
  
  const formattedTime = timestamp 
    ? format(new Date(timestamp), 'h:mm a')
    : '';

  return (
    <div className={cn(
      "flex w-full gap-2 py-2",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src="/images/car-detective-avatar.png" alt="Car Detective" />
          <AvatarFallback className="bg-primary/10 text-primary">
            <BrainCircuit className="h-4 w-4" />
          </AvatarFallback>
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
          <p className="whitespace-pre-wrap text-sm">{content}</p>
        </div>
        
        {timestamp && (
          <span className="text-xs text-muted-foreground mt-1">
            {formattedTime}
          </span>
        )}
      </div>
      
      {isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-muted">
            {/* Get first letter of user's name if available, otherwise use 'U' */}
            {localStorage.getItem('userName') 
              ? localStorage.getItem('userName')?.charAt(0).toUpperCase() 
              : 'U'}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
