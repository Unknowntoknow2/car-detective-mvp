
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface ChatMessage {
  id?: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  valuation_id?: string;
  created_at: string;
}

export function useValuationChat(valuationId?: string) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUserMessage, setLastUserMessage] = useState<string | null>(null);

  // Fetch chat history for a session
  const fetchChatHistory = useCallback(async (sid: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sid)
        .order('created_at', { ascending: true });
        
      if (fetchError) throw new Error(fetchError.message);
      
      // Cast the role to ensure it's either 'user' or 'assistant'
      if (data) {
        const typedMessages = data.map(msg => ({
          ...msg,
          role: msg.role as 'user' | 'assistant'
        }));
        setMessages(typedMessages);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error('Error fetching chat history:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch chat history'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a new chat session
  const createSession = useCallback(async () => {
    if (!user) {
      toast.error('You must be logged in to use the chat feature');
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: sessionError } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          valuation_id: valuationId
        })
        .select()
        .single();
        
      if (sessionError) throw new Error(sessionError.message);
      
      setSessionId(data.id);
      setMessages([]);
      return data.id;
    } catch (err) {
      console.error('Error creating chat session:', err);
      setError(err instanceof Error ? err : new Error('Failed to create chat session'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, valuationId]);

  // Fetch existing session or create a new one
  const initializeSession = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Try to find an existing session for this valuation
      let session = null;
      
      if (valuationId) {
        const { data: existingSessions, error: sessionError } = await supabase
          .from('chat_sessions')
          .select('*')
          .eq('user_id', user.id)
          .eq('valuation_id', valuationId)
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (sessionError) throw new Error(sessionError.message);
        
        if (existingSessions && existingSessions.length > 0) {
          session = existingSessions[0];
        }
      }
      
      // If no existing session, create a new one
      if (!session) {
        const newSessionId = await createSession();
        if (!newSessionId) return;
        
        setSessionId(newSessionId);
      } else {
        setSessionId(session.id);
        // Fetch messages for this session
        await fetchChatHistory(session.id);
      }
    } catch (err) {
      console.error('Error initializing chat session:', err);
      setError(err instanceof Error ? err : new Error('Failed to initialize chat session'));
    } finally {
      setIsLoading(false);
    }
  }, [user, valuationId, createSession, fetchChatHistory]);

  // Regenerate the last assistant response
  const regenerateLastResponse = useCallback(async () => {
    if (!lastUserMessage || !sessionId) {
      toast.error('Nothing to regenerate');
      return;
    }
    
    // Remove the last message if it's from the assistant
    if (messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
      setMessages(prevMessages => prevMessages.slice(0, -1));
    }
    
    // Call sendMessage with the last user message to regenerate the response
    await sendMessage(lastUserMessage, true);
  }, [lastUserMessage, sessionId, messages]);

  // Send a message and get a response
  const sendMessage = useCallback(async (content: string, isRegeneration: boolean = false) => {
    if (!user) {
      toast.error('You must be logged in to use the chat feature');
      return;
    }
    
    if (!sessionId) {
      const newSessionId = await createSession();
      if (!newSessionId) return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Save the last user message for potential regeneration
      if (!isRegeneration) {
        setLastUserMessage(content);
      }

      // Optimistically add user message
      const userMessage: ChatMessage = {
        session_id: sessionId!,
        role: 'user',
        content,
        created_at: new Date().toISOString()
      };
      
      if (!isRegeneration) {
        setMessages(prev => [...prev, userMessage]);
      }
      
      // Prepare user context to send with the message
      const userContext = {
        name: localStorage.getItem('userName') || undefined,
        email: user.email || undefined,
      };
      
      // Call the Supabase Edge Function
      const { data, error: functionError } = await supabase.functions.invoke('ask-valuation-bot', {
        body: {
          session_id: sessionId,
          user_input: content,
          new_session: !sessionId,
          valuation_id: valuationId,
          user_context: userContext,
          is_regeneration: isRegeneration
        }
      });
      
      if (functionError) throw new Error(functionError.message);
      
      // If a new session was created, update the sessionId
      if (data.session_id && !sessionId) {
        setSessionId(data.session_id);
      }
      
      // Add assistant response
      const assistantMessage: ChatMessage = {
        session_id: sessionId || data.session_id,
        role: 'assistant',
        content: data.message,
        created_at: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Refresh messages from database to get proper IDs
      if (sessionId || data.session_id) {
        await fetchChatHistory(sessionId || data.session_id);
      }
    } catch (err) {
      console.error('Error sending chat message:', err);
      setError(err instanceof Error ? err : new Error('Failed to send message'));
      
      // Add error message
      const errorMessage: ChatMessage = {
        session_id: sessionId!,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        created_at: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [user, sessionId, valuationId, createSession, fetchChatHistory]);

  // Initialize session on mount
  useEffect(() => {
    if (user) {
      initializeSession();
    }
  }, [user, initializeSession]);

  // Store user name in localStorage if available
  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      localStorage.setItem('userName', user.user_metadata.full_name);
    }
  }, [user]);

  return {
    messages,
    sessionId,
    isLoading,
    error,
    sendMessage,
    regenerateLastResponse,
    createSession,
    fetchChatHistory
  };
}
