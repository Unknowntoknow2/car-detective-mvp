
import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AIAssistantDrawer } from './AIAssistantDrawer';

export const AIAssistantTrigger: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenDrawer = () => {
    setIsOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleOpenDrawer}
          className="rounded-full shadow-lg h-12 w-12 p-0 flex items-center justify-center bg-primary hover:bg-primary/90"
          aria-label="Open AI Assistant"
        >
          <Sparkles className="h-5 w-5 text-white" />
        </Button>
      </div>

      {/* AI Assistant Drawer */}
      <AIAssistantDrawer isOpen={isOpen} onClose={handleCloseDrawer} />
    </>
  );
};
