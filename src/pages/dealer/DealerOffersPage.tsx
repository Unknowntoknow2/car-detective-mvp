
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DealerOffersList } from '@/components/dealer/DealerOffersList';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

export default function DealerOffersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [valuations, setValuations] = useState<Array<{id: string, make: string, model: string, year: number}>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchValuations = async () => {
      try {
        // For dealers, fetch valuations they've made offers on
        if (await isDealerUser()) {
          const { data, error } = await supabase
            .from('dealer_offers')
            .select('report_id')
            .eq('dealer_id', user.id)
            .order('created_at', { ascending: false });
            
          if (error) throw error;
          
          // Get unique report IDs
          const uniqueReportIds = [...new Set(data.map(item => item.report_id))];
          
          if (uniqueReportIds.length > 0) {
            // Fetch valuation details
            const { data: valuationData, error: valuationError } = await supabase
              .from('valuations')
              .select('id, make, model, year')
              .in('id', uniqueReportIds);
              
            if (valuationError) throw valuationError;
            
            setValuations(valuationData || []);
            if (valuationData?.length > 0) {
              setActiveTab(valuationData[0].id);
            }
          }
        } 
        // For regular users, fetch their valuations
        else {
          const { data, error } = await supabase
            .from('valuations')
            .select('id, make, model, year')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
            
          if (error) throw error;
          
          setValuations(data || []);
          if (data?.length > 0) {
            setActiveTab(data[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching valuations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchValuations();
  }, [user, navigate]);

  // Helper function to check if the current user is a dealer
  const isDealerUser = async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase
        .from('dealers')
        .select('verified')
        .eq('id', user.id)
        .single();
        
      if (error) return false;
      return data?.verified || false;
    } catch {
      return false;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto py-8 px-4 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading your offers...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Dealer Offers Dashboard</h1>
        
        {valuations.length === 0 ? (
          <Card className="p-6">
            <CardTitle className="mb-4">No Vehicle Valuations Found</CardTitle>
            <CardContent className="pt-0">
              <p className="text-muted-foreground">
                You don't have any vehicle valuations in the system. Create a valuation first to receive dealer offers.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Tabs value={activeTab || undefined} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 flex-wrap h-auto py-2">
              {valuations.map(valuation => (
                <TabsTrigger key={valuation.id} value={valuation.id} className="mb-1">
                  {valuation.year} {valuation.make} {valuation.model}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {valuations.map(valuation => (
              <TabsContent key={valuation.id} value={valuation.id}>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Offers for {valuation.year} {valuation.make} {valuation.model}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DealerOffersList 
                      reportId={valuation.id} 
                      showActions={true} 
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </main>
      <Footer />
    </div>
  );
}
