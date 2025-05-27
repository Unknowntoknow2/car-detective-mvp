
// 🚫 LOCKED: This implementation of AIN Assistant is complete and production-ready.
// Do not edit unless explicitly authorized. Last audited and approved on 2025-05-25.

import React, { useEffect, useRef, useState } from 'react';
import { useAINStore } from '@/stores/useAINStore';
import { askAI } from '@/api/askAI';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, RefreshCw, Bot, User, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface AIAssistantProps {
  className?: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ className }) => {
  const { 
    messages, 
    isLoading, 
    isOpen, 
    isMinimized, 
    error, 
    addMessage, 
    setLoading, 
    setOpen, 
    setMinimized, 
    setError, 
    clearMessages, 
    toggleOpen 
  } = useAINStore();
  
  const [input, setInput] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message - addMessage expects Omit<ChatMessage, 'id' | 'timestamp'>
    addMessage({
      role: 'user',
      content: input,
    });

    setInput('');
    setLoading(true);

    try {
      const response = await askAI({
        message: input,
        userContext: {
          isPremium: false,
          hasDealerAccess: false
        },
        chatHistory: messages,
      });

      if (response.error) {
        setError(response.error);
        addMessage({
          role: 'assistant',
          content: `Error: ${response.error}`,
        });
      } else if (response.answer || response.response) {
        setError(null);
        addMessage({
          role: 'assistant',
          content: response.answer || response.response || 'No response received.',
        });
      } else {
        setError('No response from AIN.');
        addMessage({
          role: 'assistant',
          content: 'No response received. Please try again.',
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send message.');
      addMessage({
        role: 'assistant',
        content: `Error: ${err.message || 'Failed to send message.'}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessageContent = (message: any) => {
    if (message.content.startsWith('Error:')) {
      return <div className="text-red-500">{message.content}</div>;
    }
    return <ReactMarkdown className="markdown">{message.content}</ReactMarkdown>;
  };

  return (
    <div className={cn("fixed z-50 bottom-6 right-6 rounded-md shadow-lg overflow-hidden transition-all duration-300 ease-in-out", 
      isOpen ? 'w-96 h-[600px]' : 'w-12 h-12',
      isMinimized ? 'h-12' : '',
      className
    )}>
      {/* Header */}
      <div 
        className="flex items-center justify-between p-3 bg-secondary cursor-pointer"
        onClick={toggleOpen}
      >
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium">AIN Assistant</span>
        </div>
        {isOpen ? (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => {
              e.stopPropagation();
              clearMessages();
            }}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        ) : (
          <MessageSquare className="w-5 h-5 text-primary" />
        )}
      </div>

      {/* Chat Content */}
      {isOpen && !isMinimized && (
        <div className="flex flex-col h-[calc(600px-48px)] bg-background">
          <div 
            ref={chatContainerRef}
            className="flex-grow overflow-y-auto p-4 space-y-2"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col text-sm ${message.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={cn(
                    "px-3 py-2 rounded-md inline-block",
                    message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  )}
                >
                  {renderMessageContent(message)}
                </div>
                <span className="text-xs text-muted-foreground mt-1">
                  {message.role === 'user' ? 'You' : 'AIN'} - {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start">
                <Bot className="w-4 h-4 mr-2 text-muted-foreground animate-pulse" />
                <span className="text-sm text-muted-foreground">AIN is thinking...</span>
              </div>
            )}
            {error && (
              <div className="text-red-500 text-sm">Error: {error}</div>
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }} className="p-4 border-t border-muted">
            <div className="relative">
              <Input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className="pr-10"
              />
              <Button
                type="submit"
                className="absolute right-1 top-1 rounded-md"
                size="sm"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Send'
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
