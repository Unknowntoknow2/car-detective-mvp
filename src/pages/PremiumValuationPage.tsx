import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';

export default function PremiumValuationPage() {
  const { id: valuationId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [valuation, setValuation] = useState<any>(null);
  const [isLoadingValuation, setIsLoadingValuation] = useState(true);
  const { hasPremiumAccess, isLoading, creditsRemaining, usePremiumCredit } = usePremiumAccess(valuationId);
  
  useEffect(() => {
    const fetchValuation = async () => {
      if (!valuationId) return;
      
      try {
        setIsLoadingValuation(true);
        const { data, error } = await supabase
          .from('valuations')
          .select('*')
          .eq('id', valuationId)
          .maybeSingle();
          
        if (error) throw error;
        setValuation(data);
      } catch (error) {
        console.error('Error fetching valuation:', error);
        toast({
          title: "Error loading valuation",
          description: "Could not load valuation details.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingValuation(false);
      }
    };
    
    fetchValuation();
  }, [valuationId]);
  
  const handleUsePremiumCredit = async () => {
    if (!valuationId) return;
    
    const success = await usePremiumCredit(valuationId);
    
    if (success) {
      toast({
        title: "Premium access granted!",
        description: "You now have premium access to this valuation.",
        variant: "success",
      });
      // Reload the page to show premium content
      window.location.reload();
    } else {
      toast({
        title: "Error activating premium",
        description: creditsRemaining > 0 
          ? "Failed to use premium credit. Please try again." 
          : "You don't have any premium credits available.",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading || isLoadingValuation) {
    return (
      <MainLayout>
        <Container className="py-12">
          <div className="flex justify-center items-center min-h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </Container>
      </MainLayout>
    );
  }
  
  if (!valuation) {
    return (
      <MainLayout>
        <Container className="py-12">
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Valuation Not Found</h2>
                <p className="text-muted-foreground mb-6">
                  We couldn't find the valuation you're looking for.
                </p>
                <Button onClick={() => navigate('/')}>Return Home</Button>
              </div>
            </CardContent>
          </Card>
        </Container>
      </MainLayout>
    );
  }
  
  if (!hasPremiumAccess) {
    return (
      <MainLayout>
        <Container className="py-12">
          <Card>
            <CardHeader>
              <CardTitle>Premium Access Required</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6">
                This valuation requires premium access. Unlock premium features to view detailed analysis and reports.
              </p>
              
              {creditsRemaining > 0 ? (
                <div className="space-y-4">
                  <div className="bg-primary/10 p-4 rounded-md">
                    <p className="font-medium">
                      You have {creditsRemaining} premium credit{creditsRemaining !== 1 ? 's' : ''} available!
                    </p>
                  </div>
                  <Button onClick={handleUsePremiumCredit}>
                    Use 1 Credit to Unlock
                  </Button>
                </div>
              ) : (
                <Button onClick={() => navigate(`/premium-checkout?id=${valuationId}`)}>
                  Upgrade to Premium
                </Button>
              )}
            </CardContent>
          </Card>
        </Container>
      </MainLayout>
    );
  }
  
  // Premium content display would go here
  return (
    <MainLayout>
      <Container className="py-12">
        <Card>
          <CardHeader>
            <CardTitle>Premium Valuation Report</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Premium content for valuation {valuation.id}</p>
            {/* Render premium valuation content here */}
          </CardContent>
        </Card>
      </Container>
    </MainLayout>
  );
}
