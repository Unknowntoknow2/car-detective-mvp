
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const DashboardRouter: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user, userDetails } = useAuth();

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        // Check if the user is authenticated
        if (!user) {
          console.log('No authenticated user found');
          navigate('/auth');
          return;
        }

        // Get the user's role from context or metadata
        const role = userDetails?.role || user.user_metadata?.role;
        
        console.log('User role detected:', role);

        // Route based on role
        switch (role) {
          case 'dealer':
            navigate('/dealer/dashboard');
            break;
          case 'admin':
            navigate('/admin/dashboard');
            break;
          default:
            // For individual users, show the individual dashboard
            // Use the same URL to avoid unnecessary redirects
            setIsLoading(false);
            break;
        }
      } catch (err) {
        console.error('Error checking user role:', err);
        toast.error("Failed to load dashboard. Please try again.");
        navigate('/auth');
      } finally {
        setIsLoading(false);
      }
    };

    checkUserRole();
  }, [navigate, user, userDetails]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <h2 className="text-xl font-semibold mt-4">Loading dashboard</h2>
          <p className="text-muted-foreground mt-1">Please wait...</p>
        </div>
      </div>
    );
  }

  // If we got here and not redirected, we should show the individual dashboard
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg shadow-sm p-6 border">
          <h2 className="text-xl font-semibold mb-4">Recent Valuations</h2>
          <p className="text-muted-foreground">You haven't created any valuations yet.</p>
          <button 
            onClick={() => navigate('/valuation')}
            className="mt-4 w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition"
          >
            Get a Valuation
          </button>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm p-6 border">
          <h2 className="text-xl font-semibold mb-4">My Vehicles</h2>
          <p className="text-muted-foreground">No vehicles added to your account yet.</p>
          <button 
            onClick={() => navigate('/vin-lookup')}
            className="mt-4 w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition"
          >
            Add a Vehicle
          </button>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm p-6 border">
          <h2 className="text-xl font-semibold mb-4">Account</h2>
          <p className="text-muted-foreground">Manage your profile and settings.</p>
          <button 
            onClick={() => navigate('/profile')}
            className="mt-4 w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardRouter;
