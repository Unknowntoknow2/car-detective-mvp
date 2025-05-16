
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { AIAssistantDrawer } from './AIAssistantDrawer';

// GPT_AI_ASSISTANT_V1
export const AIAssistantTrigger: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsDrawerOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 rounded-full shadow-lg h-14 w-14 p-0 flex items-center justify-center bg-primary hover:bg-primary/90"
        aria-label="Open AI Assistant"
      >
        <Sparkles className="h-6 w-6" />
      </Button>
      
      <AIAssistantDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
};
