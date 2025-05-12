
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LeadsList } from '@/components/dealer/LeadsList';
import { DealerOffersTracker } from '@/components/dealer/DealerOffersTracker';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { PremiumDealerBadge } from '@/components/dealer/PremiumDealerBadge';
import { usePremiumDealer } from '@/hooks/usePremiumDealer';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BadgeCheck, Info, TrendingUp, Star } from 'lucide-react';

const DealerDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<any[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('leads');
  const { isPremium, isLoading: premiumLoading } = usePremiumDealer();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, user_role, dealership_name, is_premium_dealer')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [user]);

  useEffect(() => {
    const fetchLeads = async () => {
      if (!user) return;
      
      try {
        setLeadsLoading(true);
        // For demo purposes, we'll use valuations table directly
        // In production, you would probably have a dealer_leads table
        let query = supabase
          .from('valuations')
          .select('*')
          .limit(10)
          .order('created_at', { ascending: false });
          
        // If premium dealer, add priority filter logic here
        // This is just a placeholder - actual implementation would depend on your business logic
        if (isPremium) {
          // Example: premium dealers might see higher-value leads first
          query = query.order('estimated_value', { ascending: false });
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        setLeads(data || []);
      } catch (err) {
        console.error('Error fetching leads:', err);
      } finally {
        setLeadsLoading(false);
      }
    };
    
    fetchLeads();
  }, [user, isPremium]);

  if (loading || premiumLoading) {
    return (
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4 mb-2" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome, {profile?.full_name || 'Dealer'}</h1>
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground text-lg">
                Dealership: {profile?.dealership_name || 'Your Dealership'}
              </p>
              {isPremium && <PremiumDealerBadge />}
            </div>
          </div>
          
          {!isPremium && (
            <Button variant="outline" className="border-amber-300 text-amber-800 hover:bg-amber-100">
              <Star className="h-4 w-4 mr-2 fill-amber-500 text-amber-500" />
              Upgrade to Premium
            </Button>
          )}
        </div>
        
        {isPremium && (
          <Card className="bg-amber-50 border-amber-200">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-amber-800">
                <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                Premium Dealer Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-2">
                  <TrendingUp className="h-5 w-5 text-amber-700 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-900">Priority Leads</p>
                    <p className="text-sm text-amber-700">See high-value leads first</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <BadgeCheck className="h-5 w-5 text-amber-700 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-900">Featured Badge</p>
                    <p className="text-sm text-amber-700">Higher visibility to customers</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-amber-700 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-900">Advanced Analytics</p>
                    <p className="text-sm text-amber-700">Track performance metrics</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="leads">Customer Leads</TabsTrigger>
            <TabsTrigger value="offers">Your Offers</TabsTrigger>
            {isPremium && <TabsTrigger value="analytics">Analytics</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="leads">
            <Card>
              <CardHeader>
                <CardTitle>Available Leads</CardTitle>
                <CardDescription>Customers looking for offers on their vehicles</CardDescription>
              </CardHeader>
              <CardContent>
                <LeadsList leads={leads} isLoading={leadsLoading} isPremium={isPremium} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="offers">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DealerOffersTracker />
              
              <Card>
                <CardHeader>
                  <CardTitle>Offer Best Practices</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Quick Response</h3>
                    <p className="text-sm text-muted-foreground">
                      Respond to leads within 24 hours to maximize engagement.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Fair Pricing</h3>
                    <p className="text-sm text-muted-foreground">
                      Aim for offers at 90-95% of market value for excellent condition vehicles.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Detailed Notes</h3>
                    <p className="text-sm text-muted-foreground">
                      Include specifics about why your offer provides value to the customer.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {isPremium && (
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Analytics</CardTitle>
                  <CardDescription>Track your offer conversion metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="text-sm text-slate-500 mb-1">Offer Acceptance Rate</p>
                      <p className="text-2xl font-bold">43%</p>
                      <p className="text-xs text-green-600">↑ 5% from last month</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="text-sm text-slate-500 mb-1">Avg Response Time</p>
                      <p className="text-2xl font-bold">6.2 hrs</p>
                      <p className="text-xs text-red-600">↓ 1.3 hrs from last month</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="text-sm text-slate-500 mb-1">Completed Deals</p>
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-xs text-green-600">↑ 3 from last month</p>
                    </div>
                  </div>
                  
                  <div className="h-[200px] flex items-center justify-center bg-slate-50 rounded-lg">
                    <p className="text-muted-foreground">Detailed analytics charts coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default DealerDashboard;
