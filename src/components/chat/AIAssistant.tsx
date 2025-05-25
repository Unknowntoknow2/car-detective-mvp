
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, RefreshCcw, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { askAI } from '@/api/askAI';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface AIAssistantProps {
  onClose: () => void;
  valuationId?: string;
  isPremium?: boolean;
}

const getErrorMessage = (error: unknown): { message: string; isRetryable: boolean } => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  if (errorMessage.includes('401') || errorMessage.includes('authentication')) {
    return { message: 'Authentication failed. Please check your API key.', isRetryable: false };
  }
  
  if (errorMessage.includes('429')) {
    return { message: 'Too many requests. Please wait a moment and try again.', isRetryable: true };
  }
  
  if (errorMessage.includes('500') || errorMessage.includes('Internal Server Error')) {
    return { message: 'Server error occurred. Please try again.', isRetryable: true };
  }
  
  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return { message: 'Network connection issue. Please check your connection.', isRetryable: true };
  }
  
  return { message: 'Something went wrong. Please try again.', isRetryable: true };
};

export const AIAssistant: React.FC<AIAssistantProps> = ({ 
  onClose, 
  valuationId,
  isPremium = false 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: valuationId 
        ? 'Hi! I can help you understand this valuation result, explain pricing factors, or answer questions about your vehicle\'s market value. What would you like to know?'
        : 'Hi! I\'m AIN — your Auto Intelligence Network assistant. I can help you with vehicle valuations, market trends, and pricing insights. What would you like to know?',
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string; isRetryable: boolean } | null>(null);
  const [retryPayload, setRetryPayload] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (messageContent?: string) => {
    const currentInput = messageContent || inputValue;
    if (!currentInput.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: currentInput,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    if (!messageContent) {
      setInputValue('');
    }
    setIsLoading(true);
    setError(null);
    setRetryPayload(currentInput);

    try {
      console.log('🤖 Sending message to AI:', currentInput);
      
      const response = await askAI({
        question: currentInput,
        userContext: {
          isPremium,
          hasDealerAccess: false,
          ...(valuationId && { valuationId })
        },
        chatHistory: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      });

      console.log('🤖 AI response received:', response);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.answer || 'Sorry, I couldn\'t generate a response.',
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setRetryPayload(null);
    } catch (error) {
      console.error('❌ Error sending message:', error);
      const errorInfo = getErrorMessage(error);
      setError(errorInfo);
      
      // Don't show toast for retryable errors since we have inline retry
      if (!errorInfo.isRetryable) {
        toast.error(errorInfo.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (retryPayload) {
      sendMessage(retryPayload);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
        <div className="space-y-4 py-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-muted-foreground">AIN is thinking...</span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-start">
              <div className="bg-red-50 border border-red-200 p-3 rounded-lg max-w-[80%]">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-red-700">{error.message}</p>
                    {error.isRetryable && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRetry}
                        disabled={isLoading}
                        className="mt-2 h-7 text-xs"
                      >
                        <RefreshCcw className="h-3 w-3 mr-1" />
                        Try Again
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="flex-shrink-0 border-t p-4">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about vehicle values, market trends..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={() => sendMessage()}
            disabled={!inputValue.trim() || isLoading}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {isPremium && (
          <div className="mt-2 flex justify-center">
            <Badge variant="secondary" className="text-xs">
              Premium Assistant - Enhanced responses available
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
