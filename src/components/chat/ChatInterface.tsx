
import React, { useRef, useEffect, useState } from 'react';
import { useValuationChat, ChatMessage as ChatMessageType } from '@/hooks/useValuationChat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, MessageCircle, BrainCircuit } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface ChatInterfaceProps {
  valuationId?: string;
  className?: string;
  initialMessage?: string;
  onNewMessage?: () => void;
  title?: string;
}

export function ChatInterface({ 
  valuationId, 
  className, 
  initialMessage,
  onNewMessage,
  title = 'Car Detective Chat'
}: ChatInterfaceProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { messages, isLoading, error, sendMessage } = useValuationChat(valuationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([
    "Why is my car valued this way?",
    "How can I increase my car's value?",
    "What factors affect my valuation the most?",
    "Should I sell to a dealer or private party?"
  ]);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    // Notify parent component of new message
    if (messages.length > 0 && onNewMessage) {
      onNewMessage();
    }
  }, [messages, onNewMessage]);

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

  // Generate suggested questions based on last assistant message
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant') {
        // Use the last assistant message to potentially update suggested questions
        // This is a simplified version - in a real implementation, you could use
        // the content to dynamically generate contextual questions
        
        // For now, we'll just vary the suggestions based on message length as an example
        if (lastMessage.content.includes("value")) {
          setSuggestedQuestions([
            "What features add the most value?",
            "How does mileage affect my value?",
            "Why might dealers offer less?",
            "How accurate is this valuation?"
          ]);
        } else if (lastMessage.content.includes("dealer")) {
          setSuggestedQuestions([
            "How do I negotiate with dealers?",
            "Is selling private better than a dealer?",
            "What documents do I need when selling?",
            "Can you help me understand dealer fees?"
          ]);
        }
      }
    }
  }, [messages]);

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

  const handleAuthRedirect = () => {
    navigate('/auth');
  };

  if (!user) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <BrainCircuit className="h-5 w-5 mr-2 text-primary" />
            {title}
            <Badge variant="outline" className="ml-2 bg-primary/10 text-primary text-xs">AI Powered</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <BrainCircuit className="h-12 w-12 text-primary mb-4" />
            <p className="text-muted-foreground mb-4">
              Sign in to chat with Car Detective about your valuation
            </p>
            <Button onClick={handleAuthRedirect}>Sign In</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <BrainCircuit className="h-5 w-5 mr-2 text-primary" />
          {title}
          <Badge variant="outline" className="ml-2 bg-primary/10 text-primary text-xs">AI Powered</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[350px] p-4">
          {messages.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <BrainCircuit className="h-12 w-12 text-primary/20 mb-4" />
              <p className="text-muted-foreground mb-2">
                {valuationId 
                  ? "I'm your Car Detective assistant. How can I help with your valuation?" 
                  : "Complete a valuation to get personalized answers"}
              </p>
              <p className="text-xs text-muted-foreground">
                I can explain your valuation, offer advice on improving your car's value, or help with dealer negotiations.
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
                  <span className="text-sm text-muted-foreground">Car Detective is thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>
      </CardContent>
      
      {messages.length > 0 && !isLoading && (
        <div className="px-4 py-2 border-t border-gray-100">
          <p className="text-xs text-muted-foreground mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {suggestedQuestions.map((question, index) => (
              <Button 
                key={index} 
                variant="outline" 
                size="sm" 
                className="text-xs px-2 py-1 h-auto"
                onClick={() => handleSuggestedQuestion(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      <CardFooter className="p-0">
        <ChatInput
          onSend={sendMessage}
          isLoading={isLoading}
          disabled={!valuationId}
          placeholder={valuationId 
            ? "Ask Car Detective..." 
            : "Complete a valuation first..."}
        />
      </CardFooter>
    </Card>
  );
}
