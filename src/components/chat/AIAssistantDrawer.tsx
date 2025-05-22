
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, Send, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useValuationContext } from '@/hooks/useValuationContext';
import { ENABLE_AI_ASSISTANT } from '@/lib/constants';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AIAssistantDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { vehicle, valuationId } = useValuationContext();

  useEffect(() => {
    // Initial welcome message
    if (messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: 'Hello! I\'m your AI vehicle assistant. How can I help you today?'
        }
      ]);
    }
  }, [messages.length]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response (in a real app, this would call an API)
    setTimeout(() => {
      const aiResponses = [
        "That's a great question about your vehicle. The market value is influenced by several factors including mileage, condition, and local demand.",
        "Based on recent market data, vehicles like yours have been selling within 5% of our estimated value.",
        "To get a more accurate valuation, consider upgrading to our premium service which includes CARFAX® reports and dealer offers.",
        "I'd recommend getting the vehicle professionally inspected before selling to identify any issues that might affect its value.",
      ];

      const responseIndex = Math.floor(Math.random() * aiResponses.length);
      
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: aiResponses[responseIndex]
        }
      ]);
      
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!ENABLE_AI_ASSISTANT) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="default"
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[90vw] sm:max-w-md p-0 flex flex-col h-[90vh] sm:h-screen">
        <SheetHeader className="p-4 border-b">
          <div className="flex justify-between items-center">
            <SheetTitle className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
              </Avatar>
              <span>AI Assistant</span>
            </SheetTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, i) => (
            <div
              key={i}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce delay-75"></div>
                  <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <Separator />
        
        <div className="p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!input.trim() || isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Ask about your valuation, market trends, or selling tips.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default AIAssistantDrawer;
