
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Send, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  extractVehicleContext, 
  detectIntent, 
  generateResponse,
  AssistantContext,
  VehicleContext
} from '@/utils/assistantContext';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  onClose: () => void;
  valuationId?: string;
  isPremium?: boolean;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ 
  onClose,
  valuationId,
  isPremium = false
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState<AssistantContext>({
    vehicle: {},
    isPremium: isPremium || false,
    previousIntents: []
  });
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    // If there's a valuation ID, fetch vehicle details
    if (valuationId) {
      fetchVehicleDetails(valuationId);
    }
    
    // Add welcome message
    const welcomeMessage: Message = {
      id: `welcome-${Date.now()}`,
      role: 'assistant',
      content: isPremium 
        ? "Hello! I'm your premium AI vehicle assistant. I can help with detailed valuation insights, market analysis, and more. What would you like to know about your vehicle?"
        : "Hi there! I'm your vehicle assistant. I can help with valuation questions, selling advice, and more. What would you like to know?",
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
  }, [valuationId, isPremium]);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Fetch vehicle details if we have a valuation ID
  const fetchVehicleDetails = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('valuations')
        .select('*')
        .eq('id', id)
        .maybeSingle();
        
      if (error) throw error;
      
      if (data) {
        const vehicleContext: VehicleContext = {
          make: data.make,
          model: data.model,
          year: data.year,
          mileage: data.mileage,
          zipCode: data.zip_code,
          vin: data.vin,
          condition: data.condition,
          accidentHistory: data.has_accidents
        };
        
        setContext(prev => ({
          ...prev,
          vehicle: vehicleContext,
          isPremium
        }));
      }
    } catch (error) {
      console.error('Error fetching vehicle details:', error);
    }
  };
  
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Start "typing" indicator
    setIsTyping(true);
    
    try {
      // Extract updated context from this message
      const updatedVehicleContext = extractVehicleContext([
        { role: 'user', content: userMessage.content }
      ]);
      
      // Update context with any new vehicle information
      const updatedContext: AssistantContext = {
        ...context,
        vehicle: {
          ...context.vehicle,
          ...updatedVehicleContext
        }
      };
      
      // Detect intent from user message
      const intent = detectIntent(userMessage.content);
      
      // Add intent to context for conversation continuity
      updatedContext.previousIntents = [
        ...(updatedContext.previousIntents || []),
        intent
      ];
      
      setContext(updatedContext);
      
      // Generate AI response
      const responseContent = await generateResponse(
        intent, 
        updatedContext, 
        userMessage.content
      );
      
      // Add AI response after a small delay to simulate typing
      setTimeout(() => {
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: responseContent,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
        
        // Save conversation if user is logged in
        if (user) {
          saveConversation([...messages, userMessage, aiMessage]);
        }
      }, 800 + Math.random() * 1200); // Random delay between 800ms and 2000ms
    } catch (error) {
      console.error('Error generating response:', error);
      
      // Handle error by showing an error message
      setTimeout(() => {
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: "I'm sorry, I'm having trouble processing that request. Could you try again or ask something else?",
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
      }, 800);
    }
  };
  
  const saveConversation = async (conversationMessages: Message[]) => {
    if (!user) return;
    
    try {
      // Save conversation to user_conversations table
      await supabase
        .from('user_conversations')
        .insert({
          user_id: user.id,
          valuation_id: valuationId,
          messages: conversationMessages.map(msg => ({
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp
          })),
          context: context
        });
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  };
  
  return (
    <>
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src="https://ui-avatars.com/api/?name=AI&background=5046e5&color=fff" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <h2 className="font-semibold">
            {isPremium ? 'Premium AI Assistant' : 'Vehicle Assistant'}
          </h2>
          {isPremium && (
            <span className="ml-2 text-xs bg-primary text-white px-2 py-0.5 rounded-full">
              PREMIUM
            </span>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <ScrollArea 
        className="flex-1 p-4 overflow-y-auto" 
        ref={scrollAreaRef}
      >
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
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
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-75"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-150"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1"
            disabled={isTyping}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!inputValue.trim() || isTyping}
          >
            {isTyping ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </>
  );
};

export default AIAssistant;
