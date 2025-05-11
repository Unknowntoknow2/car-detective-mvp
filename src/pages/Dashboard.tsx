
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FileText, Download } from 'lucide-react';

// Define the user profile type
interface UserProfile {
  full_name: string;
  user_role?: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, user_role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          toast.error('Could not load profile');
          navigate('/');
          return;
        }

        if (!data) {
          toast.error('Could not load profile');
          navigate('/');
          return;
        }

        // Check if user is a dealer - if so, redirect them to dealer dashboard
        if (data.user_role === 'dealer') {
          toast.info('Redirecting to dealer dashboard');
          navigate('/dealer-dashboard');
          return;
        }

        setUserProfile({
          full_name: data.full_name || 'User',
          user_role: data.user_role
        });
      } catch (error: any) {
        console.error('Error fetching user profile:', error);
        toast.error(error.message || 'Could not load profile');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, navigate]);

  if (isLoading || !userProfile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto mt-8 space-y-6">
            <Skeleton className="h-8 w-2/4" />
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
              Welcome back, {userProfile.full_name}
            </h1>
            <p className="text-muted-foreground">
              Your vehicle valuations and reports
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Saved Valuations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No saved valuations yet.
                </p>
                <Button 
                  className="mt-4 w-full"
                  onClick={() => navigate('/valuation')}
                >
                  Get New Valuation
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>My Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No reports available yet.
                </p>
                <Button 
                  className="mt-4 w-full"
                  onClick={() => navigate('/my-valuations')}
                >
                  View All Reports
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Premium Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2 rounded"
                onClick={() => navigate('/premium')}
              >
                <FileText size={18} />
                <span>View Premium Report</span>
              </Button>
              <Button 
                className="w-full flex items-center justify-center gap-2 bg-secondary text-primary py-2 rounded"
                variant="outline"
              >
                <Download size={18} />
                <span>Download PDF</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
