
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SEO } from '@/components/layout/seo';
import { SigninForm } from '@/components/auth/forms/SigninForm';
import { SignupForm } from '@/components/auth/forms/SignupForm';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function DealerAuthPage() {
  const [activeTab, setActiveTab] = useState('signin');
  const { user, userDetails, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated dealers to dashboard
  useEffect(() => {
    if (!isLoading && user && userDetails?.role === 'dealer') {
      console.log('Dealer authenticated, redirecting to dashboard');
      navigate('/dealer/dashboard', { replace: true });
    }
  }, [user, userDetails, isLoading, navigate]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-md py-12 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render the auth form if user is already authenticated as dealer
  if (user && userDetails?.role === 'dealer') {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto max-w-md py-12">
      <SEO title="Dealer Account" description="Sign in or register your dealership" />
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Dealer Account</h1>
          <p className="text-muted-foreground mt-2">Sign in or register your dealership</p>
        </div>
        
        <Tabs defaultValue="signin" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Register Dealership</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <SigninForm userType="dealer" redirectPath="/dealer/dashboard" />
          </TabsContent>
          
          <TabsContent value="signup">
            <SignupForm userType="dealer" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
