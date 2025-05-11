
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LeadsList } from '@/components/dealer/LeadsList';
import { DealerOffersTracker } from '@/components/dealer/DealerOffersTracker';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';

const DealerDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<any[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('leads');

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, user_role, dealership_name')
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
        const { data, error } = await supabase
          .from('valuations')
          .select('*')
          .limit(10)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setLeads(data || []);
      } catch (err) {
        console.error('Error fetching leads:', err);
      } finally {
        setLeadsLoading(false);
      }
    };
    
    fetchLeads();
  }, [user]);

  if (loading) {
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
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome, {profile?.full_name || 'Dealer'}</h1>
          <p className="text-muted-foreground text-lg">
            Dealership: {profile?.dealership_name || 'Your Dealership'}
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="leads">Customer Leads</TabsTrigger>
            <TabsTrigger value="offers">Your Offers</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="leads">
            <Card>
              <CardHeader>
                <CardTitle>Available Leads</CardTitle>
                <CardDescription>Customers looking for offers on their vehicles</CardDescription>
              </CardHeader>
              <CardContent>
                <LeadsList leads={leads} isLoading={leadsLoading} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="offers">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DealerOffersTracker dealerId={user?.id || ''} />
              
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
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>Track your offer conversion metrics</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Analytics dashboard coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DealerDashboard;
