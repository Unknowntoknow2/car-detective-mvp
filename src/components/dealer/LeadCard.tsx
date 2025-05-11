
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { ReplyToLeadModal } from './ReplyToLeadModal';

interface LeadCardProps {
  lead: {
    id: string;
    make?: string;
    model?: string;
    year?: number;
    estimatedValue?: number;
    created_at: string;
    condition_score?: number;
  };
  hasReplied?: boolean;
}

export function LeadCard({ lead, hasReplied = false }: LeadCardProps) {
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  
  const getConditionLabel = (score?: number) => {
    if (!score) return 'Unknown';
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
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
              {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 my-4">
            {lead.estimatedValue && (
              <div>
                <p className="text-sm text-muted-foreground">Estimated Value</p>
                <p className="font-medium">${lead.estimatedValue.toLocaleString()}</p>
              </div>
            )}
            
            <div>
              <p className="text-sm text-muted-foreground">Condition</p>
              <p className="font-medium">{getConditionLabel(lead.condition_score)}</p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="border-t pt-4 flex justify-end">
          <Button
            onClick={() => setIsReplyModalOpen(true)}
            disabled={hasReplied}
          >
            {hasReplied ? 'Offer Sent' : 'Reply with Offer'}
          </Button>
        </CardFooter>
      </Card>
      
      <ReplyToLeadModal
        isOpen={isReplyModalOpen}
        onClose={() => setIsReplyModalOpen(false)}
        lead={lead}
      />
    </>
  );
}
