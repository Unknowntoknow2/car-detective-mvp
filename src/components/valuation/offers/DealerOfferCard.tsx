
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BadgeEnhanced } from '@/components/ui/badge-enhanced';
import { Check, AlertCircle, Info } from 'lucide-react';
import { type DealerOffer } from '@/hooks/useDealerOfferComparison';
import { formatCurrency } from '@/utils/formatters';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DealerOfferCardProps {
  offer: DealerOffer;
  isBestOffer?: boolean;
}

export const DealerOfferCard: React.FC<DealerOfferCardProps> = ({ offer, isBestOffer = false }) => {
  // Determine badge colors based on label
  const getLabelVariant = () => {
    if (!offer.label) return 'secondary';
    if (offer.label.includes('Good')) return 'success';
    if (offer.label.includes('Fair')) return 'info';
    return 'warning';
  };

  return (
    <Card className="relative overflow-hidden transition-all hover:shadow-md">
      {isBestOffer && (
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[50px] border-r-[50px] border-t-primary border-r-transparent" />
      )}
      
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-neutral-600">Verified Dealer</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs max-w-60">
                      This is a verified dealer on our platform. Their identity has been validated.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <h3 className="text-2xl font-bold mb-2">{formatCurrency(offer.offer_amount)}</h3>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <BadgeEnhanced 
                variant={getLabelVariant()} 
                icon={<Check className="h-3 w-3" />}
              >
                {offer.label || 'Offer'}
              </BadgeEnhanced>
              
              {isBestOffer && (
                <BadgeEnhanced variant="accent" icon={<Check className="h-3 w-3" />}>
                  Best Deal
                </BadgeEnhanced>
              )}
            </div>
            
            {offer.insight && (
              <p className="text-sm text-neutral-600">{offer.insight}</p>
            )}
          </div>
          
          {isBestOffer && (
            <div className="hidden sm:flex items-center justify-center h-16 w-16">
              <svg className="h-14 w-14 text-primary/20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
              </svg>
            </div>
          )}
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="w-full mt-3">
              <div className="w-full bg-neutral-100 rounded-full h-2.5">
                <div 
                  className="h-2.5 rounded-full" 
                  style={{ 
                    width: `${offer.score || 50}%`,
                    backgroundColor: offer.score && offer.score > 80 ? '#16a34a' : 
                                     offer.score && offer.score > 60 ? '#0ea5e9' : 
                                     '#f59e0b'
                  }}
                ></div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-56">
                Offer score: {offer.score || 'N/A'}/100. Based on valuation confidence and how the offer compares to the estimated market value.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};
