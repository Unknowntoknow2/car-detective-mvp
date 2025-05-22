
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SigninForm } from '@/components/auth/forms/SigninForm';
import { SignupForm } from '@/components/auth/forms/SignupForm';
import { Building, User } from 'lucide-react';

const AuthPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-12 flex justify-center">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Welcome to Car Detective</h1>
        
        <Tabs defaultValue="sign-in" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="sign-in">Sign In</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sign-in">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Access your account to view your valuations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SigninForm isLoading={isLoading} setIsLoading={setIsLoading} />
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 border-t pt-4">
                <div className="flex flex-col space-y-2 w-full">
                  <Button 
                    variant="outline" 
                    className="flex items-center justify-between"
                    onClick={() => navigate('/signin/individual')}
                  >
                    <span>Sign in as Individual</span>
                    <User className="h-4 w-4 ml-2" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="flex items-center justify-between"
                    onClick={() => navigate('/signin/dealer')}
                  >
                    <span>Sign in as Dealer</span>
                    <Building className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="register">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Create an Account</CardTitle>
                <CardDescription>
                  Register to get started with Car Detective
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SignupForm isLoading={isLoading} setIsLoading={setIsLoading} />
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 border-t pt-4">
                <div className="flex flex-col space-y-2 w-full">
                  <Button 
                    variant="outline" 
                    className="flex items-center justify-between"
                    onClick={() => navigate('/signup/individual')}
                  >
                    <span>Register as Individual</span>
                    <User className="h-4 w-4 ml-2" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="flex items-center justify-between"
                    onClick={() => navigate('/signup/dealer')}
                  >
                    <span>Register as Dealer</span>
                    <Building className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthPage;
