
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SigninForm } from '@/components/auth/forms/SigninForm';
import { DealerSignupForm } from '@/components/dealer/DealerSignupForm';
import { ArrowLeft, Building } from 'lucide-react';

const DealerAuthPage: React.FC = () => {
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
            <Building className="h-8 w-8 text-primary mr-2" />
            <h2 className="text-3xl font-extrabold text-gray-900">Dealer Account</h2>
          </div>
          <p className="text-sm text-gray-600">
            Advanced tools for automotive professionals
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
                <CardTitle>Dealer Sign In</CardTitle>
                <CardDescription>
                  Access your dealer dashboard and tools
                </CardDescription>
              </TabsContent>
              
              <TabsContent value="signup">
                <CardTitle>Register Dealership</CardTitle>
                <CardDescription>
                  Join our network of automotive professionals
                </CardDescription>
              </TabsContent>
            </Tabs>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="signin">
                <SigninForm 
                  userType="dealer"
                  redirectPath="/dealer/dashboard"
                />
              </TabsContent>
              
              <TabsContent value="signup">
                <DealerSignupForm />
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 text-center text-sm text-gray-500">
              {activeTab === 'signin' ? (
                <p>
                  Need a dealer account?{' '}
                  <button
                    onClick={() => setActiveTab('signup')}
                    className="text-primary hover:underline font-medium"
                  >
                    Register dealership
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

export default DealerAuthPage;
