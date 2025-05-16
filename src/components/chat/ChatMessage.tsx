
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { BrainCircuit } from 'lucide-react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
  isPremiumContent?: boolean;
  suggestedQuestions?: string[];
  onSuggestedQuestionClick?: (question: string) => void;
}

export function ChatMessage({ 
  role, 
  content, 
  timestamp, 
  isPremiumContent,
  suggestedQuestions,
  onSuggestedQuestionClick
}: ChatMessageProps) {
  const isUser = role === 'user';
  // System messages are styled like assistant messages
  const isSystem = role === 'system';
  
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
            : isSystem
              ? "bg-muted/80 border border-muted-foreground/10 rounded-tl-none"
              : "bg-muted rounded-tl-none"
        )}>
          {isUser ? (
            <p className="whitespace-pre-wrap text-sm">{content}</p>
          ) : (
            <ReactMarkdown 
              className="whitespace-pre-wrap text-sm prose prose-sm dark:prose-invert max-w-none"
            >
              {content}
            </ReactMarkdown>
          )}
          
          {isPremiumContent && !isUser && (
            <div className="text-xs mt-2 text-yellow-600 dark:text-yellow-400 italic">
              🔒 Premium required to access this insight.
            </div>
          )}
        </div>
        
        {timestamp && (
          <span className="text-xs text-muted-foreground mt-1">
            {formattedTime}
          </span>
        )}
        
        {!isUser && suggestedQuestions && suggestedQuestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                className="text-xs bg-primary/10 hover:bg-primary/20 text-primary rounded-full px-3 py-1 transition-colors"
                onClick={() => onSuggestedQuestionClick?.(question)}
              >
                {question}
              </button>
            ))}
          </div>
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
