
import React from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AINFloatingChat } from './AINFloatingChat';
import { useLocation } from 'react-router-dom';
import { useAINStore } from '@/stores/useAINStore';

export const AINAssistantTrigger: React.FC = () => {
  const { setOpen } = useAINStore();
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
              className="fixed bottom-6 right-6 z-40"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20,
                delay: 0.5
              }}
            >
              {/* Outer pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/30 to-blue-500/30"
                animate={{ 
                  scale: [1, 1.4, 1],
                  opacity: [0.7, 0, 0.7]
                }}
                transition={{ 
                  duration: 2.5, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Middle pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/40 to-blue-600/40"
                animate={{ 
                  scale: [1, 1.25, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.3
                }}
              />
              
              {/* Main button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Button
                  onClick={() => setOpen(true)}
                  size="icon"
                  className="h-16 w-16 rounded-full bg-gradient-to-r from-primary via-blue-600 to-primary 
                           hover:from-primary/90 hover:via-blue-700 hover:to-primary/90
                           shadow-2xl border-4 border-background/20 backdrop-blur-sm
                           transition-all duration-300 relative overflow-hidden"
                >
                  {/* Background shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                  
                  {/* Main icon with floating animation */}
                  <motion.div
                    animate={{ 
                      y: [0, -2, 0],
                      rotate: [0, 5, -5, 0] 
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                    className="relative z-10"
                  >
                    <MessageCircle className="h-7 w-7 text-white" />
                  </motion.div>
                  
                  {/* Sparkle accent with dynamic animation */}
                  <motion.div
                    className="absolute -top-1 -right-1 z-20"
                    animate={{ 
                      scale: [0.8, 1.3, 0.8], 
                      opacity: [0.6, 1, 0.6],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Sparkles className="h-4 w-4 text-yellow-300 drop-shadow-lg" />
                  </motion.div>
                  
                  {/* Secondary sparkles */}
                  <motion.div
                    className="absolute -bottom-1 -left-1 z-20"
                    animate={{ 
                      scale: [0.5, 1, 0.5], 
                      opacity: [0.4, 0.8, 0.4],
                      rotate: [0, -90, -180]
                    }}
                    transition={{ 
                      duration: 2.5, 
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                  >
                    <Sparkles className="h-3 w-3 text-yellow-200 drop-shadow-md" />
                  </motion.div>
                </Button>
              </motion.div>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent 
            side="left" 
            className="bg-background/95 backdrop-blur-sm border shadow-xl max-w-xs"
          >
            <div className="text-center">
              <p className="font-semibold text-primary">Ask AIN Anything!</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your smart car valuation assistant
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AINFloatingChat 
        contextualGreeting={getContextualGreeting()}
      />
    </>
  );
};

export default AINAssistantTrigger;
