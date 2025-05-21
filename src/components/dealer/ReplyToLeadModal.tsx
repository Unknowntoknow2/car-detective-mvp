
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export interface LeadData {
  id: string;
  make?: string;
  model?: string;
  year?: number;
  estimatedValue?: number;
  created_at: string;
  condition_score?: number;
}

export interface ReplyToLeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: LeadData;
}

export const ReplyToLeadModal: React.FC<ReplyToLeadModalProps> = ({
  open,
  onOpenChange,
  lead
}) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const handleSend = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    setIsSending(true);
    try {
      // Simulating an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Message sent successfully');
      setMessage('');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reply to Lead</DialogTitle>
        </DialogHeader>
        
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-1">
            {lead.year} {lead.make} {lead.model}
          </h3>
          <p className="text-sm text-muted-foreground">
            Estimated value: ${lead.estimatedValue?.toLocaleString()}
          </p>
        </div>
        
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message here..."
          className="h-36"
        />
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={isSending}>
            {isSending ? 'Sending...' : 'Send Reply'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReplyToLeadModal;
