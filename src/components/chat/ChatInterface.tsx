import React, { useRef, useEffect, useState } from 'react';
import { useValuationChat, ChatMessage as ChatMessageType } from '@/hooks/useValuationChat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, MessageCircle, BrainCircuit, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const { messages, isLoading, error, sendMessage, regenerateLastResponse } = useValuationChat(valuationId);
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
        } else if (lastMessage.content.includes("condition")) {
          setSuggestedQuestions([
            "What improvements would help my value?",
            "How much would fixing scratches help?",
            "Does detailing increase value?",
            "How do you assess car condition?"
          ]);
        }
      }
    }
  }, [messages]);

  // Generate dealer-specific suggested questions if in dealer context
  useEffect(() => {
    if (userRole === 'dealer' && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant') {
        if (lastMessage.content.includes("inventory") || lastMessage.content.includes("vehicle")) {
          setSuggestedQuestions([
            "Which ZIP codes bring highest margins?",
            "How many high-confidence vehicles submitted this week?",
            "Show me undervalued vehicles",
            "What's my top performing make/model?"
          ]);
        } else if (lastMessage.content.includes("lead") || lastMessage.content.includes("customer")) {
          setSuggestedQuestions([
            "How many active leads do I have?",
            "Which leads are most likely to convert?",
            "Show me leads from premium users",
            "What's my lead response time?"
          ]);
        } else if (lastMessage.content.includes("trend") || lastMessage.content.includes("market")) {
          setSuggestedQuestions([
            "What are the price trends for SUVs?",
            "Which models are selling fastest?",
            "Show me market analysis for my area",
            "What vehicles should I focus on acquiring?"
          ]);
        }
      }
    }
  }, [messages, userRole]);

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

  const handleAuthRedirect = () => {
    navigate('/auth');
  };

  const handleFeedback = (isPositive: boolean) => {
    if (messages.length > 0) {
      // In a real implementation, this would save the feedback to the database
      toast.success(isPositive 
        ? "Thanks for your positive feedback!" 
        : "Thanks for your feedback. We'll improve our responses.");
      
      // Here you would also log analytics about which types of responses get positive/negative feedback
    }
  };

  const handleRegenerateResponse = () => {
    if (regenerateLastResponse) {
      regenerateLastResponse();
    }
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
                <div key={msg.id || index} className="group">
                  <ChatMessage
                    role={msg.role}
                    content={msg.content}
                    timestamp={msg.created_at}
                  />
                  {msg.role === 'assistant' && (
                    <div className="flex justify-end mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-6 w-6"
                        onClick={() => handleFeedback(true)}
                      >
                        <ThumbsUp className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-6 w-6"
                        onClick={() => handleFeedback(false)}
                      >
                        <ThumbsDown className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
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
          onRegenerateResponse={handleRegenerateResponse}
          showRegenerate={messages.length > 0 && messages[messages.length - 1].role === 'assistant'}
        />
      </CardFooter>
    </Card>
  );
}
