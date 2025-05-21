
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

interface LeadData {
  id: string;
  make?: string;
  model?: string;
  year?: number;
  estimatedValue?: number;
  created_at: string;
  condition_score?: number;
}

// Updated props to match what ReplyToLeadModal expects
interface ReplyToLeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: LeadData;
}

// Create a simplified ReplyToLeadModal component
const ReplyToLeadModal: React.FC<ReplyToLeadModalProps> = ({ 
  open, 
  onOpenChange, 
  lead 
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Reply to Lead</h2>
        <p className="mb-4">
          Send a message regarding {lead.year} {lead.make} {lead.model}
        </p>
        <textarea 
          className="w-full border rounded p-2 mb-4" 
          rows={4}
          placeholder="Enter your message here..."
        ></textarea>
        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            Send Reply
          </Button>
        </div>
      </div>
    </div>
  );
};

interface LeadCardProps {
  lead: LeadData;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead }) => {
  const [showReplyModal, setShowReplyModal] = useState(false);

  const formattedDate = format(new Date(lead.created_at), 'MMM dd, yyyy HH:mm');

  return (
    <Card className="shadow-md rounded-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">
          {lead.year} {lead.make} {lead.model}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${lead.make}${lead.model}${lead.year}`} />
            <AvatarFallback>
              {lead.make?.charAt(0)}
              {lead.model?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">
              Estimated Value: ${lead.estimatedValue?.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              Created at: {formattedDate}
            </p>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button size="sm" onClick={() => setShowReplyModal(true)}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Reply to Lead
          </Button>
        </div>
        {showReplyModal && (
          <ReplyToLeadModal
            open={showReplyModal}
            onOpenChange={setShowReplyModal}
            lead={lead}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default LeadCard;
