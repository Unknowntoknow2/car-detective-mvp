
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ChatMessage } from '@/types/valuation';

export const useValuationChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message: string) => {
    if (!user) return;
    
    setLoading(true);
    // Mock chat functionality
    const newMessage: ChatMessage = { 
      id: `msg-${Date.now()}`,
      role: 'user', 
      content: message,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMessage]);
    setLoading(false);
  };

  return { messages, sendMessage, loading };
};
