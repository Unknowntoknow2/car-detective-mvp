import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAINStore, ChatMessage } from '@/stores/useAINStore';
import { askAIN } from '@/services/ainService';
import { toast } from 'sonner';

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
  const [inputValue, setInputValue] = useState('');
  const { messages, isLoading, error, addMessage, setLoading, setError, clearMessages } = useAINStore();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Add contextual greeting if provided and no messages exist
  useEffect(() => {
    if (contextualGreeting && messages.length === 0) {
      addMessage({
        role: 'assistant',
        content: contextualGreeting
      });
    }
  }, [contextualGreeting, messages.length, addMessage]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setError(null);

    // Add user message
    addMessage({
      role: 'user',
      content: userMessage
    });

    // Start loading
    setLoading(true);

    try {
      // Get chat history for context
      const chatHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await askAIN(userMessage, undefined, chatHistory);

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
    } catch (err) {
      const errorMessage = 'Sorry, I encountered an unexpected error. Please try again.';
      setError(errorMessage);
      addMessage({
        role: 'assistant',
        content: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async () => {
    if (messages.length === 0) return;
    
    // Find the last user message
    const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user');
    if (!lastUserMessage) return;

    // Remove the last assistant message if it was an error
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'assistant' && error) {
      // We'll just resend without removing, to keep history
    }

    setError(null);
    setLoading(true);

    try {
      const chatHistory = messages.slice(0, -1).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await askAIN(lastUserMessage.content, undefined, chatHistory);

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
    } catch (err) {
      const errorMessage = 'Retry failed. Please check your connection and try again.';
      setError(errorMessage);
      addMessage({
        role: 'assistant',
        content: errorMessage
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

  const suggestedQuestions = [
    "What affects my car's value?",
    "How do market trends impact pricing?",
    "Explain this valuation result",
    "What's the best time to sell?"
  ];

  const TypingIndicator = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 text-muted-foreground text-sm p-3"
    >
      <div className="flex gap-1">
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
      <span>AIN is thinking...</span>
    </motion.div>
  );

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/10 to-blue-500/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-gradient-to-r from-primary to-blue-600">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">AIN Assistant</h3>
            <p className="text-sm text-muted-foreground">Auto Intelligence Network™</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {error && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRetry}
              className="text-orange-600 hover:text-orange-700"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={`${message.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground ml-4'
                      : 'bg-muted text-foreground mr-4'
                  } ${error && index === messages.length - 1 ? 'border border-orange-200 bg-orange-50' : ''}`}
                >
                  {error && index === messages.length - 1 && (
                    <div className="flex items-center gap-2 mb-2 text-orange-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-xs font-medium">Connection Issue</span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && <TypingIndicator />}

          {/* Suggested Questions */}
          {messages.length <= 1 && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              <p className="text-sm text-muted-foreground px-2">Try asking:</p>
              <div className="grid grid-cols-1 gap-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="justify-start text-left h-auto py-2 px-3"
                    onClick={() => {
                      setInputValue(question);
                      if (inputRef.current) {
                        inputRef.current.focus();
                      }
                    }}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t bg-background/50 backdrop-blur-sm">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask AIN about your vehicle..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputValue.trim() || isLoading}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2 text-xs text-orange-600 flex items-center gap-1"
          >
            <AlertCircle className="h-3 w-3" />
            <span>Having trouble connecting. Check your internet or try again.</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdvancedAIAssistant;
