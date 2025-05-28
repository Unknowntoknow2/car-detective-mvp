
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SigninForm } from '@/components/auth/forms/SigninForm';
import { SignupForm } from '@/components/auth/forms/SignupForm';
import { ArrowLeft, User } from 'lucide-react';

const IndividualAuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('signin');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/auth" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Auth Options
          </Link>
          <div className="flex items-center justify-center mb-4">
            <User className="h-8 w-8 text-primary mr-2" />
            <h2 className="text-3xl font-extrabold text-gray-900">Individual Account</h2>
          </div>
          <p className="text-sm text-gray-600">
            Access car valuations and vehicle history
          </p>
        </div>

        <Card>
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Welcome back! Sign in to your individual account
                </CardDescription>
              </TabsContent>
              
              <TabsContent value="signup">
                <CardTitle>Create Individual Account</CardTitle>
                <CardDescription>
                  Join thousands of car enthusiasts and dealers
                </CardDescription>
              </TabsContent>
            </Tabs>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="signin">
                <SigninForm 
                  userType="individual"
                  redirectPath="/dashboard"
                />
              </TabsContent>
              
              <TabsContent value="signup">
                <SignupForm 
                  userType="individual"
                  redirectPath="/dashboard"
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
};

export default IndividualAuthPage;
