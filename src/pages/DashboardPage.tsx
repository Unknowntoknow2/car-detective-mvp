
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, userDetails, isLoading } = useAuth();
  const [isPageLoading, setIsPageLoading] = React.useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate('/auth');
        return;
      }

      // Determine the role and redirect accordingly
      const role = userDetails?.role || 'individual';
      console.log('User role in dashboard:', role);
      
      if (role === 'dealer') {
        navigate('/dealer/dashboard');
      } else {
        // For individual users, stay on this page and load content
        setIsPageLoading(false);
      }
    }
  }, [user, userDetails, isLoading, navigate]);
  
  if (isLoading || isPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <h2 className="text-xl font-semibold mt-4">Loading your dashboard</h2>
          <p className="text-muted-foreground mt-1">Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">Individual Dashboard</h1>
      <p>Welcome to your personal dashboard. Your vehicles and valuations will appear here.</p>
    </div>
  );
};

export default DashboardPage;
