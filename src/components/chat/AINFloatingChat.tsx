
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minimize2, Maximize2, Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAINStore } from '@/stores/useAINStore';
import { supabase } from '@/lib/supabaseClient';

interface FloatingChatProps {
  contextualGreeting?: string;
}

export const AINFloatingChat: React.FC<FloatingChatProps> = ({
  contextualGreeting
}) => {
  const { 
    isOpen, 
    isMinimized, 
    messages, 
    isLoading, 
    error,
    setOpen, 
    setMinimized, 
    addMessage, 
    setLoading, 
    setError 
  } = useAINStore();
  
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && messages.length === 0 && contextualGreeting) {
      addMessage({
        role: 'assistant',
        content: contextualGreeting
      });
    }
  }, [isOpen, isMinimized, messages.length, contextualGreeting, addMessage]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    addMessage({
      role: 'user',
      content: userMessage
    });

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('ask-ain', {
        body: {
          message: userMessage,
          chatHistory: messages
        }
      });

      if (error) throw error;

      addMessage({
        role: 'assistant',
        content: data.answer || 'Sorry, I couldn\'t generate a response.'
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed bottom-24 right-6 z-50"
        style={{ pointerEvents: 'auto' }}
      >
        <Card className={`bg-white/95 backdrop-blur-xl border shadow-2xl transition-all duration-300 ${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/10 to-blue-50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="font-semibold text-sm">AIN Assistant</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMinimized(!isMinimized)}
                className="h-8 w-8 p-0"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Chat Content - Only show when not minimized */}
          {!isMinimized && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-col h-[calc(100%-4rem)]"
            >
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg text-sm ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {message.content}
                      </div>
                    </motion.div>
                  ))}
                  
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm">
                        {error}
                      </div>
                    </motion.div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask AIN anything..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    size="sm"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
