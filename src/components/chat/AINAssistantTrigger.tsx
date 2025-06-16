
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

export const AINAssistantTrigger: React.FC = () => {
  return (
    <Button variant="outline" size="sm">
      <MessageCircle className="h-4 w-4 mr-2" />
      AI Assistant
    </Button>
  );
};

export default AINAssistantTrigger;
