
import React from 'react';
import { format } from 'date-fns';
import { CDButton } from '@/components/ui-kit/CDButton';
import { CDBadge } from '@/components/ui-kit/CDBadge';
import { ValuationWithCondition } from '@/types/dealer';

interface LeadRowProps {
  lead: ValuationWithCondition;
  onMakeOffer: (lead: ValuationWithCondition) => void;
  onViewDetails: (lead: ValuationWithCondition) => void;
}

export function LeadRow({ lead, onMakeOffer, onViewDetails }: LeadRowProps) {
  const getConditionBadge = (score: number) => {
    if (score >= 85) return <CDBadge variant="success">Excellent</CDBadge>;
    if (score >= 70) return <CDBadge variant="info">Good</CDBadge>;
    if (score >= 50) return <CDBadge variant="warning">Fair</CDBadge>;
    return <CDBadge variant="error">Poor</CDBadge>;
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border-b border-gray-200">
      <div className="flex flex-col mb-2 md:mb-0">
        <span className="text-sm text-gray-500">
          {format(new Date(lead.created_at), 'MMM d, yyyy')}
        </span>
        <span className="font-medium">
          {lead.year} {lead.make} {lead.model}
        </span>
      </div>
      
      <div className="flex flex-col mb-2 md:mb-0">
        <span className="text-sm text-gray-500">Estimated Value</span>
        <span className="font-medium">${lead.estimated_value.toLocaleString()}</span>
      </div>
      
      <div className="flex flex-col mb-2 md:mb-0">
        <span className="text-sm text-gray-500">Condition</span>
        <div>{getConditionBadge(lead.condition_score)}</div>
      </div>
      
      <div className="flex gap-2">
        <CDButton 
          variant="primary" 
          size="sm"
          onClick={() => onMakeOffer(lead)}
        >
          Make Offer
        </CDButton>
        <CDButton 
          variant="outline" 
          size="sm"
          onClick={() => onViewDetails(lead)}
        >
          Details
        </CDButton>
      </div>
    </div>
  );
}
