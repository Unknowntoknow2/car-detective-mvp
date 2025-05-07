
import React, { useState } from 'react';
import { CDButton } from '@/components/ui-kit/CDButton';
import { CDCard } from '@/components/ui-kit/CDCard';
import { ValuationWithCondition } from '@/types/dealer';

interface OfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: ValuationWithCondition;
  onSubmit: (amount: number, message: string) => void;
}

export function OfferModal({ isOpen, onClose, lead, onSubmit }: OfferModalProps) {
  const [amount, setAmount] = useState(Math.floor(lead.estimated_value * 0.9));
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(amount, message);
  };

  // Suggested amounts based on condition score
  const getSuggestedAmount = () => {
    if (lead.condition_score >= 85) return Math.floor(lead.estimated_value * 0.95);
    if (lead.condition_score >= 70) return Math.floor(lead.estimated_value * 0.9);
    if (lead.condition_score >= 50) return Math.floor(lead.estimated_value * 0.85);
    return Math.floor(lead.estimated_value * 0.8);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <CDCard className="w-full max-w-md">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Make an Offer</h2>
          
          <div className="mb-4">
            <h3 className="font-medium">
              {lead.year} {lead.make} {lead.model}
            </h3>
            <p className="text-gray-500">Estimated Value: ${lead.estimated_value.toLocaleString()}</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Your Offer Amount</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded"
                value={amount}
                onChange={e => setAmount(parseInt(e.target.value))}
                required
                min={1}
              />
              <p className="text-sm text-gray-500 mt-1">
                Suggested: ${getSuggestedAmount().toLocaleString()}
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Message (Optional)</label>
              <textarea
                className="w-full px-3 py-2 border rounded"
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={3}
                placeholder="Include any additional details about your offer..."
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <CDButton
                variant="secondary"
                type="button"
                onClick={onClose}
              >
                Cancel
              </CDButton>
              <CDButton
                variant="primary"
                type="submit"
              >
                Submit Offer
              </CDButton>
            </div>
          </form>
        </div>
      </CDCard>
    </div>
  );
}
