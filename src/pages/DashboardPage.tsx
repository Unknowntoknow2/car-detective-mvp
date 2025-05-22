
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, userRole, userDetails, isLoading } = useAuth();
  const [isPageLoading, setIsPageLoading] = React.useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate('/auth');
        return;
      }

      // Determine the role from various sources, prioritizing userRole and userDetails
      const detectedRole = userRole || userDetails?.role || user.user_metadata?.role || 'individual';
      
      console.log('Detected role:', detectedRole);
      
      // Redirect based on role
      if (detectedRole === 'dealer') {
        navigate('/dealer-dashboard');
      } else if (detectedRole === 'individual') {
        navigate('/user-dashboard');
      } else {
        // Default fallback - stay on this page and render content
        setIsPageLoading(false);
      }
    }
  }, [user, userRole, userDetails, isLoading, navigate]);
  
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
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p>Welcome to your dashboard. Your content will appear here.</p>
    </div>
  );
};

export default DashboardPage;
