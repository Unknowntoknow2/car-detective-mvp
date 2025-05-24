
import React, { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Car, BarChart, DollarSign, AlertTriangle, FileText } from 'lucide-react';
import { 
  VehicleContext,
  AssistantContext
} from '@/types/assistant';
import { 
  detectIntent, 
  generateResponse 
} from '@/utils/assistantContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AiAssistantPreview() {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState<AssistantContext>({
    isPremium: false,
    hasDealerAccess: false,
    userLocation: { 
      region: 'California'
    }
  });
  const [vehicleContext, setVehicleContext] = useState<VehicleContext>({
    make: 'Toyota',
    model: 'Camry',
    year: 2019,
    mileage: 42500,
    condition: 'good'
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Add sample conversation on first load
  useEffect(() => {
    if (conversation.length === 0) {
      const sampleConversation = [
        {
          role: 'assistant' as const,
          content: "Hello! I'm your Car Detective AI assistant. I can help you understand your vehicle's true market value, how accidents impact pricing, selling strategies, and more. What would you like to know about your vehicle?"
        },
        {
          role: 'user' as const,
          content: "What's my 2019 Toyota Camry worth?"
        },
        {
          role: 'assistant' as const,
          content: "Based on our comprehensive market analysis, your 2019 Toyota Camry has an estimated value of $18,750. This valuation factors in current market conditions, the vehicle's age, condition, mileage, and regional price differences. Would you like more details about how this value compares to similar vehicles in your area?"
        }
      ];
      
      setConversation(sampleConversation);
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
    "How do accidents affect value?",
    "What's the best time to sell?",
    "Can I get dealer offers?"
  ];
  
  return (
    <Card className="shadow-lg border-2 overflow-hidden">
      <CardHeader className="bg-primary/5 pb-4">
        <CardTitle className="flex items-center text-primary">
          <Car className="h-5 w-5 mr-2" />
          Car Detective AI Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 pt-6">
        <div className="space-y-4 max-h-[300px] overflow-y-auto mb-4 pr-1">
          {conversation.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
            >
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
            </motion.div>
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
        
        {/* Suggested questions */}
        <div className="mb-4">
          <Separator className="mb-3" />
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, idx) => (
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
            disabled={!message.trim() || isTyping}
            className="px-3"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
