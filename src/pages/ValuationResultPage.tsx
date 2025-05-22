
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { ValuationResult } from '@/components/valuation/result';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PremiumUpgradeCTA } from '@/components/premium/PremiumUpgradeCTA';
import { toast } from 'sonner';

const ValuationResultPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [valuationData, setValuationData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  
  // Check if coming from premium purchase
  const searchParams = new URLSearchParams(location.search);
  const premiumParam = searchParams.get('premium');
  
  useEffect(() => {
    const fetchValuation = async () => {
      if (!id) {
        setError('No valuation ID provided');
        setIsLoading(false);
        return;
      }
      
      try {
        // Get the valuation data
        const { data: valuation, error: valuationError } = await supabase
          .from('valuations')
          .select('*')
          .eq('id', id)
          .single();
        
        if (valuationError) throw valuationError;
        
        if (!valuation) {
          throw new Error('Valuation not found');
        }
        
        // Check if this valuation has premium access
        const { data: premiumValuation, error: premiumError } = await supabase
          .from('premium_valuations')
          .select('*')
          .eq('valuation_id', id)
          .maybeSingle();
        
        // Set premium flag if either the valuation itself is marked premium or we have a premium_valuations entry
        setIsPremium(valuation.premium_unlocked || !!premiumValuation);
        
        // If premium param is set, check premium status
        if (premiumParam === '1' && !isPremium) {
          // This should trigger premium access check 
          const { data: currentUser } = await supabase.auth.getUser();
          
          if (currentUser.user) {
            // Check if user has premium access
            const { data: premiumAccess, error: accessError } = await supabase
              .from('premium_access')
              .select('*')
              .eq('user_id', currentUser.user.id)
              .order('updated_at', { ascending: false })
              .limit(1)
              .maybeSingle();
              
            if (!accessError && premiumAccess && premiumAccess.credits_remaining > 0) {
              // Use a premium credit
              const { data: useCredit, error: creditError } = await supabase.functions.invoke('use-premium-credit', {
                body: { valuation_id: id }
              });
              
              if (!creditError && useCredit && useCredit.success) {
                setIsPremium(true);
                toast.success('Premium report unlocked!');
              }
            }
          }
        }
        
        // Format the data
        const formattedValuation = {
          ...valuation,
          estimatedValue: valuation.estimated_value,
          confidenceScore: valuation.confidence_score,
          isPremium
        };
        
        setValuationData(formattedValuation);
      } catch (err) {
        console.error('Error fetching valuation:', err);
        setError(err instanceof Error ? err.message : 'Failed to load valuation');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchValuation();
  }, [id, isPremium, premiumParam]);
  
  const handleUpgrade = () => {
    // Show the premium upgrade CTA or redirect to premium page
    navigate(`/premium?valuation=${id}`);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 space-y-6">
        <h1 className="text-2xl font-bold mb-2">Valuation Results</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <Card className="p-6 bg-red-50 text-red-700">
            <p className="font-semibold">Error loading valuation</p>
            <p className="text-sm">{error}</p>
          </Card>
        ) : (
          <>
            {!isPremium && (
              <PremiumUpgradeCTA valuationId={id} />
            )}
            
            <Card className="p-6">
              <ValuationResult 
                valuationId={id} 
                data={valuationData}
                isPremium={isPremium}
                onUpgrade={handleUpgrade}
              />
            </Card>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default ValuationResultPage;
