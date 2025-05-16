
import React, { useState, useEffect, useRef } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { askAI } from '@/api/askAI';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [valuationId, setValuationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const storedMessages = localStorage.getItem('ainChatHistory');
    if (storedMessages) {
      try {
        setMessages(JSON.parse(storedMessages));
      } catch (e) {
        console.error('Error parsing stored messages:', e);
      }
    } else {
      // If no chat history exists, add a welcome message
      const welcomeMessage: Message = {
        role: 'assistant',
        content: 'Hi there! I\'m AIN, your Auto Intelligence Network assistant. How can I help with your vehicle questions today?',
        timestamp: Date.now()
      };
      setMessages([welcomeMessage]);
      localStorage.setItem('ainChatHistory', JSON.stringify([welcomeMessage]));
    }

    // Check for logged in user
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        
        // Try to get the latest valuation ID for context
        const { data: valuations } = await supabase
          .from('valuations')
          .select('id')
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (valuations && valuations.length > 0) {
          setValuationId(valuations[0].id);
        }
      }
    };
    
    getUser();
  }, []);

  // Auto-scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const newUserMessage: Message = {
      role: 'user',
      content: input,
      timestamp: Date.now()
    };
    
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    localStorage.setItem('ainChatHistory', JSON.stringify(updatedMessages));
    setInput('');
    setIsLoading(true);
    
    try {
      const userContext = user ? {
        userId: user.id,
        email: user.email,
        valuationId: valuationId
      } : null;
      
      const { answer, error } = await askAI({ 
        question: input, 
        userContext, 
        chatHistory: updatedMessages.slice(-3), // Send last 3 messages for context
        valuationId // Pass the valuationId to get vehicle context
      });
      
      if (error) {
        toast.error("Sorry, I couldn't process your request right now.");
        console.error("AI assistant error:", error);
        return;
      }
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: answer || "I'm sorry, I couldn't generate a response at this time.",
        timestamp: Date.now()
      };
      
      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      localStorage.setItem('ainChatHistory', JSON.stringify(finalMessages));
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    const welcomeMessage: Message = {
      role: 'assistant',
      content: 'Chat history cleared. How can I help you today?',
      timestamp: Date.now()
    };
    setMessages([welcomeMessage]);
    localStorage.setItem('ainChatHistory', JSON.stringify([welcomeMessage]));
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md md:max-w-lg w-full p-0 flex flex-col h-full">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-primary" />
            <span>AIN — Auto Intelligence Network™</span>
          </SheetTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearChat}
            className="text-xs text-muted-foreground"
          >
            Clear Chat
          </Button>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
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
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.timestamp && (
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t mt-auto">
          <div className="flex items-center space-x-2">
            <textarea
              className="flex-1 min-h-[40px] max-h-[120px] p-2 rounded-md border resize-none bg-background"
              placeholder="Ask me anything about your vehicle..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              rows={1}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!input.trim() || isLoading}
              className="h-10 w-10 p-2 rounded-full"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
                />
              </svg>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
