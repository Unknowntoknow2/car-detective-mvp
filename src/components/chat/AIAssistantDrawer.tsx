
import React, { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { X, MessageCircleQuestion } from 'lucide-react';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({ isOpen, onClose }) => {
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        <DrawerHeader className="border-b">
          <div className="flex items-center justify-between">
            <DrawerTitle>AI Assistant</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        <div className="p-4">
          <p>How can I help you with your vehicle valuation today?</p>
          {/* Chat interface would go here */}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export const AIAssistantTrigger: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)} 
        variant="outline" 
        size="icon" 
        className="fixed bottom-4 right-4 rounded-full h-12 w-12 shadow-lg"
      >
        <MessageCircleQuestion className="h-6 w-6" />
      </Button>
      <AIAssistantDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default AIAssistantDrawer;
