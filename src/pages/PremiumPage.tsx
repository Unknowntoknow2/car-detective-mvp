
import { ManualEntryForm } from '@/components/lookup/ManualEntryForm';
import { useNavigate } from 'react-router-dom';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';
import { toast } from 'sonner';

export default function PremiumPage() {
  const navigate = useNavigate();

  const handlePremiumSubmit = async (data: ManualEntryFormData) => {
    try {
      const response = await fetch("/functions/car-price-prediction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          includeCarfax: true
        })
      });
      
      const result = await response.json();
      if (result?.id) {
        navigate(`/valuation/${result.id}`);
      } else {
        throw new Error('Failed to get valuation ID');
      }
    } catch (error) {
      toast.error('Failed to get premium valuation');
    }
  };

  return (
    <main className="bg-white text-gray-800 min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-2">Premium Vehicle Valuation</h2>
        <p className="text-sm text-gray-600 mb-6">
          This includes a full CARFAX® report, future price forecasts, dealer offers, and premium market insights.
        </p>

        <ManualEntryForm 
          onSubmit={handlePremiumSubmit}
          submitButtonText="Get Premium Valuation with CARFAX"
        />
      </div>
    </main>
  );
}
