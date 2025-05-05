
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChatInterface } from './ChatInterface';
import { MessageCircle, X, ChevronUp, BrainCircuit } from 'lucide-react';
import { toast } from 'sonner';

interface ChatBubbleProps {
  valuationId?: string;
  initialMessage?: string;
  position?: 'bottom-right' | 'bottom-left';
  title?: string;
}

export function ChatBubble({ 
  valuationId, 
  initialMessage = "Tell me about my car's valuation",
  position = 'bottom-right',
  title = 'Ask Car Detective'
}: ChatBubbleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [hasShownIntro, setHasShownIntro] = useState(false);

  // Show introduction toast after a short delay
  useEffect(() => {
    if (!hasShownIntro && valuationId) {
      const timer = setTimeout(() => {
        toast.custom((t) => {
          // Safely handle null or undefined t
          if (t === null || typeof t !== 'object') {
            return null;
          }
          
          // Safely access properties with proper null checks
          const visibleClass = 'visible' in t && t.visible ? 'animate-enter' : 'animate-leave';
            
          return (
            <div className={`${visibleClass} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex`}>
              <div className="flex-1 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <BrainCircuit className="h-10 w-10 rounded-full bg-primary/10 p-2 text-primary" />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Car Detective AI Assistant
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Have questions about your car's value? I can help explain your valuation or suggest ways to increase it.
                    </p>
                    <div className="mt-2 flex">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="mr-2"
                        onClick={() => {
                          setIsOpen(true);
                          if (t !== null && typeof t === 'object') {
                            toast.dismiss(t);
                          }
                        }}
                      >
                        Ask a question
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          if (t !== null && typeof t === 'object') {
                            toast.dismiss(t);
                          }
                        }}
                      >
                        Later
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }, { duration: 8000 });
        setHasShownIntro(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [valuationId, hasShownIntro]);

  // Pulse animation when closed
  const pulseAnimation = hasNewMessage ? 
    { animate: { scale: [1, 1.1, 1], boxShadow: ["0px 0px 0px rgba(79, 70, 229, 0.2)", "0px 0px 20px rgba(79, 70, 229, 0.4)", "0px 0px 0px rgba(79, 70, 229, 0.2)"] }} : 
    {};

  const positionClasses = position === 'bottom-right' ? 
    'bottom-6 right-6' : 
    'bottom-6 left-6';

  return (
    <div className={`fixed ${positionClasses} z-50`}>
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            key="chat-interface"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="w-[350px] md:w-[400px] shadow-xl"
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
                onNewMessage={() => setHasNewMessage(true)}
                title={title}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="chat-bubble"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              ...pulseAnimation.animate
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ 
              duration: 0.2,
              repeat: hasNewMessage ? Infinity : 0,
              repeatType: "loop",
              repeatDelay: 2
            }}
            whileHover={{ scale: 1.05 }}
            className="flex items-center"
          >
            <Button
              onClick={() => {
                setIsOpen(true);
                setHasNewMessage(false);
              }}
              className="px-4 py-6 rounded-full shadow-lg bg-primary flex items-center"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              {title}
              {hasNewMessage && (
                <span className="ml-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
