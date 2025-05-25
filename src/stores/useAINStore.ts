
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AINState {
  messages: ChatMessage[];
  isLoading: boolean;
  isOpen: boolean;
  error: string | null;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setLoading: (loading: boolean) => void;
  setOpen: (open: boolean) => void;
  setError: (error: string | null) => void;
  clearMessages: () => void;
}

export const useAINStore = create<AINState>()(
  persist(
    (set, get) => ({
      messages: [],
      isLoading: false,
      isOpen: false,
      error: null,
      addMessage: (message) => {
        const newMessage: ChatMessage = {
          ...message,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          timestamp: new Date(),
        };
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      },
      setLoading: (loading) => set({ isLoading: loading }),
      setOpen: (open) => set({ isOpen: open }),
      setError: (error) => set({ error }),
      clearMessages: () => set({ messages: [] }),
    }),
    {
      name: 'ain-assistant-storage',
      partialize: (state) => ({ messages: state.messages }),
    }
  )
);
