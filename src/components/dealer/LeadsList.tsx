
import React from 'react';
import { LeadCard } from './LeadCard';
import { useDealerOffers } from '@/hooks/useDealerOffers';

interface Lead {
  id: string;
  make?: string;
  model?: string;
  year?: number;
  estimatedValue?: number;
  created_at: string;
  condition_score?: number;
}

interface LeadsListProps {
  leads: Lead[];
  isLoading?: boolean;
}

export function LeadsList({ leads, isLoading = false }: LeadsListProps) {
  // Get all dealer offers to check which leads already have offers
  const { data: allOffers, isLoading: offersLoading } = useDealerOffers();
  
  // Create a set of lead IDs that already have offers
  const leadsWithOffers = new Set(
    allOffers?.map(offer => offer.lead_id) || []
  );
  
  if (isLoading || offersLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading leads...</p>
      </div>
    );
  }
  
  if (!leads || leads.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">No leads available at this time.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {leads.map(lead => (
        <LeadCard 
          key={lead.id} 
          lead={lead} 
          hasReplied={leadsWithOffers.has(lead.id)}
        />
      ))}
    </div>
  );
}
