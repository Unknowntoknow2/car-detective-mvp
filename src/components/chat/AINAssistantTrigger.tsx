
import React, { useState } from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AINAssistantDrawer } from './AINAssistantDrawer';
import { useLocation } from 'react-router-dom';

export const AINAssistantTrigger: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Context-aware greeting based on current page
  const getContextualGreeting = () => {
    if (location.pathname.includes('/valuation-result')) {
      return "I see you're looking at a valuation result. Want help understanding how it's calculated or exploring market insights?";
    }
    if (location.pathname.includes('/premium')) {
      return "Hi! I'm here to help you understand premium features and benefits. What would you like to know?";
    }
    if (location.pathname.includes('/dashboard')) {
      return "Welcome back! How can I help you with your vehicles today?";
    }
    return "Hi, I'm AIN — your Auto Intelligence Network assistant. Ask me anything about vehicle valuations!";
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              className="fixed bottom-6 right-6 z-50"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20,
                delay: 0.5
              }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    "0 0 0 0 rgba(59, 130, 246, 0.4)",
                    "0 0 0 10px rgba(59, 130, 246, 0)",
                    "0 0 0 0 rgba(59, 130, 246, 0.4)"
                  ]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                <Button
                  onClick={() => setIsOpen(true)}
                  size="icon"
                  className="h-14 w-14 rounded-full bg-gradient-to-r from-primary via-blue-600 to-primary 
                           hover:from-primary/90 hover:via-blue-700 hover:to-primary/90
                           shadow-2xl border-2 border-background/20 backdrop-blur-sm
                           transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <MessageCircle className="h-6 w-6 text-white" />
                  </motion.div>
                  
                  {/* Sparkle accent */}
                  <motion.div
                    className="absolute -top-1 -right-1"
                    animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Sparkles className="h-3 w-3 text-yellow-300" />
                  </motion.div>
                </Button>
              </motion.div>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="left" className="bg-background/95 backdrop-blur-sm border shadow-xl">
            <p className="font-medium">Ask AIN — your smart car assistant</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AINAssistantDrawer 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        contextualGreeting={getContextualGreeting()}
      />
    </>
  );
};

export default AINAssistantTrigger;
