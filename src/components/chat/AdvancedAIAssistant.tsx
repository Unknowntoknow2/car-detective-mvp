
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Send, Sparkles, MessageCircle, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { askAIN } from '@/services/ainService';
import { useAINStore } from '@/stores/useAINStore';

interface AdvancedAIAssistantProps {
  onClose: () => void;
  valuationId?: string;
  isPremium?: boolean;
  contextualGreeting?: string;
}

const suggestedQuestions = [
  "What factors affect my car's value?",
  "How does mileage impact vehicle pricing?",
  "What's the difference between trade-in and private party value?",
  "How do market trends affect car values?"
];

export const AdvancedAIAssistant: React.FC<AdvancedAIAssistantProps> = ({ 
  onClose, 
  valuationId,
  isPremium = false,
  contextualGreeting
}) => {
  const { messages, isLoading, error, addMessage, setLoading, setError, clearMessages } = useAINStore();
  const [inputValue, setInputValue] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Add contextual greeting on mount
  useEffect(() => {
    if (contextualGreeting && messages.length === 0) {
      addMessage({
        role: 'assistant',
        content: contextualGreeting
      });
    }
  }, [contextualGreeting, messages.length, addMessage]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (messageText?: string) => {
    const messageToSend = messageText || inputValue.trim();
    if (!messageToSend || isLoading) return;

    // Add user message
    addMessage({
      role: 'user',
      content: messageToSend
    });

    setInputValue('');
    setLoading(true);
    setError(null);

    try {
      console.log('🤖 Sending message to AIN:', messageToSend);
      
      const response = await askAIN(
        messageToSend,
        valuationId ? { valuationId } : undefined,
        messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      );

      if (response.error) {
        setError(response.error);
        addMessage({
          role: 'assistant',
          content: response.error
        });
      } else {
        addMessage({
          role: 'assistant',
          content: response.answer
        });
      }
    } catch (error) {
      console.error('❌ Error sending message:', error);
      const errorMessage = 'I\'m having trouble connecting right now. Please try again in a moment.';
      setError(errorMessage);
      addMessage({
        role: 'assistant',
        content: errorMessage
      });
    } finally {
      setLoading(false);
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[90vh]">
      {/* Header */}
      <CardHeader className="flex-shrink-0 border-b bg-gradient-to-r from-primary/5 to-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div 
              className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-full shadow-lg"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
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
                  <Badge className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500">Premium</Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 1 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearMessages}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
        <div className="space-y-4 py-4">
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
                  className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-primary to-blue-600 text-white'
                      : 'bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  <span className={`text-xs mt-2 block ${
                    message.role === 'user' ? 'text-white/70' : 'text-slate-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 p-4 rounded-2xl shadow-sm">
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-2 h-2 bg-primary rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-primary rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 bg-primary rounded-full"
                  />
                  <span className="text-sm text-slate-600 ml-2">AIN is thinking...</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Error state with retry */}
          {error && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-center gap-3">
                <p className="text-sm text-red-700">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  className="text-red-700 border-red-200 hover:bg-red-100"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
              </div>
            </motion.div>
          )}

          {/* Suggested questions (only show when no messages) */}
          {messages.length === 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <p className="text-center text-sm text-slate-600 font-medium">Try asking me about:</p>
              <div className="grid grid-cols-1 gap-2">
                {suggestedQuestions.map((question, index) => (
                  <motion.button
                    key={question}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleSendMessage(question)}
                    className="text-left p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-colors text-sm text-slate-700 hover:text-slate-900"
                  >
                    {question}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="flex-shrink-0 border-t p-4 bg-gradient-to-r from-slate-50 to-slate-100">
        <div className="flex space-x-3">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about vehicle values, market trends, or pricing insights..."
            disabled={isLoading}
            className="flex-1 bg-white border-slate-300 focus:border-primary"
          />
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isLoading}
              size="icon"
              className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
        <p className="text-xs text-slate-500 mt-2 text-center">
          AIN can make mistakes. Please verify important information.
        </p>
      </div>
    </div>
  );
};

export default AdvancedAIAssistant;
