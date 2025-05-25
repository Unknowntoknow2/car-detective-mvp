
import React from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { AdvancedAIAssistant } from './AdvancedAIAssistant';
import { motion } from 'framer-motion';

interface AINAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  valuationId?: string;
  contextualGreeting?: string;
}

export const AINAssistantDrawer: React.FC<AINAssistantDrawerProps> = ({ 
  isOpen, 
  onClose,
  valuationId,
  contextualGreeting
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent 
        side="right" 
        className="w-[90vw] sm:w-[480px] lg:w-[540px] p-0 border-l-2 border-primary/20 
                   bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
      >
        <motion.div 
          className="h-full"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <AdvancedAIAssistant 
            onClose={onClose} 
            valuationId={valuationId}
            isPremium={true} // You can make this dynamic based on user status
            contextualGreeting={contextualGreeting}
          />
        </motion.div>
      </SheetContent>
    </Sheet>
  );
};

export default AINAssistantDrawer;
