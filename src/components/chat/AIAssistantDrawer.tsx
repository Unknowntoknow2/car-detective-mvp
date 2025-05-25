
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Sparkles, MessageCircleQuestion } from 'lucide-react';
import { AdvancedAIAssistant } from './AdvancedAIAssistant';
import { useAuth } from '@/contexts/AuthContext';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';
import { motion } from 'framer-motion';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  valuationId?: string;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({ 
  isOpen, 
  onClose,
  valuationId
}) => {
  const { user } = useAuth();
  const { hasPremiumAccess, isLoading } = usePremiumAccess(valuationId);
  
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent 
        side="right" 
        className="w-[90vw] sm:w-[540px] p-0 border-l-2 border-primary/20"
      >
        <div className="h-full">
          <AdvancedAIAssistant 
            onClose={onClose} 
            valuationId={valuationId}
            isPremium={hasPremiumAccess}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export const AIAssistantTrigger: React.FC<{ valuationId?: string }> = ({ valuationId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { hasPremiumAccess } = usePremiumAccess(valuationId);
  
  return (
    <>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button 
          onClick={() => setIsOpen(true)} 
          size="icon" 
          className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 border-2 border-background"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {hasPremiumAccess ? (
              <Sparkles className="h-6 w-6" />
            ) : (
              <MessageCircleQuestion className="h-6 w-6" />
            )}
          </motion.div>
        </Button>
        
        {/* Pulse effect */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-primary -z-10"
        />
      </motion.div>
      
      <AIAssistantDrawer 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        valuationId={valuationId}
      />
    </>
  );
};

export default AIAssistantDrawer;
