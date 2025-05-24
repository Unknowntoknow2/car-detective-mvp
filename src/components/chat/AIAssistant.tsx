
import React, { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Car, BarChart, AlertTriangle, DollarSign, FileText } from 'lucide-react';
import { 
  VehicleContext,
  AssistantContext
} from '@/types/assistant';
import { 
  detectIntent, 
  generateResponse 
} from '@/utils/assistantContext';
import { Separator } from '@/components/ui/separator';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIAssistantProps {
  initialContext?: Partial<AssistantContext>;
  initialVehicleContext?: Partial<VehicleContext>;
  onClose?: () => void;
  valuationId?: string;
  isPremium?: boolean;
}

export function AIAssistant({ 
  initialContext, 
  initialVehicleContext,
  onClose,
  valuationId,
  isPremium = false
}: AIAssistantProps) {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState<AssistantContext>({
    isPremium: isPremium || initialContext?.isPremium || false,
    hasDealerAccess: initialContext?.hasDealerAccess || false,
    userLocation: initialContext?.userLocation || { region: 'California' },
    previousIntents: initialContext?.previousIntents || []
  });
  const [vehicleContext, setVehicleContext] = useState<VehicleContext>(initialVehicleContext || {});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Add welcome message on first load
  useEffect(() => {
    if (conversation.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setConversation([{
          role: 'assistant', 
          content: `Hello! I'm your Car Detective AI assistant. I can help you understand your vehicle's true market value, how accidents impact pricing, selling strategies, and more. What would you like to know about ${vehicleContext?.make ? `your ${vehicleContext.year} ${vehicleContext.make} ${vehicleContext.model}` : 'your vehicle'}?`
        }]);
        setIsTyping(false);
      }, 1000);
    }
  }, []);
  
  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, isTyping]);
  
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    // Add user message
    const userMsg = message.trim();
    setConversation(prev => [...prev, {role: 'user', content: userMsg}]);
    setMessage('');
    
    // Detect intent
    const intent = detectIntent(userMsg);
    
    // Update previous intents
    setContext(prev => ({
      ...prev,
      previousIntents: [...(prev.previousIntents || []), intent]
    }));
    
    // Simulate AI typing response
    setIsTyping(true);
    
    // Generate response based on intent and context
    const assistantContext = {
      ...context,
      vehicleContext: vehicleContext
    };
    
    try {
      const response = await generateResponse(intent, assistantContext, userMsg);
      
      setTimeout(() => {
        setIsTyping(false);
        setConversation(prev => [...prev, {role: 'assistant', content: response}]);
      }, 800 + Math.random() * 1200); // Realistic typing delay
    } catch (error) {
      console.error("Error generating response:", error);
      setIsTyping(false);
      setConversation(prev => [...prev, {
        role: 'assistant', 
        content: "I apologize, but I'm having trouble processing that request. Could you try again or rephrase your question?"
      }]);
    }
  };

  // Get icon based on message content
  const getMessageIcon = (content: string) => {
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('value') || lowerContent.includes('worth') || lowerContent.includes('price')) {
      return <DollarSign className="h-4 w-4 mr-2" />;
    } else if (lowerContent.includes('accident') || lowerContent.includes('damage')) {
      return <AlertTriangle className="h-4 w-4 mr-2" />;
    } else if (lowerContent.includes('market') || lowerContent.includes('trend')) {
      return <BarChart className="h-4 w-4 mr-2" />;
    } else if (lowerContent.includes('report') || lowerContent.includes('carfax')) {
      return <FileText className="h-4 w-4 mr-2" />;
    }
    return <Car className="h-4 w-4 mr-2" />;
  };
  
  // Suggested questions based on context
  const suggestedQuestions = [
    vehicleContext?.make 
      ? `What is my ${vehicleContext.year} ${vehicleContext.make} ${vehicleContext.model} worth?` 
      : "How much is my car worth?",
    "How do accidents affect my car's value?",
    "What's the best way to sell my vehicle?",
    "What's included in the premium report?",
    "What are current market trends for my vehicle?"
  ];
  
  return (
    <div className="bg-card rounded-lg shadow-md p-6 border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <Car className="h-5 w-5 mr-2 text-primary" />
          Car Detective AI Assistant
        </h2>
        {isPremium && (
          <span className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-0.5 rounded">
            Premium
          </span>
        )}
      </div>
      
      <Separator className="mb-4" />
      
      <div className="space-y-4 max-h-[400px] overflow-y-auto mb-4 pr-1">
        {conversation.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && (
              <Avatar className="h-8 w-8 mt-1">
                <AvatarImage src="/images/ai-avatar.png" alt="AI Assistant" />
                <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">CAR</AvatarFallback>
              </Avatar>
            )}
            
            <div className={`rounded-lg p-3 text-sm ${
              msg.role === 'user' ? 'bg-primary text-primary-foreground ml-auto max-w-[75%]' : 'bg-muted text-foreground max-w-[85%]'
            }`}>
              {msg.role === 'assistant' && (
                <div className="flex items-center mb-1 text-xs text-muted-foreground">
                  {getMessageIcon(msg.content)}
                  <span>Car Detective AI</span>
                </div>
              )}
              <p>{msg.content}</p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8 mt-1">
              <AvatarImage src="/images/ai-avatar.png" alt="AI Assistant" />
              <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">CAR</AvatarFallback>
            </Avatar>
            <div className="rounded-lg p-3 text-sm bg-muted">
              <div className="flex space-x-1 items-center">
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-150"></div>
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-300"></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Reference for auto-scrolling */}
        <div ref={messagesEndRef} />
      </div>
      
      {conversation.length === 0 && !isTyping && (
        <div className="text-center py-8 text-muted-foreground">
          <Car className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p>Ask me about your vehicle's value, accident impact, best time to sell, or other car-related questions.</p>
        </div>
      )}
      
      {/* Suggested questions */}
      {conversation.length <= 2 && (
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.slice(0, 3).map((question, idx) => (
              <Button 
                key={idx} 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={() => {
                  setMessage(question);
                  setTimeout(() => handleSendMessage(), 100);
                }}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-4 flex items-center gap-2">
        <Input 
          type="text" 
          placeholder="Ask about your vehicle's value..." 
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' ? handleSendMessage() : null}
          className="bg-background"
        />
        <Button 
          onClick={handleSendMessage}
          disabled={!message.trim()}
          className="px-3"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default AIAssistant;
