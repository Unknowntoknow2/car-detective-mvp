
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
  isMinimized: boolean;
  error: string | null;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setLoading: (loading: boolean) => void;
  setOpen: (open: boolean) => void;
  setMinimized: (minimized: boolean) => void;
  setError: (error: string | null) => void;
  clearMessages: () => void;
  toggleOpen: () => void;
}

export const useAINStore = create<AINState>()(
  persist(
    (set, get) => ({
      messages: [],
      isLoading: false,
      isOpen: false,
      isMinimized: false,
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
      setMinimized: (minimized) => set({ isMinimized: minimized }),
      setError: (error) => set({ error }),
      clearMessages: () => set({ messages: [] }),
      toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: 'ain-assistant-storage',
      partialize: (state) => ({ 
        messages: state.messages,
        isMinimized: state.isMinimized 
      }),
    }
  )
);
