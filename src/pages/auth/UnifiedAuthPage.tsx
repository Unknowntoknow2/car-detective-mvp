
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SigninForm } from '@/components/auth/forms/SigninForm';
import { SignupForm } from '@/components/auth/forms/SignupForm';
import { Building, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { SEO } from '@/components/layout/seo';

export default function UnifiedAuthPage() {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [userType, setUserType] = useState<'individual' | 'dealer'>('individual');
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || 
                 (userType === 'dealer' ? '/dealer/dashboard' : '/dashboard');
      navigate(from, { replace: true });
    }
  }, [user, navigate, location, userType]);
  
  return (
    <div className="container mx-auto py-12 px-4">
      <SEO title="Authentication" description="Sign in or create an account" />
      
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Welcome to Car Detective</h1>
          <p className="text-muted-foreground mt-2">
            {activeTab === 'signin' ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                {userType === 'individual' ? 'Individual' : 'Dealer'} {activeTab === 'signin' ? 'Sign In' : 'Registration'}
              </CardTitle>
              <div 
                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  userType === 'individual' ? 'bg-primary/10' : 'bg-blue-100'
                }`}
              >
                {userType === 'individual' ? (
                  <User className="h-5 w-5 text-primary" />
                ) : (
                  <Building className="h-5 w-5 text-blue-600" />
                )}
              </div>
            </div>
            <CardDescription>
              {userType === 'individual' 
                ? 'Access your personal account and valuations' 
                : 'Dealer tools and business features'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex space-x-2 mb-4">
              <button
                className={`flex-1 py-2 rounded-md ${
                  userType === 'individual' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}
                onClick={() => setUserType('individual')}
              >
                <User className="h-4 w-4 inline mr-2" />
                Individual
              </button>
              <button
                className={`flex-1 py-2 rounded-md ${
                  userType === 'dealer' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-muted text-muted-foreground'
                }`}
                onClick={() => setUserType('dealer')}
              >
                <Building className="h-4 w-4 inline mr-2" />
                Dealer
              </button>
            </div>
            
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'signin' | 'signup')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="mt-4">
                <SigninForm 
                  userType={userType}
                  redirectPath={userType === 'dealer' ? '/dealer/dashboard' : '/dashboard'} 
                />
              </TabsContent>
              
              <TabsContent value="signup" className="mt-4">
                <SignupForm 
                  userType={userType}
                  showDealershipField={userType === 'dealer'}
                  redirectPath={userType === 'dealer' ? '/dealer/dashboard' : '/dashboard'} 
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
