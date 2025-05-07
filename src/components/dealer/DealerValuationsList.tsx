
import React, { useState } from 'react';
import { CDCard, CDCardHeader, CDCardBody } from '@/components/ui-kit/CDCard';
import { CDButton } from '@/components/ui-kit/CDButton';
import { LeadTable } from './LeadTable';
import { LeadFilters } from './LeadFilters';
import { useDealerValuations } from '@/hooks/useDealerValuations';
import { useDealerOffers } from '@/hooks/useDealerOffers';
import { ConditionFilterOption } from '@/hooks/useDealerValuations';
import { ValuationWithCondition } from '@/types/dealer';

export function DealerValuationsList() {
  const [activeTab, setActiveTab] = useState<'all' | 'offers'>('all');
  const [conditionFilter, setConditionFilter] = useState<ConditionFilterOption>('all');
  
  const { 
    valuations, 
    loading, 
    handleConditionFilterChange 
  } = useDealerValuations();
  
  const { 
    offers, 
    isLoading: offersLoading, 
    submitOffer 
  } = useDealerOffers();

  const handleMakeOffer = (leadId: string, amount: number, message?: string) => {
    if (leadId && amount) {
      // Find the valuation to get the user ID
      const valuation = valuations.find(v => v.id === leadId);
      if (valuation && valuation.user_id) {
        submitOffer({
          reportId: leadId,
          userId: valuation.user_id,
          amount,
          message
        });
      }
    }
  };

  const handleFilterChange = ({ condition }: any) => {
    if (condition) {
      handleConditionFilterChange(condition as ConditionFilterOption);
    }
  };

  return (
    <CDCard>
      <CDCardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Vehicle Leads</h2>
          <div className="flex gap-2">
            <CDButton
              variant={activeTab === 'all' ? 'primary' : 'secondary'}
              onClick={() => setActiveTab('all')}
            >
              All Leads
            </CDButton>
            <CDButton
              variant={activeTab === 'offers' ? 'primary' : 'secondary'}
              onClick={() => setActiveTab('offers')}
            >
              My Offers
            </CDButton>
          </div>
        </div>
      </CDCardHeader>
      <CDCardBody>
        {activeTab === 'all' && (
          <>
            <LeadFilters onFilterChange={handleFilterChange} />
            <LeadTable 
              leads={valuations} 
              isLoading={loading} 
              onMakeOffer={handleMakeOffer} 
            />
          </>
        )}
        
        {activeTab === 'offers' && (
          <div>
            {/* This would be replaced with an offers table component */}
            <div className="text-center py-8">
              {offersLoading ? (
                <p>Loading your offers...</p>
              ) : offers && offers.length > 0 ? (
                <p>You have {offers.length} active offers</p>
              ) : (
                <p>You haven't made any offers yet</p>
              )}
            </div>
          </div>
        )}
      </CDCardBody>
    </CDCard>
  );
}
