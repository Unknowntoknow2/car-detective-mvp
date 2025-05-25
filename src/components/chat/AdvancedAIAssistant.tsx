
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { X, Send, RotateCcw, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAINStore } from '@/stores/useAINStore';
import { askAIN } from '@/services/ainService';
import { VehicleContext } from '@/types/assistant';
import { extractVehicleContext } from '@/lib/valuation/extractVehicleContext';

interface AdvancedAIAssistantProps {
  onClose: () => void;
  valuationId?: string;
  isPremium?: boolean;
  contextualGreeting?: string;
}

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center space-x-1 text-muted-foreground"
  >
    <span className="text-sm">AIN is thinking</span>
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-1 h-1 bg-primary rounded-full"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: i * 0.2,
        }}
      />
    ))}
  </motion.div>
);

const SuggestedReplies = ({ onSelect }: { onSelect: (reply: string) => void }) => {
  const suggestions = [
    "Explain this valuation",
    "What affects this price?",
    "Market trends for this car",
    "How to improve value?",
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {suggestions.map((suggestion, index) => (
        <motion.button
          key={suggestion}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onSelect(suggestion)}
          className="px-3 py-1.5 text-xs bg-muted hover:bg-muted/80 rounded-full transition-colors"
        >
          {suggestion}
        </motion.button>
      ))}
    </div>
  );
};

export const AdvancedAIAssistant: React.FC<AdvancedAIAssistantProps> = ({
  onClose,
  valuationId,
  isPremium = false,
  contextualGreeting
}) => {
  const { messages, isLoading, error, addMessage, setLoading, setError } = useAINStore();
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  // Send initial greeting if no messages
  useEffect(() => {
    if (messages.length === 0 && contextualGreeting) {
      addMessage({
        role: 'assistant',
        content: contextualGreeting
      });
    }
  }, []);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || isLoading) return;

    setInput('');
    setError(null);
    
    // Add user message
    addMessage({
      role: 'user',
      content: textToSend
    });

    setLoading(true);

    try {
      // Extract vehicle context from conversation
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const vehicleContext: VehicleContext = extractVehicleContext([
        ...conversationHistory,
        { role: 'user', content: textToSend }
      ]);

      // Get AI response
      const response = await askAIN(textToSend, vehicleContext, conversationHistory);

      if (response.error) {
        setError(response.error);
        addMessage({
          role: 'assistant',
          content: `I apologize, but I'm having trouble connecting right now. ${response.error}. Please try again in a moment.`
        });
      } else {
        addMessage({
          role: 'assistant',
          content: response.answer
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
      setError(errorMessage);
      addMessage({
        role: 'assistant',
        content: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRetry = () => {
    if (messages.length > 0) {
      const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user');
      if (lastUserMessage) {
        handleSendMessage(lastUserMessage.content);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background to-background/95">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar className="h-10 w-10 bg-gradient-to-r from-primary to-blue-600">
              <AvatarFallback className="bg-transparent text-white font-bold">
                <Bot className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <motion.div
              className="absolute -top-0.5 -right-0.5"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="h-3 w-3 text-yellow-400" />
            </motion.div>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AIN Assistant</h3>
            <p className="text-xs text-muted-foreground">Auto Intelligence Network</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
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
                <div className={`flex items-start space-x-2 max-w-[80%] ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className={
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    }>
                      {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`rounded-2xl px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground ml-auto'
                      : 'bg-muted text-foreground'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-start space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-2xl px-4 py-2">
                  <TypingIndicator />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Suggested Replies */}
      {messages.length <= 1 && !isLoading && (
        <div className="px-4">
          <SuggestedReplies onSelect={handleSendMessage} />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="px-4 pb-2">
          <div className="flex items-center justify-between bg-destructive/10 text-destructive p-3 rounded-lg text-sm">
            <span>Connection issue occurred</span>
            <Button variant="outline" size="sm" onClick={handleRetry}>
              <RotateCcw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t bg-background/80 backdrop-blur-sm">
        <div className="flex space-x-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask AIN about your vehicle valuation..."
            className="resize-none min-h-[44px] max-h-[120px]"
            disabled={isLoading}
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="h-[44px] w-[44px] rounded-xl"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          AIN can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
};
