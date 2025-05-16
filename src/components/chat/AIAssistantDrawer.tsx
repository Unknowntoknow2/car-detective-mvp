
import React, { useState, useRef, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerFooter } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, X, Loader2, Sparkles, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { askAI } from '@/api/askAI';
import { useValuationContext } from '@/hooks/useValuationContext';
import { supabase } from '@/integrations/supabase/client';

// Updated interface for structured message history
interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({ isOpen, onClose }) => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { vehicle, valuationId } = useValuationContext();
  const [userProfile, setUserProfile] = useState<{ first_name?: string } | null>(null);

  // Load user profile if logged in
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('first_name')
            .eq('id', user.id)
            .single();
          
          if (!error && data) {
            setUserProfile(data);
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        }
      }
    };

    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  // Load messages from localStorage on first render
  useEffect(() => {
    try {
      const storedMessages = localStorage.getItem('carDetective_chatHistory');
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      } else {
        // Set welcome message if no previous messages
        const welcomeMessage: Message = {
          role: 'assistant',
          content: userProfile?.first_name 
            ? `Hello ${userProfile.first_name}! I'm AIN — Auto Intelligence Network™. How can I help with your vehicle questions today?` 
            : 'Hello! I'm AIN — Auto Intelligence Network™. How can I help with your vehicle questions today?',
          timestamp: Date.now()
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  }, [userProfile]);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    try {
      // Only store the last 5 messages to keep localStorage size manageable
      const lastMessages = messages.slice(-5);
      localStorage.setItem('carDetective_chatHistory', JSON.stringify(lastMessages));
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  }, [messages]);

  // Scroll to bottom of chat when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Simulated typing effect
  useEffect(() => {
    let typingTimer: NodeJS.Timeout;
    if (isTyping) {
      typingTimer = setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    }
    return () => clearTimeout(typingTimer);
  }, [isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) return;
    
    // Add user message to chat
    const userMessage: Message = {
      role: 'user',
      content: question,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setQuestion('');
    setIsLoading(true);
    setIsTyping(true);
    
    try {
      // Prepare context from user data if available
      const userContext = {
        userId: user?.id,
        email: user?.email,
        role: user?.user_metadata?.role || 'individual',
        firstName: userProfile?.first_name,
        // Add vehicle context if available
        vehicleInfo: vehicle ? {
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          mileage: vehicle.mileage,
          trim: vehicle.trim,
          bodyType: vehicle.bodyType
        } : undefined,
        // Only include last 3 messages for context
        valuationId
      };
      
      // Get chat history for context (last 3 messages)
      const chatHistory = messages.slice(-3);
      
      const result = await askAI({
        question: userMessage.content,
        userContext,
        chatHistory,
        valuationId
      });
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      // Add assistant response to chat
      const assistantMessage: Message = {
        role: 'assistant',
        content: result.answer || "I'm sorry, I couldn't generate a response at this time.",
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Failed to get AI response:', error);
      toast.error('Failed to get a response. Please try again later.');
      
      // Add error message to chat
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm sorry, I couldn't process your request. Please try again later.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={open => !open && onClose()}>
      <DrawerContent className="h-[85vh] sm:max-w-md mx-auto rounded-t-xl">
        <DrawerHeader className="border-b pb-4 mb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">AIN — Auto Intelligence Network™</h2>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose} 
              className="h-8 w-8 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DrawerHeader>
        
        <div className="flex-1 overflow-auto p-4 max-h-[calc(85vh-140px)]">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4 text-muted-foreground">
              <Sparkles className="h-8 w-8 mb-4 text-primary" />
              <p className="mb-2 font-medium">How can I help with your car valuation?</p>
              <p className="text-sm">Ask me about car prices, market trends, or what affects your vehicle's value.</p>
              {vehicle ? (
                <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
                  <p className="font-medium">Your current vehicle:</p>
                  <p>{vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}</p>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`
                      flex gap-3 max-w-[80%] rounded-lg p-3
                      ${message.role === 'user' 
                        ? 'bg-primary text-primary-foreground ml-auto' 
                        : 'bg-muted'
                      }
                    `}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {message.role === 'user' && (
                      <div className="flex-shrink-0 w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3 flex items-center gap-1">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        <DrawerFooter className="p-4 pt-2 border-t">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="Ask about your car's value..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={isLoading || !question.trim()}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
