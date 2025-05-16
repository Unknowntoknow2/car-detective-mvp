
import React, { useState, useEffect, useRef } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Sparkles, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { askAI } from '@/api/askAI';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage } from './ChatMessage';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useUser } from '@/hooks/useUser';
import { getValuationContext } from '@/utils/getValuationContext';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
  isPremiumContent?: boolean;
}

interface QuickReply {
  text: string;
  action?: () => void;
}

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [valuationId, setValuationId] = useState<string | null>(null);
  const [vehicleContext, setVehicleContext] = useState<any>(null);
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, isLoading: userLoading } = useUser();

  // Load chat history and user's latest valuation from Supabase
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
      
      // Set default quick replies for welcome message
      setQuickReplies([
        { text: "What can you help me with?" },
        { text: "How accurate are your valuations?" },
        { text: "Show me Premium features" }
      ]);
    }

    // Check for logged in user and their latest valuation
    const loadUserContext = async () => {
      if (!user) return;
      
      try {
        // Try to get the latest valuation ID for context
        const { data: valuations } = await supabase
          .from('valuations')
          .select('id')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (valuations && valuations.length > 0) {
          const latestValuationId = valuations[0].id;
          setValuationId(latestValuationId);
          
          // Get the vehicle context from the valuation
          const context = await getValuationContext(latestValuationId);
          setVehicleContext(context);
        }
      } catch (error) {
        console.error('Error fetching user context:', error);
      }
    };
    
    if (user && !userLoading) {
      loadUserContext();
    }
  }, [user, userLoading]);

  // Auto-scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Generate quick replies based on AI response content
  const generateQuickReplies = (content: string) => {
    const replies: QuickReply[] = [];
    
    // Default replies that are always useful
    replies.push({ text: "Tell me more" });
    
    // Context-specific replies
    if (vehicleContext) {
      if (content.includes("value") || content.includes("price") || content.includes("worth")) {
        replies.push({ text: "Compare with similar cars" });
        replies.push({ text: "What factors affect my value?" });
      }
      
      if (content.includes("dealer") || content.includes("sell")) {
        replies.push({ text: "What's a fair dealer offer?" });
        replies.push({ text: "Private sale vs dealer?" });
      }
      
      if (content.includes("condition")) {
        replies.push({ text: "How can I improve my car's value?" });
        replies.push({ text: "What issues affect value most?" });
      }
    }
    
    // Premium upsell opportunity
    if (vehicleContext && !vehicleContext.premium_unlocked && 
        (content.includes("forecast") || content.includes("history") || content.includes("CARFAX"))) {
      replies.push({ text: "Tell me about Premium features" });
    }
    
    // Limit to 3 quick replies
    return replies.slice(0, 3);
  };

  // Check if content requires premium
  const checkForPremiumContent = (content: string): boolean => {
    const premiumKeywords = ['CARFAX', 'accident history', 'service records', 'detailed forecast', 
                            'dealer network', 'market report', 'premium valuation'];
    
    return premiumKeywords.some(keyword => 
      content.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  const handleSendMessage = async (userMessage?: string) => {
    const messageText = userMessage || input;
    if (!messageText.trim()) return;
    
    const newUserMessage: Message = {
      role: 'user',
      content: messageText,
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
        question: messageText, 
        userContext, 
        chatHistory: updatedMessages.slice(-3), // Send last 3 messages for context
        valuationId // Pass the valuationId to get vehicle context
      });
      
      if (error) {
        toast.error("Sorry, I couldn't process your request right now.");
        console.error("AI assistant error:", error);
        return;
      }
      
      const isPremium = checkForPremiumContent(answer || "");
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: answer || "I'm sorry, I couldn't generate a response at this time.",
        timestamp: Date.now(),
        isPremiumContent: isPremium && vehicleContext && !vehicleContext.premium_unlocked
      };
      
      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      localStorage.setItem('ainChatHistory', JSON.stringify(finalMessages));
      
      // Generate quick replies based on the AI's response
      setQuickReplies(generateQuickReplies(answer || ""));
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
    setQuickReplies([
      { text: "What can you help me with?" },
      { text: "How accurate are your valuations?" },
      { text: "Show me Premium features" }
    ]);
  };

  const handleQuickReply = (text: string) => {
    handleSendMessage(text);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md md:max-w-lg w-full p-0 flex flex-col h-full bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <SheetHeader className="p-4 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative mr-3">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 animate-pulse opacity-30"></div>
                <div className="relative bg-white dark:bg-slate-800 rounded-full p-2">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
              </div>
              <SheetTitle className="text-lg">AIN — Auto Intelligence Network™</SheetTitle>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearChat}
              className="text-xs text-muted-foreground"
            >
              Clear Chat
            </Button>
          </div>
          
          {/* Vehicle Context Bar */}
          {vehicleContext && (
            <Card className="mt-2 p-2 bg-muted/30 border border-muted">
              <div className="text-xs flex items-center gap-1 text-muted-foreground">
                <MessageSquare className="h-3 w-3" />
                <span className="font-medium">Context:</span>
                {vehicleContext.year} {vehicleContext.make} {vehicleContext.model} • 
                {vehicleContext.mileage?.toLocaleString()} miles • 
                ZIP: {vehicleContext.zipCode || 'Unknown'} •
                <Badge variant={vehicleContext.premium_unlocked ? "outline" : "secondary"} className="text-[10px] h-4 px-1">
                  {vehicleContext.premium_unlocked ? '✓ Premium' : 'Free'}
                </Badge>
              </div>
            </Card>
          )}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white/80 to-white dark:from-slate-900/80 dark:to-slate-900">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              role={message.role}
              content={message.content}
              timestamp={message.timestamp ? new Date(message.timestamp).toISOString() : undefined}
              isPremiumContent={message.isPremiumContent}
            />
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-xl p-3 max-w-[80%]">
                <div className="flex items-center space-x-2">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        {!isLoading && quickReplies.length > 0 && messages.length > 0 && 
         messages[messages.length - 1].role === 'assistant' && (
          <div className="px-4 py-2 border-t">
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply, index) => (
                <Button 
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-8 bg-muted/30 hover:bg-muted/60"
                  onClick={() => handleQuickReply(reply.text)}
                >
                  {reply.text}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 border-t bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <textarea
              className="flex-1 min-h-[40px] max-h-[120px] p-3 rounded-xl border resize-none bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
              placeholder="Ask me anything about your vehicle..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              rows={1}
            />
            <Button 
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isLoading}
              className="h-10 w-10 p-2 rounded-full bg-primary hover:bg-primary/90 transition-colors shadow-md"
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
