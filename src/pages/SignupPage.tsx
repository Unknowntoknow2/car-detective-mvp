
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { User, Building } from "lucide-react";
import { SignupForm } from '@/components/auth/forms/SignupForm';
import { DealerSignupForm } from '@/components/dealer/DealerSignupForm';
import { useAuth } from '@/hooks/useAuth';
import { DEBUG_MODE } from '@/lib/constants';

export default function SignupPage() {
  const [activeTab, setActiveTab] = useState<string>("individual");
  const { user } = useAuth();
  
  // If user is already logged in, redirect to appropriate dashboard
  if (user && !DEBUG_MODE) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Toaster position="top-center" richColors />
      
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground mt-2">
            Sign up to get accurate vehicle valuations
          </p>
        </div>
        
        <Card className="w-full shadow-sm">
          <CardHeader className="space-y-1 pb-2">
            <Tabs defaultValue="individual" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="individual" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Individual</span>
                </TabsTrigger>
                <TabsTrigger value="dealer" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span>Dealer</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          
          <CardContent className="pt-4">
            <TabsContent value="individual" className="mt-0">
              <CardDescription className="mb-4">
                Sign up as an individual to value your vehicle
              </CardDescription>
              <SignupForm role="individual" redirectPath="/dashboard" />
            </TabsContent>
            
            <TabsContent value="dealer" className="mt-0">
              <CardDescription className="mb-4">
                Register your dealership for enhanced features
              </CardDescription>
              <DealerSignupForm />
            </TabsContent>
          </CardContent>
          
          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
