
import React, { useRef, useEffect } from 'react';
import { useValuationChat, ChatMessage as ChatMessageType } from '@/hooks/useValuationChat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface ChatInterfaceProps {
  valuationId?: string;
  className?: string;
  initialMessage?: string;
}

export function ChatInterface({ valuationId, className, initialMessage }: ChatInterfaceProps) {
  const { user } = useAuth();
  const { messages, isLoading, error, sendMessage } = useValuationChat(valuationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Display welcome message
  useEffect(() => {
    if (initialMessage && messages.length === 0 && !isLoading) {
      // Add a small delay for UX
      const timer = setTimeout(() => {
        sendMessage(initialMessage);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [initialMessage, messages.length, isLoading, sendMessage]);

  if (!user) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            Car Detective Chat
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-muted-foreground mb-4">
              Sign in to chat with Car Detective about your valuation
            </p>
            <Button>Sign In</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <MessageCircle className="h-5 w-5 mr-2" />
          Car Detective Chat
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[350px] p-4">
          {messages.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <p className="text-muted-foreground mb-2">
                {valuationId 
                  ? "Ask questions about your car's valuation" 
                  : "Complete a valuation to get personalized answers"}
              </p>
              <p className="text-xs text-muted-foreground">
                Examples: "Why is my car valued this way?" or "How can I increase my car's value?"
              </p>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              {messages.map((msg: ChatMessageType, index: number) => (
                <ChatMessage
                  key={msg.id || index}
                  role={msg.role}
                  content={msg.content}
                  timestamp={msg.created_at}
                />
              ))}
              {isLoading && (
                <div className="flex items-center px-4 py-2">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-sm text-muted-foreground">Car Detective is typing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="p-0">
        <ChatInput
          onSend={sendMessage}
          isLoading={isLoading}
          disabled={!valuationId}
          placeholder={valuationId 
            ? "Ask about your valuation..." 
            : "Complete a valuation first..."}
        />
      </CardFooter>
    </Card>
  );
}
