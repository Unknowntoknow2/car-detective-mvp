
import React, { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { X, MessageCircleQuestion, Sparkles } from 'lucide-react';
import { AIAssistant } from './AIAssistant';
import { useAuth } from '@/contexts/AuthContext';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';

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
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="h-[60vh] max-h-[600px] flex flex-col">
        <AIAssistant 
          onClose={onClose} 
          valuationId={valuationId}
          isPremium={hasPremiumAccess}
        />
      </DrawerContent>
    </Drawer>
  );
};

export const AIAssistantTrigger: React.FC<{ valuationId?: string }> = ({ valuationId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { hasPremiumAccess } = usePremiumAccess(valuationId);
  
  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)} 
        variant="default" 
        size="icon" 
        className="fixed bottom-4 right-4 rounded-full h-12 w-12 shadow-lg"
      >
        {hasPremiumAccess ? (
          <Sparkles className="h-5 w-5" />
        ) : (
          <MessageCircleQuestion className="h-5 w-5" />
        )}
      </Button>
      <AIAssistantDrawer 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        valuationId={valuationId}
      />
    </>
  );
};

export default AIAssistantDrawer;
