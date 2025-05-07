
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { CDTable } from '@/components/ui-kit/CDTable';
import { CDButton } from '@/components/ui-kit/CDButton';
import { CDBadge } from '@/components/ui-kit/CDBadge';
import { ValuationWithCondition } from '@/types/dealer';
import { LeadRow } from './LeadRow';
import { OfferModal } from './OfferModal';

interface LeadTableProps {
  leads: ValuationWithCondition[];
  isLoading: boolean;
  onMakeOffer: (leadId: string, amount: number, message: string) => void;
}

export function LeadTable({ leads, isLoading, onMakeOffer }: LeadTableProps) {
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedLead, setSelectedLead] = useState<ValuationWithCondition | null>(null);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };

  const sortedLeads = [...leads].sort((a, b) => {
    if (sortField === 'created_at') {
      return sortDirection === 'asc'
        ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    if (sortField === 'estimated_value') {
      return sortDirection === 'asc'
        ? a.estimated_value - b.estimated_value
        : b.estimated_value - a.estimated_value;
    }
    if (sortField === 'condition_score') {
      return sortDirection === 'asc'
        ? a.condition_score - b.condition_score
        : b.condition_score - a.condition_score;
    }
    return 0;
  });

  const getConditionBadge = (score: number) => {
    if (score >= 85) return <CDBadge variant="success">Excellent</CDBadge>;
    if (score >= 70) return <CDBadge variant="info">Good</CDBadge>;
    if (score >= 50) return <CDBadge variant="warning">Fair</CDBadge>;
    return <CDBadge variant="error">Poor</CDBadge>;
  };

  // Update the columns to use proper typing
  const columns = [
    {
      header: (
        <div 
          className="flex items-center cursor-pointer" 
          onClick={() => handleSort('created_at')}
        >
          Date {getSortIcon('created_at')}
        </div>
      ),
      accessor: (lead: ValuationWithCondition) => lead.created_at,
      cell: (lead: ValuationWithCondition) => format(new Date(lead.created_at), 'MMM d')
    },
    {
      header: 'Vehicle',
      accessor: (lead: ValuationWithCondition) => 
        `${lead.year} ${lead.make} ${lead.model}`
    },
    {
      header: (
        <div 
          className="flex items-center cursor-pointer" 
          onClick={() => handleSort('estimated_value')}
        >
          Estimated Value {getSortIcon('estimated_value')}
        </div>
      ),
      accessor: (lead: ValuationWithCondition) => lead.estimated_value,
      cell: (lead: ValuationWithCondition) => `$${lead.estimated_value.toLocaleString()}`
    },
    {
      header: (
        <div 
          className="flex items-center cursor-pointer" 
          onClick={() => handleSort('condition_score')}
        >
          Condition {getSortIcon('condition_score')}
        </div>
      ),
      accessor: (lead: ValuationWithCondition) => lead.condition_score,
      cell: (lead: ValuationWithCondition) => getConditionBadge(lead.condition_score)
    },
    {
      header: 'Actions',
      accessor: (lead: ValuationWithCondition) => lead.id,
      cell: (lead: ValuationWithCondition) => (
        <div className="flex gap-2">
          <CDButton 
            variant="primary" 
            size="sm"
            onClick={() => {
              setSelectedLead(lead);
              setIsOfferModalOpen(true);
            }}
          >
            Make Offer
          </CDButton>
          <CDButton 
            variant="outline" 
            size="sm"
          >
            Details
          </CDButton>
        </div>
      )
    }
  ];

  const handleMakeOffer = (amount: number, message: string) => {
    if (selectedLead) {
      onMakeOffer(selectedLead.id, amount, message);
      setIsOfferModalOpen(false);
      setSelectedLead(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <CDTable
        columns={columns}
        data={sortedLeads}
        isLoading={isLoading}
        emptyState={<div className="text-center py-8">No leads available</div>}
      />
      
      {selectedLead && (
        <OfferModal
          isOpen={isOfferModalOpen}
          onClose={() => setIsOfferModalOpen(false)}
          lead={selectedLead}
          onSubmit={handleMakeOffer}
        />
      )}
    </div>
  );
}
