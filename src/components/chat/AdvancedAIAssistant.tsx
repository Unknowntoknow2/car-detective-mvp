
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, X, Minimize2, Maximize2, RotateCcw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAINStore } from '@/stores/useAINStore';
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
  const { messages, addMessage, isLoading, setLoading, clearMessages } = useAINStore();
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when component mounts
  useEffect(() => {
    if (!isMinimized) {
      inputRef.current?.focus();
    }
  }, [isMinimized]);

  // Add contextual greeting when component mounts
  useEffect(() => {
    if (messages.length === 0 && contextualGreeting) {
      addMessage({
        role: 'assistant',
        content: contextualGreeting
      });
    }
  }, [contextualGreeting, messages.length, addMessage]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message to store
    addMessage({
      role: 'user',
      content: userMessage
    });

    setLoading(true);
    setIsThinking(true);

    try {
      // Prepare chat history for context
      const chatHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await askAIN(userMessage, undefined, chatHistory);
      
      if (response.error) {
        toast.error(response.error);
        addMessage({
          role: 'assistant',
          content: "I'm having trouble connecting right now. Please try again in a moment."
        });
      } else {
        addMessage({
          role: 'assistant',
          content: response.answer
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
      addMessage({
        role: 'assistant',
        content: "I encountered an error. Please try again."
      });
    } finally {
      setLoading(false);
      setIsThinking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { text: "Explain my valuation", icon: Zap },
    { text: "Market trends", icon: Sparkles },
    { text: "Compare prices", icon: RotateCcw },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="h-full flex flex-col bg-gradient-to-br from-background via-background to-primary/5"
    >
      {/* Header */}
      <motion.div 
        className="p-4 border-b bg-gradient-to-r from-primary to-blue-600 text-white relative overflow-hidden"
        layoutId="header"
      >
        {/* Animated background pattern */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-6 w-6" />
            </motion.div>
            <div>
              <h3 className="font-bold text-lg">AIN Assistant</h3>
              <p className="text-sm opacity-90">Auto Intelligence Network</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:bg-white/20"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
                    </motion.div>
                    <h4 className="text-lg font-semibold mb-2">Welcome to AIN!</h4>
                    <p className="text-muted-foreground mb-4">
                      Ask me anything about vehicle valuations, market trends, or car insights.
                    </p>
                    
                    {/* Quick Actions */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      {quickActions.map((action, index) => (
                        <motion.button
                          key={action.text}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => setInput(action.text)}
                          className="inline-flex items-center space-x-2 px-3 py-2 bg-primary/10 hover:bg-primary/20 
                                   rounded-full text-sm transition-colors"
                        >
                          <action.icon className="h-4 w-4" />
                          <span>{action.text}</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <Card className={`max-w-[80%] p-3 ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted/50 backdrop-blur-sm'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </Card>
                  </motion.div>
                ))}

                {/* Thinking indicator */}
                {isThinking && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex justify-start"
                  >
                    <Card className="p-3 bg-muted/50 backdrop-blur-sm">
                      <div className="flex items-center space-x-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="h-4 w-4 text-primary" />
                        </motion.div>
                        <span className="text-sm text-muted-foreground">AIN is thinking...</span>
                        <motion.div className="flex space-x-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 bg-primary rounded-full"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ 
                                duration: 0.6, 
                                repeat: Infinity, 
                                delay: i * 0.2 
                              }}
                            />
                          ))}
                        </motion.div>
                      </div>
                    </Card>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <motion.div 
              className="p-4 border-t bg-background/50 backdrop-blur-sm"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <div className="flex space-x-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask AIN anything about vehicles..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="shrink-0"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {messages.length > 0 && (
                <div className="flex justify-between items-center mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearMessages}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear chat
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    {isPremium ? "Premium" : "Free"} • {messages.length} messages
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdvancedAIAssistant;
