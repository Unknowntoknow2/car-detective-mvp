
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RegisterPage from './RegisterPage';
import DealerSignupPage from './DealerSignupPage';
import { Loader2 } from 'lucide-react';

export default function SignupPage() {
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

  // Return the appropriate signup page based on role
  return role === 'dealer' ? <DealerSignupPage /> : <RegisterPage />;
}
