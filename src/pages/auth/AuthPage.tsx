
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SigninForm } from '@/components/auth/forms/SigninForm';
import { SignupForm } from '@/components/auth/forms/SignupForm';
import { Building, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [userType, setUserType] = useState<'individual' | 'dealer'>('individual');
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // If user is already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome to Car Detective
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {activeTab === 'signin' ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex space-x-1 mb-4">
              <Button
                variant={userType === 'individual' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUserType('individual')}
                className="flex-1"
              >
                <User className="h-4 w-4 mr-2" />
                Individual
              </Button>
              <Button
                variant={userType === 'dealer' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUserType('dealer')}
                className="flex-1"
              >
                <Building className="h-4 w-4 mr-2" />
                Dealer
              </Button>
            </div>
            
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'signin' | 'signup')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </TabsContent>
              
              <TabsContent value="signup">
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  Sign up for a new {userType} account
                </CardDescription>
              </TabsContent>
            </Tabs>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'signin' | 'signup')}>
              <TabsContent value="signin">
                <SigninForm 
                  userType={userType}
                  redirectPath={userType === 'dealer' ? '/dealer/dashboard' : '/dashboard'}
                />
              </TabsContent>
              
              <TabsContent value="signup">
                <SignupForm 
                  userType={userType}
                  showDealershipField={userType === 'dealer'}
                  redirectPath={userType === 'dealer' ? '/dealer/dashboard' : '/dashboard'}
                />
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 text-center text-sm text-gray-500">
              {activeTab === 'signin' ? (
                <p>
                  Don't have an account?{' '}
                  <button
                    onClick={() => setActiveTab('signup')}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign up
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button
                    onClick={() => setActiveTab('signin')}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
