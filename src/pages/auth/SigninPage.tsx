
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoginUserPage from './LoginUserPage';
import LoginDealerPage from './LoginDealerPage';
import { Loader2 } from 'lucide-react';

export default function SigninPage() {
  const { role } = useParams<{ role?: string }>();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If no role specified, redirect to auth page
    if (!role) {
      navigate('/auth');
    }
    // Validate role parameter
    else if (role !== 'individual' && role !== 'dealer') {
      navigate('/auth');
    }
  }, [role, navigate]);

  // Show loading while checking role
  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Return the appropriate login page based on role
  return role === 'dealer' ? <LoginDealerPage /> : <LoginUserPage />;
}
