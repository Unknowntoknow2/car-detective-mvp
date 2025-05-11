
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Download } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        
        // Redirect dealer to dealer dashboard
        if (data?.user_role === 'dealer') {
          toast.info('Redirecting to dealer dashboard');
          navigate('/dealer-dashboard');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4 mb-4" />
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
          <h1 className="text-3xl font-bold mb-2">Welcome back, {profile?.full_name || 'User'}</h1>
          <p className="text-muted-foreground">Here's an overview of your vehicle valuations</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Saved Valuations</CardTitle>
              <CardDescription>Your recent vehicle valuation history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>No saved valuations yet</p>
                <p className="text-sm mt-2">Start by getting a free valuation for your vehicle</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => navigate('/free-valuation')}>
                Get New Valuation
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>My Reports</CardTitle>
              <CardDescription>Premium reports you've purchased</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>No premium reports yet</p>
                <p className="text-sm mt-2">Upgrade to premium for detailed vehicle analysis</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => navigate('/premium')}>
                Explore Premium
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="bg-slate-50 rounded-xl p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Premium Actions</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="flex items-center gap-2" onClick={() => navigate('/premium-valuation')}>
              <FileText className="h-4 w-4" />
              View Premium Report
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
