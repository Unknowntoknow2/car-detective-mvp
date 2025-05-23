
import React, { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Sparkles, X, Lock } from 'lucide-react';
import { 
  extractVehicleContext, 
  detectIntent, 
  AssistantContext, 
  VehicleContext 
} from '@/utils/assistantContext';
import { askAI } from '@/api/askAI';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/lib/supabaseClient';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

interface AIAssistantProps {
  initialContext?: AssistantContext;
  valuationId?: string;
  onClose?: () => void;
  isPremium?: boolean;
}

export function AIAssistant({ 
  initialContext, 
  valuationId, 
  onClose,
  isPremium = false
}: AIAssistantProps) {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState<AssistantContext>(initialContext || {
    vehicle: {},
    isPremium: isPremium
  });
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  // Load previous conversation if available
  useEffect(() => {
    const loadConversation = async () => {
      // Try to load from localStorage first for non-authenticated users
      const storedConversation = localStorage.getItem('ai_conversation');
      if (storedConversation) {
        try {
          setConversation(JSON.parse(storedConversation));
        } catch (error) {
          console.error("Error parsing stored conversation:", error);
        }
      }
      
      // If authenticated and no valuationId is provided, try to load from Supabase
      if (user && !valuationId) {
        try {
          const { data, error } = await supabase
            .from('ai_conversations')
            .select('messages')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
            
          if (data && !error) {
            setConversation(data.messages);
          }
        } catch (error) {
          console.error("Error loading conversation from Supabase:", error);
        }
      }
      
      // If valuationId is provided, try to load conversation specific to this valuation
      if (valuationId) {
        try {
          const { data, error } = await supabase
            .from('ai_conversations')
            .select('messages')
            .eq('valuation_id', valuationId)
            .single();
            
          if (data && !error) {
            setConversation(data.messages);
          }
        } catch (error) {
          console.error("Error loading valuation conversation:", error);
        }
      }
    };
    
    loadConversation();
  }, [user, valuationId]);
  
  // Save conversation when it changes
  useEffect(() => {
    if (conversation.length > 0) {
      // Save to localStorage
      localStorage.setItem('ai_conversation', JSON.stringify(conversation));
      
      // Save to Supabase if authenticated
      if (user) {
        const saveConversation = async () => {
          try {
            const { error } = await supabase
              .from('ai_conversations')
              .upsert({
                user_id: user.id,
                valuation_id: valuationId || null,
                messages: conversation,
                updated_at: new Date().toISOString()
              }, { onConflict: 'user_id, valuation_id' });
              
            if (error) {
              console.error("Error saving conversation:", error);
            }
          } catch (error) {
            console.error("Error saving conversation:", error);
          }
        };
        
        saveConversation();
      }
    }
  }, [conversation, user, valuationId]);
  
  // Update context when conversation changes
  useEffect(() => {
    if (conversation.length > 0) {
      const vehicleContext = extractVehicleContext(conversation);
      setContext(prev => ({
        ...prev,
        vehicle: {
          ...prev.vehicle,
          ...vehicleContext
        },
        isPremium: isPremium
      }));
    }
  }, [conversation, isPremium]);
  
  // Scroll to bottom when conversation changes
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [conversation, isTyping]);
  
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    // Add user message
    const userMsg = message.trim();
    const newUserMessage: Message = {
      role: 'user', 
      content: userMsg,
      timestamp: Date.now()
    };
    
    setConversation(prev => [...prev, newUserMessage]);
    setMessage('');
    
    // Detect intent
    const intent = detectIntent(userMsg);
    
    // Update context with new information from this message
    const newVehicleInfo = extractVehicleContext([newUserMessage]);
    const updatedContext: AssistantContext = {
      ...context,
      vehicle: {
        ...context.vehicle,
        ...newVehicleInfo
      },
      previousIntents: [
        ...(context.previousIntents || []),
        intent
      ]
    };
    
    setContext(updatedContext);
    
    // Start typing animation
    setIsTyping(true);
    
    try {
      // Send to our AI service
      const { answer, error } = await askAI({
        question: userMsg,
        userContext: {
          vehicle: updatedContext.vehicle,
          intent: intent,
          isPremium: isPremium,
          previousIntents: updatedContext.previousIntents
        },
        chatHistory: conversation,
        valuationId: valuationId
      });
      
      if (error) {
        throw new Error(error);
      }
      
      // Add AI response
      setTimeout(() => {
        setIsTyping(false);
        setConversation(prev => [
          ...prev, 
          {
            role: 'assistant',
            content: answer || "I apologize, but I'm having trouble processing that request. Could you try again?",
            timestamp: Date.now()
          }
        ]);
      }, 500); // Small delay for natural feeling
      
    } catch (error) {
      console.error("Error getting AI response:", error);
      setIsTyping(false);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
      
      // Add fallback response
      setConversation(prev => [
        ...prev, 
        {
          role: 'assistant',
          content: "I apologize, but I'm having trouble processing that request. Could you try again later?",
          timestamp: Date.now()
        }
      ]);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="AI Assistant" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-medium">Car Detective AI</h3>
            <p className="text-xs text-muted-foreground">Powered by AIN™</p>
          </div>
          {isPremium && (
            <div className="ml-2 flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs">
              <Sparkles className="h-3 w-3" />
              <span>Premium</span>
            </div>
          )}
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {conversation.length === 0 ? (
            <div className="text-center py-8">
              <Sparkles className="h-8 w-8 mx-auto mb-2 text-primary opacity-50" />
              <h3 className="font-medium mb-1">Car Detective AI Assistant</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Ask me about your vehicle's value, accident impact, best time to sell, or any other car-related questions.
              </p>
            </div>
          ) : (
            conversation.map((msg, index) => (
              <div 
                key={index} 
                className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
              >
                {msg.role === 'assistant' && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src="https://github.com/shadcn.png" alt="AI Assistant" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}
                
                <div 
                  className={`rounded-lg p-3 text-sm max-w-[80%] ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground ml-auto' 
                      : 'bg-muted'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}
          
          {isTyping && (
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8 mt-1">
                <AvatarImage src="https://github.com/shadcn.png" alt="AI Assistant" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="rounded-lg p-3 text-sm bg-muted inline-block">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-current opacity-60 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-current opacity-60 animate-pulse delay-150"></div>
                  <div className="w-2 h-2 rounded-full bg-current opacity-60 animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="border-t p-4">
        {!isPremium && context.previousIntents?.length && context.previousIntents.length > 3 ? (
          <div className="mb-4 p-3 bg-muted/60 rounded-lg text-center">
            <Lock className="h-4 w-4 mx-auto mb-1" />
            <p className="text-xs font-medium">Continue with Premium</p>
            <p className="text-xs text-muted-foreground mb-2">
              Unlock unlimited AI assistance with Premium
            </p>
            <Button size="sm" variant="default" className="bg-gradient-to-r from-blue-600 to-indigo-600">
              <Sparkles className="h-3 w-3 mr-1" /> Upgrade to Premium
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Textarea
              placeholder="Ask a question..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey ? (e.preventDefault(), handleSendMessage()) : null}
              className="resize-none min-h-[44px] max-h-32"
              disabled={isTyping}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={isTyping || !message.trim()}
              className="shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
