
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Send, Bot } from 'lucide-react';
import { ChatBubble } from './ChatBubble';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const { user, userRole } = useAuth();
  
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Create a new user message
    const newUserMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    // Update messages state
    setMessages([...messages, newUserMessage]);
    
    // Clear input
    setInputValue('');
    
    // Simulate assistant response based on user role
    setTimeout(() => {
      const assistantContent = userRole === 'dealer' 
        ? "Here's some dealer-specific information that might help you."
        : "How can I help you with your vehicle valuation today?";
        
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: assistantContent,
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          Car Detective Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-y-auto px-4 py-0">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No messages yet. Start a conversation!
            </div>
          ) : (
            messages.map(message => (
              <ChatBubble 
                key={message.id}
                content={message.content}
                sender={message.sender}
                timestamp={message.timestamp}
              />
            ))
          )}
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4">
        <div className="flex w-full gap-2">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="min-h-[60px] flex-grow"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputValue.trim()}
            size="icon"
            className="h-[60px] w-[60px]"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChatInterface;
