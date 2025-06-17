
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export const useValuationChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message: string) => {
    if (!user) return;
    
    setLoading(true);
    // Mock chat functionality
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    setLoading(false);
  };

  return { messages, sendMessage, loading };
};
