<<<<<<< HEAD

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
=======
import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ReplyToLeadModal } from "./ReplyToLeadModal";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface LeadData {
  id: string;
  make?: string;
  model?: string;
  year?: number;
  estimatedValue?: number;
  created_at: string;
  condition_score?: number;
}

<<<<<<< HEAD
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
=======
export function LeadCard({ lead, hasReplied = false }: LeadCardProps) {
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);

  const getConditionLabel = (score?: number) => {
    if (!score) return "Unknown";
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Fair";
    return "Poor";
  };

  return (
    <>
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg">
              {lead.year} {lead.make} {lead.model}
            </h3>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(lead.created_at), {
                addSuffix: true,
              })}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 my-4">
            {lead.estimatedValue && (
              <div>
                <p className="text-sm text-muted-foreground">Estimated Value</p>
                <p className="font-medium">
                  ${lead.estimatedValue.toLocaleString()}
                </p>
              </div>
            )}

            <div>
              <p className="text-sm text-muted-foreground">Condition</p>
              <p className="font-medium">
                {getConditionLabel(lead.condition_score)}
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t pt-4 flex justify-end">
          <Button
            onClick={() => setIsReplyModalOpen(true)}
            disabled={hasReplied}
          >
            {hasReplied ? "Offer Sent" : "Reply with Offer"}
          </Button>
        </CardFooter>
      </Card>

      <ReplyToLeadModal
        isOpen={isReplyModalOpen}
        onClose={() => setIsReplyModalOpen(false)}
        lead={lead}
      />
    </>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
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
