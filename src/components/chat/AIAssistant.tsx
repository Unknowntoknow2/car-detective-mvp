
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, RefreshCw, Bot, User } from 'lucide-react';
import { askAI } from '@/api/askAI';
import { useAINStore } from '@/stores/useAINStore';
import ReactMarkdown from 'react-markdown';

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
  const [initial, setInitial] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Add initial greeting if no messages
  useEffect(() => {
    if (messages.length === 0) {
      addMessage({
        role: 'assistant',
        content: "Hi! I'm AIN, your Auto Intelligence Network assistant. Ask me anything about vehicle valuations, market trends, or car pricing!"
      });
      setInitial(false);
    }
  }, [messages.length, addMessage]);

  const defaultSuggestions = [
    'Try asking about a VIN value',
    'Ask: "What\'s the best price for a 2017 Civic?"',
    'Type: "Help me value my car"'
  ];

  const sendMessage = async (retryMessage?: string) => {
    const messageContent = retryMessage || input.trim();
    if (!messageContent) return;

    // Add user message if not retrying
    if (!retryMessage) {
      addMessage({
        role: 'user',
        content: messageContent
      });
    }

    if (!retryMessage) setInput('');
    setLoading(true);
    setError(null);
    setInitial(false);

    try {
      const response = await askAI({
        question: messageContent,
        userContext: {
          isPremium,
          hasDealerAccess: false
        },
        chatHistory: messages.slice(0, -1) // Exclude the current message
      });

      addMessage({
        role: 'assistant',
        content: response.answer
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get response from AIN. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage();
  };

  const handleRetry = async () => {
    const lastUserMessage = messages
      .filter(m => m.role === 'user')
      .pop();
    
    if (lastUserMessage) {
      await sendMessage(lastUserMessage.content);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 p-6 rounded-3xl shadow-2xl border bg-background">
      <div ref={scrollRef} className="bg-muted rounded-2xl p-5 space-y-4 h-[500px] overflow-y-auto border border-muted-foreground">
        {initial && messages.length <= 1 && (
          <div className="text-center text-muted-foreground text-sm">
            <div className="mb-3 font-semibold text-lg">👋 Hi there! I'm <strong>AIN</strong> — Ask me anything.</div>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              {defaultSuggestions.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-end gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-white" />
              </div>
            )}
            
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-md ${
                message.role === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-900 border border-gray-200'
              }`}
            >
              <div className="whitespace-pre-wrap">
                {message.role === 'assistant' ? (
                  <ReactMarkdown className="prose prose-sm dark:prose-invert">
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  message.content
                )}
              </div>
              <div className="text-xs opacity-70 mt-1">
                {new Date(message.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>

            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center text-muted-foreground text-sm gap-2">
            <Loader2 className="animate-spin w-4 h-4" />
            <span>AIN is thinking...</span>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 rounded-md p-3 text-sm flex justify-between items-center shadow">
          <span>{error}</span>
          <Button size="sm" variant="outline" onClick={handleRetry} className="ml-2">
            <RefreshCw size={14} className="mr-1" /> Retry
          </Button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-3 pt-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          className="flex-1 shadow-inner rounded-full px-4 py-2"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !input.trim()} className="rounded-full px-6">
          Send
        </Button>
      </form>
    </div>
  );
};

export default AIAssistant;
