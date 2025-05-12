
import React from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LeadsListProps {
  leads: any[];
  isLoading: boolean;
  isPremium?: boolean;
}

export const LeadsList: React.FC<LeadsListProps> = ({ leads, isLoading, isPremium = false }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border rounded-md p-4">
            <div className="flex justify-between items-start">
              <div>
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-4 w-24 mb-3" />
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
            <div className="flex gap-2 mt-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No leads available at this time.</p>
        <p className="text-sm text-muted-foreground mt-2">Check back later for new opportunities.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {leads.map((lead) => {
        // Determine if this is a high-value lead (just an example criteria)
        const isHighValue = lead.estimated_value > 15000;
        // For premium dealers, we may add more data or styling
        const showPremiumInfo = isPremium && isHighValue;

        return (
          <div 
            key={lead.id} 
            className={`border rounded-md p-4 ${showPremiumInfo ? 'border-amber-300 bg-amber-50' : ''}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">
                    {lead.year} {lead.make} {lead.model}
                  </h3>
                  {showPremiumInfo && (
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                      <Star className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" />
                      High Value
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {lead.mileage ? `${lead.mileage.toLocaleString()} miles` : 'Mileage not specified'} • 
                  {lead.state ? ` ${lead.state}` : ' Location not specified'}
                </p>
                
                {isPremium && (
                  <div className="mt-2 text-sm">
                    <p className="text-amber-800">
                      Estimated Value: ${lead.estimated_value?.toLocaleString() || 'N/A'}
                      {showPremiumInfo && ' • 93% chance of acceptance'}
                    </p>
                  </div>
                )}
              </div>
              <Button variant="outline" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Offer
              </Button>
            </div>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {lead.condition_score ? `${lead.condition_score}/100 Condition` : 'Condition Unknown'}
              </Badge>
              {lead.has_open_recall && (
                <Badge variant="outline" className="text-xs text-yellow-700 bg-yellow-50 border-yellow-200">
                  Has Recall
                </Badge>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
