
import React from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { AdvancedAIAssistant } from './AdvancedAIAssistant';
import { motion } from 'framer-motion';
import { useAINStore } from '@/stores/useAINStore';

interface AINAssistantDrawerProps {
  valuationId?: string;
  contextualGreeting?: string;
}

export const AINAssistantDrawer: React.FC<AINAssistantDrawerProps> = ({ 
  valuationId,
  contextualGreeting
}) => {
  const { isOpen, setOpen } = useAINStore();

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent 
        side="right" 
        className="w-[90vw] sm:w-[480px] lg:w-[540px] p-0 border-l-2 border-primary/20 
                   bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60
                   shadow-2xl"
        style={{
          // Ensure the drawer doesn't block site interaction
          pointerEvents: 'auto'
        }}
      >
        <motion.div 
          className="h-full"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <AdvancedAIAssistant 
            onClose={() => setOpen(false)}
            valuationId={valuationId}
            isPremium={true}
            contextualGreeting={contextualGreeting}
          />
        </motion.div>
      </SheetContent>
    </Sheet>
  );
};

export default AINAssistantDrawer;
