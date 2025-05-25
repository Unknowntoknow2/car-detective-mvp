
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Send, Sparkles, MessageCircle, User, Bot } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { askAI } from '@/api/askAI';
import { useLocation } from 'react-router-dom';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface AdvancedAIAssistantProps {
  onClose: () => void;
  valuationId?: string;
  isPremium?: boolean;
  contextualGreeting?: string;
}

export const AdvancedAIAssistant: React.FC<AdvancedAIAssistantProps> = ({ 
  onClose, 
  valuationId,
  isPremium = false,
  contextualGreeting 
}) => {
  const location = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with contextual greeting
  useEffect(() => {
    const greeting = contextualGreeting || getDefaultGreeting();
    setMessages([{
      id: '1',
      content: greeting,
      role: 'assistant',
      timestamp: new Date()
    }]);
  }, [contextualGreeting]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const getDefaultGreeting = () => {
    if (location.pathname.includes('/valuation-result')) {
      return "I see you're looking at a valuation result. Want help understanding how it's calculated or exploring market insights?";
    }
    if (location.pathname.includes('/premium')) {
      return "Hi! I'm here to help you understand premium features and benefits. What would you like to know?";
    }
    if (location.pathname.includes('/dashboard')) {
      return "Welcome back! How can I help you with your vehicles today?";
    }
    return "Hi, I'm AIN — your Auto Intelligence Network assistant. Ask me anything about vehicle valuations, market trends, or pricing insights!";
  };

  const getVehicleContext = () => {
    // Extract context from current page/URL
    const urlParams = new URLSearchParams(location.search);
    return {
      isPremium,
      hasDealerAccess: false,
      ...(valuationId && { valuationId }),
      currentPage: location.pathname,
      // Add more context as needed
      vin: urlParams.get('vin') || undefined,
      make: urlParams.get('make') || undefined,
      model: urlParams.get('model') || undefined,
      year: urlParams.get('year') ? parseInt(urlParams.get('year')!) : undefined,
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue.trim();
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      console.log('🤖 Sending message to AI:', { question: currentInput.substring(0, 50) + '...' });
      
      const response = await askAI({
        question: currentInput,
        userContext: getVehicleContext(),
        chatHistory: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        systemPrompt: `You are AIN — Auto Intelligence Network™, a GPT-4o-powered vehicle valuation assistant built by Car Detective. 

CORE EXPERTISE:
- Vehicle valuations and pricing analysis
- Market trends and forecasting  
- CARFAX® report interpretation
- Accident impact assessment
- Dealer vs private party pricing
- Vehicle condition evaluation
- Regional market variations
- Seasonal pricing factors

RESPONSE STYLE:
- Confident and conversational
- Provide specific, actionable insights
- Use data-driven explanations
- Be helpful and educational
- Keep responses concise but informative

CONTEXT: User is currently on ${location.pathname}${isPremium ? ' with Premium access' : ''}

Your goal: help individuals sell smarter and help dealers make profitable decisions with speed and trust.`
      });

      console.log('🤖 AI response received:', { answerLength: response.answer?.length });
      
      if (!response.answer) {
        throw new Error('No response from AI service');
      }

      setIsTyping(false);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.answer,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('❌ Error sending message:', error);
      setIsTyping(false);
      
      let errorMessage = 'Sorry, I\'m having trouble connecting right now. Please try again in a moment.';
      
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          errorMessage = 'AI service is not properly configured. Please contact support.';
        } else if (error.message.includes('network')) {
          errorMessage = 'Network connection issue. Please check your internet and try again.';
        }
      }
      
      toast.error('Failed to send message. Please try again.');
      
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: errorMessage,
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "How is this valuation calculated?",
    "What affects car values?",
    "Should I sell privately or to a dealer?",
    "What's my car worth in 6 months?"
  ];

  return (
    <div className="flex flex-col h-full max-h-screen bg-background">
      {/* Header */}
      <CardHeader className="flex-shrink-0 border-b bg-gradient-to-r from-primary/5 to-blue-50 dark:from-primary/10 dark:to-blue-950">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div 
              className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary to-blue-600 rounded-full shadow-lg"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                AIN — Auto Intelligence Network™
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs font-medium">
                  <MessageCircle className="h-3 w-3 mr-1" />
                  GPT-4o Powered
                </Badge>
                {isPremium && (
                  <Badge className="text-xs bg-gradient-to-r from-amber-500 to-orange-500">
                    Premium
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
        <div className="space-y-4 py-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className={message.role === 'user' ? 'bg-primary text-white' : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'}>
                      {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`p-3 rounded-2xl shadow-sm ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-muted border rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    <span className="text-xs opacity-70 mt-2 block">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-start"
              >
                <div className="flex items-start space-x-3 max-w-[85%]">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted border p-3 rounded-2xl rounded-bl-md">
                    <div className="flex items-center space-x-1">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        className="w-2 h-2 bg-primary rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 bg-primary rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 bg-primary rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Suggested Questions (show only if no messages from user) */}
          {messages.length === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <p className="text-sm text-muted-foreground px-2">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs rounded-full"
                    onClick={() => {
                      setInputValue(question);
                      setTimeout(() => handleSendMessage(), 100);
                    }}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="flex-shrink-0 border-t bg-background/95 backdrop-blur-sm p-4">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about vehicle values, market trends..."
            disabled={isLoading}
            className="flex-1 rounded-full"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="icon"
            className="rounded-full shadow-lg"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAIAssistant;
