
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Send, Loader2, RotateCcw, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAINStore } from '@/stores/useAINStore';
import { askAIN } from '@/services/ainService';
import { getValuationContext } from '@/utils/getValuationContext';

interface AdvancedAIAssistantProps {
  onClose: () => void;
  valuationId?: string;
  isPremium?: boolean;
  contextualGreeting?: string;
}

const suggestedQuestions = [
  "How is my vehicle's value calculated?",
  "What affects my car's market value?",
  "Should I sell or keep my vehicle?",
  "What's the best time to sell?",
];

export const AdvancedAIAssistant: React.FC<AdvancedAIAssistantProps> = ({
  onClose,
  valuationId,
  isPremium = false,
  contextualGreeting
}) => {
  const { messages, isLoading, error, addMessage, setLoading, setError } = useAINStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (contextualGreeting && messages.length === 0) {
      addMessage({
        role: 'assistant',
        content: contextualGreeting
      });
    }
  }, [contextualGreeting, messages.length, addMessage]);

  const handleSubmit = async (message: string) => {
    if (!message.trim() || isLoading) return;

    // Add user message
    addMessage({ role: 'user', content: message.trim() });
    setInput('');
    setLoading(true);
    setError(null);
    setIsTyping(true);
    
    try {
      // Get vehicle context if valuationId is provided
      let vehicleContext = undefined;
      if (valuationId) {
        const context = await getValuationContext(valuationId);
        if (context) {
          vehicleContext = {
            make: context.make,
            model: context.model,
            year: context.year,
            mileage: context.mileage,
            condition: context.condition,
            zipCode: context.zipCode,
            estimatedValue: context.estimatedValue,
            color: context.color,
            bodyType: context.bodyType
          };
        }
      }

      const response = await askAIN(
        message.trim(),
        vehicleContext,
        messages.slice(-10) // Include last 10 messages for context
      );

      if (response.error) {
        throw new Error(response.error);
      }

      addMessage({ 
        role: 'assistant', 
        content: response.answer 
      });
      setRetryCount(0);
    } catch (error) {
      console.error('❌ AIN request failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to get response');
      
      // Add error message with retry option
      addMessage({
        role: 'assistant',
        content: retryCount < 2 
          ? "I'm having trouble right now. Please try asking again, or rephrase your question."
          : "AIN is temporarily unavailable. Our team has been notified and we're working to resolve this."
      });
      
      setRetryCount(prev => prev + 1);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    handleSubmit(question);
  };

  const handleRetry = () => {
    if (messages.length > 0) {
      const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
      if (lastUserMessage) {
        handleSubmit(lastUserMessage.content);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-blue-50 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-primary to-blue-600">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">AIN Assistant</CardTitle>
              <p className="text-sm text-muted-foreground">
                {isPremium ? 'Premium AI Assistant' : 'Auto Intelligence Network'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">AIN is thinking...</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error State with Retry */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center"
          >
            <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-destructive">{error}</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRetry}
                className="w-full"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </motion.div>
        )}

        {/* Suggested Questions */}
        {messages.length <= 1 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <p className="text-sm text-muted-foreground">Try asking:</p>
            <div className="grid grid-cols-1 gap-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestedQuestion(question)}
                  className="text-left justify-start h-auto p-3 whitespace-normal"
                  disabled={isLoading}
                >
                  {question}
                </Button>
              ))}
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </CardContent>

      {/* Input */}
      <div className="border-t p-4 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(input);
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AIN anything about your vehicle..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
