
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, BarChart3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const DealerDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Skeleton className="h-10 w-full sm:w-40" />
            <Skeleton className="h-10 w-full sm:w-40" />
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Valuations</CardTitle>
              <CardDescription>Customer valuations in your area</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>No recent valuations found</p>
                <p className="text-sm mt-2">Valuations from your area will appear here</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">View All Valuations</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Incoming Leads</CardTitle>
              <CardDescription>Potential customers interested in offers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>No active leads at the moment</p>
                <p className="text-sm mt-2">New customer leads will appear here</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Manage Leads</Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="bg-slate-50 rounded-xl p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Respond to Lead
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              View Valuations
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealerDashboard;
