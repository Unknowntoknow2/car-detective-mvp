
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChatInterface } from './ChatInterface';
import { MessageCircle, X } from 'lucide-react';

interface ChatBubbleProps {
  valuationId?: string;
  initialMessage?: string;
}

export function ChatBubble({ valuationId, initialMessage }: ChatBubbleProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="chat-interface"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="w-[350px] shadow-xl"
          >
            <div className="relative">
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-2 top-2 h-6 w-6 rounded-full z-10"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              <ChatInterface 
                valuationId={valuationId} 
                initialMessage={initialMessage}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="chat-bubble"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.05 }}
            className="flex items-center"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="px-4 py-6 rounded-full shadow-lg bg-primary"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Ask Car Detective
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
