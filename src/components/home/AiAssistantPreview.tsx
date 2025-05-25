
import React, { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
}

export const AiAssistantPreview: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm AIN, your Auto Intelligence Network assistant. Ask me anything about vehicle valuations!",
      role: 'assistant'
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      role: 'user'
    };

    const assistantResponse: Message = {
      id: (Date.now() + 1).toString(),
      content: "I'd be happy to help you with that! For a full conversation, click the AIN assistant button in the bottom right corner.",
      role: 'assistant'
    };

    setMessages(prev => [...prev, userMessage, assistantResponse]);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <MessageCircle className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-sm">AIN Assistant Preview</h3>
          <p className="text-xs text-muted-foreground">Try asking a question!</p>
        </div>
      </div>

      <div className="space-y-3 mb-4 max-h-40 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-2 rounded-lg text-sm ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about car values..."
          className="flex-1 text-sm"
        />
        <Button 
          onClick={handleSendMessage}
          disabled={!message.trim()}
          size="sm"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default AiAssistantPreview;
