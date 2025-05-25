
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, RefreshCcw, Send, MessageCircle } from 'lucide-react';
import { askAI } from '@/api/askAI';
import { useAINStore, ChatMessage } from '@/stores/useAINStore';

interface AIAssistantProps {
  onClose?: () => void;
  isPremium?: boolean;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ 
  onClose, 
  isPremium = false 
}) => {
  const { 
    messages, 
    isLoading, 
    error, 
    addMessage, 
    setLoading, 
    setError 
  } = useAINStore();
  
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add initial greeting if no messages
  useEffect(() => {
    if (messages.length === 0) {
      addMessage({
        role: 'assistant',
        content: "Hi! I'm AIN, your Auto Intelligence Network assistant. Ask me anything about vehicle valuations, market trends, or car pricing!"
      });
    }
  }, [messages.length, addMessage]);

  const sendMessage = async (retryMessage?: string) => {
    const messageContent = retryMessage || input.trim();
    if (!messageContent) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: new Date()
    };

    addMessage(userMessage);
    if (!retryMessage) setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await askAI({
        question: messageContent,
        chatHistory: messages,
        userContext: null,
        systemPrompt: `You are AIN — Auto Intelligence Network™, a GPT-4o-powered vehicle valuation assistant built by Car Detective. Your job is to assist users with car valuations, market trends, premium report benefits, dealer offers, and CARFAX® insights.

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
- Never guess - ask for missing information

Your goal: help individuals sell smarter and help dealers make profitable decisions with speed and trust.`
      });

      addMessage({
        role: 'assistant',
        content: response.answer
      });
    } catch (err: any) {
      console.error('AI Assistant error:', err);
      const errorMessage = err.message || 'Sorry, I encountered an error. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const retryLastMessage = () => {
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    if (lastUserMessage) {
      sendMessage(lastUserMessage.content);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[500px] bg-background">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <div className="text-sm whitespace-pre-wrap">
                {message.content}
              </div>
              <div className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg px-4 py-2 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">AIN is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error display */}
      {error && (
        <div className="px-4 pb-2">
          <Card className="border-destructive bg-destructive/10">
            <CardContent className="p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-destructive">{error}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={retryLastMessage}
                  className="text-destructive hover:bg-destructive/20"
                >
                  <RefreshCcw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Input area */}
      <div className="p-4 border-t bg-background">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about car values, market trends..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={() => sendMessage()}
            disabled={isLoading || !input.trim()}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
