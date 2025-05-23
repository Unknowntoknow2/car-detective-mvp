
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SEO } from '@/components/layout/seo';
import { SigninForm } from '@/components/auth/forms/SigninForm';
import { SignupForm } from '@/components/auth/forms/SignupForm';

export default function DealerAuthPage() {
  const [activeTab, setActiveTab] = useState('signin');

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
            <SigninForm userType="dealer" />
          </TabsContent>
          
          <TabsContent value="signup">
            <SignupForm userType="dealer" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
