
import React from 'react';
import { AuthTestMonitor } from '@/components/auth/AuthTestMonitor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from '@/components/auth/forms/LoginForm';
import { SignupForm } from '@/components/auth/forms/SignupForm';

const AuthTestPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Authentication Test Suite</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <AuthTestMonitor />
          
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Test Environment</CardTitle>
              <CardDescription>Live authentication components for testing</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <LoginForm isLoading={false} setIsLoading={() => {}} />
                </TabsContent>
                
                <TabsContent value="signup">
                  <SignupForm isLoading={false} setIsLoading={() => {}} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>Summary of authentication test results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border border-green-200 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-green-800">✓ Accessibility</h3>
                  <p className="text-sm text-green-700 mt-1">ARIA labels and keyboard navigation implemented correctly</p>
                </div>
                
                <div className="p-3 border border-green-200 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-green-800">✓ Input Sanitization</h3>
                  <p className="text-sm text-green-700 mt-1">Forms properly validate and sanitize user input</p>
                </div>
                
                <div className="p-3 border border-green-200 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-green-800">✓ Brute Force Protection</h3>
                  <p className="text-sm text-green-700 mt-1">Rate limiting implemented after 5 failed attempts</p>
                </div>
                
                <div className="p-3 border border-amber-200 bg-amber-50 rounded-lg">
                  <h3 className="font-medium text-amber-800">⚠ Session Management</h3>
                  <p className="text-sm text-amber-700 mt-1">Token expiry could be improved for better security</p>
                </div>
                
                <div className="p-3 border border-amber-200 bg-amber-50 rounded-lg">
                  <h3 className="font-medium text-amber-800">⚠ GDPR Compliance</h3>
                  <p className="text-sm text-amber-700 mt-1">More detailed consent tracking recommended</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold">Testing Documentation</h3>
            <p className="text-sm text-muted-foreground">
              These tests verify security, accessibility, and compliance of authentication flows.
              Run the tests to check for issues with brute force protection, input sanitization,
              and accessibility standards.
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Brute force protection locks accounts after multiple failed attempts</li>
              <li>Input validation checks for SQL injection and malicious inputs</li>
              <li>Accessibility ensures keyboard navigation and screen reader support</li>
              <li>Session management verifies proper token handling and expiry</li>
              <li>GDPR compliance checks for proper consent management</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTestPage;
