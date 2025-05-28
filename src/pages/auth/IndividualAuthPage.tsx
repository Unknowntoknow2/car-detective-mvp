
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SEO } from '@/components/layout/seo';
import { SigninForm } from '@/components/auth/forms/SigninForm';
import { SignupForm } from '@/components/auth/forms/SignupForm';

export default function IndividualAuthPage() {
  const [activeTab, setActiveTab] = useState('signin');

  return (
    <div className="container mx-auto max-w-md py-12">
      <SEO title="Individual Account" description="Sign in or create an individual account" />
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Individual Account</h1>
          <p className="text-muted-foreground mt-2">Sign in or create an individual account</p>
        </div>
        
        <Tabs defaultValue="signin" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Create Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <SigninForm userType="individual" />
          </TabsContent>
          
          <TabsContent value="signup">
            <SignupForm userType="individual" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
