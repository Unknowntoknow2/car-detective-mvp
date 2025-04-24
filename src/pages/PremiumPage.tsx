
import { useState } from 'react';
import { ManualEntryForm } from '@/components/lookup/ManualEntryForm';
import { useNavigate } from 'react-router-dom';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';
import { toast } from 'sonner';

export default function PremiumPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePremiumSubmit = async (data: ManualEntryFormData) => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/functions/car-price-prediction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          includeCarfax: true
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result?.id) {
        navigate(`/valuation/${result.id}`);
      } else {
        throw new Error('Failed to get valuation ID');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Premium valuation error:', errorMessage);
      toast.error('Failed to get premium valuation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-white text-gray-800 min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-2">Premium Vehicle Valuation</h2>
        <p className="text-sm text-gray-600 mb-6">
          This includes a full CARFAX® report, future price forecasts, dealer offers, and premium market insights.
        </p>

        <div className="text-sm bg-yellow-100 text-yellow-700 p-4 rounded mb-6">
          Our premium valuation includes verified CARFAX® accident and vehicle history data for the most accurate valuation available.
        </div>

        <ManualEntryForm 
          onSubmit={handlePremiumSubmit}
          submitButtonText="Get Premium Valuation with CARFAX"
          isPremium={true}
          isLoading={isSubmitting}
        />
      </div>
    </main>
  );
}
