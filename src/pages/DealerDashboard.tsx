
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function DealerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dealerProfile, setDealerProfile] = useState<{
    full_name: string;
    dealership_name: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDealerProfile = async () => {
      if (!user) {
        navigate('/login-dealer');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, user_role, dealership_name')
          .eq('id', user.id)
          .single();

        // Handle database errors
        if (error) {
          console.error('Database error:', error);
          
          // Handle missing column error specifically
          if (error.message.includes("column 'dealership_name' does not exist")) {
            toast.error('Database setup error: Missing dealership_name column in profiles table.');
            navigate('/');
            return;
          } else {
            toast.error('Could not load profile.');
            navigate('/');
            return;
          }
        }

        if (!data) {
          toast.error('Could not load profile.');
          navigate('/');
          return;
        }

        // Access properties on data object, not error
        // Safe to check user_role now because we know data exists and error is null
        if (data.user_role !== 'dealer') {
          toast.error('Access denied — Dealer only.');
          navigate('/dashboard');
          return;
        }

        setDealerProfile({
          full_name: data.full_name,
          dealership_name: data.dealership_name,
        });
      } catch (error: any) {
        console.error('Error fetching dealer profile:', error);
        toast.error(error.message || 'Could not load profile.');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDealerProfile();
  }, [user, navigate]);

  if (isLoading || !dealerProfile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto mt-8 space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
            <Skeleton className="h-48" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto mt-8 space-y-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">
              Welcome, {dealerProfile.full_name}
            </h1>
            <p className="text-muted-foreground">
              Dealership: {dealerProfile.dealership_name}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Valuations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No recent valuations yet.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Incoming Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No leads available yet.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="w-full bg-primary text-white py-2 rounded">
                Respond to Lead
              </button>
              <button className="w-full bg-secondary text-black py-2 rounded">
                View Valuations
              </button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
