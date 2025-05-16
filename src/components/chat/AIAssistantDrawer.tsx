
import React, { useState, useEffect, useRef } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ChatMessage } from './ChatMessage';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { askAI } from '@/api/askAI';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
  isPremiumContent?: boolean;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const [valuationContext, setValuationContext] = useState<any>(null);
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>([
    "Help me value my car",
    "What factors affect my car's value?",
    "Show me recent market trends"
  ]);

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('ainChatHistory');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error('Error loading chat history:', e);
      }
    } else {
      // Set welcome message if no history
      setMessages([
        {
          role: 'system',
          content: 'Welcome to AIN — Auto Intelligence Network™. I can help with car valuations, market trends, and more. How can I assist you today?',
          timestamp: new Date().toISOString()
        }
      ]);
    }

    // Try to load user valuation context if logged in
    loadUserContext();
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ainChatHistory', JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load user context from Supabase
  const loadUserContext = async () => {
    if (!user) return;
    
    try {
      // Get the user's most recent valuation
      const { data: valuations, error } = await supabase
        .from('valuations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      
      if (valuations && valuations.length > 0) {
        setValuationContext(valuations[0]);
      }
    } catch (error) {
      console.error('Error loading user context:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageInput.trim()) return;
    
    const userMessage: Message = {
      role: 'user',
      content: messageInput,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setMessageInput('');
    setIsLoading(true);
    
    try {
      const response = await askAI({
        question: messageInput,
        userContext: valuationContext,
        chatHistory: messages.filter(m => m.role !== 'system'),
      });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      let answer = response.answer || "I'm sorry, I couldn't generate a response.";
      
      // Check if response includes premium content
      const isPremium = checkForPremiumContent(answer);
      
      // Generate suggested replies based on the response
      const newSuggestions = generateSuggestedReplies(answer);
      setSuggestedReplies(newSuggestions);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: answer,
        timestamp: new Date().toISOString(),
        isPremiumContent: isPremium
      };
      
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error('Error sending message to AI:', error);
      toast.error('Failed to get a response. Please try again.');
      
      const errorMessage: Message = {
        role: 'system',
        content: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to check if content should be marked as premium
  const checkForPremiumContent = (content: string): boolean => {
    const premiumKeywords = [
      'carfax', 'dealer offer', 'premium report', 'forecast', 
      'accident history', 'service records', 'market comparison'
    ];
    
    return premiumKeywords.some(keyword => 
      content.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  // Generate context-aware suggested replies
  const generateSuggestedReplies = (lastResponse: string): string[] => {
    // Default suggestions
    const defaultSuggestions = [
      "Help me value my car",
      "What factors affect value?",
      "Upgrade to Premium"
    ];
    
    // Generate contextual suggestions based on last response
    if (lastResponse.toLowerCase().includes('value')) {
      return [
        "How can I increase value?",
        "Compare with similar cars",
        "Explain market trends"
      ];
    } else if (lastResponse.toLowerCase().includes('premium')) {
      return [
        "What's included in Premium?",
        "How much does it cost?",
        "Tell me about CARFAX integration"
      ];
    } else if (lastResponse.toLowerCase().includes('dealer')) {
      return [
        "Should I sell to a dealer?",
        "Compare offers",
        "Negotiation tips"
      ];
    }
    
    return defaultSuggestions;
  };

  const handleSuggestedReply = (reply: string) => {
    setMessageInput(reply);
  };

  // Format context as a readable string
  const getContextString = () => {
    if (!valuationContext) return null;
    
    return `📌 ${valuationContext.year} ${valuationContext.make} ${valuationContext.model} • ${new Intl.NumberFormat().format(valuationContext.mileage)} miles • ZIP ${valuationContext.zipCode} • Premium: ${valuationContext.premium_unlocked ? '✅' : '❌'}`;
  };

  return (
    <Drawer open={isOpen} onOpenChange={state => !state && onClose()}>
      <DrawerContent className="h-[85vh] sm:h-[85vh] max-w-md mx-auto">
        <DrawerHeader className="border-b">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <Sparkles className="h-4 w-4 text-primary" />
            </Avatar>
            <div>
              <DrawerTitle>AIN — Auto Intelligence Network™</DrawerTitle>
              <DrawerDescription>Your AI automotive assistant</DrawerDescription>
            </div>
          </div>
        </DrawerHeader>
        
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message, index) => (
            <ChatMessage 
              key={index} 
              role={message.role} 
              content={message.content} 
              timestamp={message.timestamp}
              isPremiumContent={message.isPremiumContent}
            />
          ))}
          {isLoading && (
            <div className="flex items-center space-x-2 py-2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">AIN is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* User context display */}
        {valuationContext && (
          <div className="px-4 py-1 border-t text-xs text-muted-foreground">
            {getContextString()}
          </div>
        )}
        
        {/* Suggested replies */}
        <div className="px-4 py-2 border-t flex flex-wrap gap-2">
          {suggestedReplies.map((reply, index) => (
            <Button 
              key={index}
              size="sm"
              variant="outline"
              className="text-xs h-7"
              onClick={() => handleSuggestedReply(reply)}
            >
              {reply}
            </Button>
          ))}
        </div>
        
        <DrawerFooter className="border-t pt-4">
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <Input
              value={messageInput}
              onChange={e => setMessageInput(e.target.value)}
              placeholder="Ask AIN about car values, market trends..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !messageInput.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
