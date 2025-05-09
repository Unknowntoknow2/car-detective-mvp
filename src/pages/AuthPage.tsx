
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LoginForm } from '@/components/auth/forms/LoginForm';
import { SignupForm } from '@/components/auth/forms/SignupForm';
import { useAuth } from '@/contexts/AuthContext';

const AuthPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth?.() || {};
  const [isLoading, setIsLoading] = useState(false);
  
  // Redirect already logged in users
  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="container mx-auto py-10 px-4 flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md">
        <Card className="border-2">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
            <CardDescription>
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <LoginForm isLoading={isLoading} setIsLoading={setIsLoading} />
              </TabsContent>
              
              <TabsContent value="signup">
                <SignupForm isLoading={isLoading} setIsLoading={setIsLoading} />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t pt-4">
            <div className="text-sm text-center text-muted-foreground">
              Interested in our premium features?
            </div>
            <Button variant="outline" asChild className="w-full">
              <Link to="/premium">View Premium Features</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
