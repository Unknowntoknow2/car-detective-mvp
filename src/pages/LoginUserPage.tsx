
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SharedLoginForm } from '@/components/auth/forms/SharedLoginForm';
import { Toaster } from 'sonner';
import { Link } from 'react-router-dom';

export default function LoginUserPage() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50/50">
      <Toaster richColors position="top-center" />
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">User Login</CardTitle>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
          </div>
          <CardDescription>
            Sign in to your personal account to manage your vehicle valuations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SharedLoginForm 
            isLoading={isLoading} 
            setIsLoading={setIsLoading}
            expectedRole="user"
            redirectPath="/dashboard"
            alternateLoginPath="/login-dealer"
            alternateLoginText="Are you a dealer? Click here to login"
          />
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <div>Don't have an account?{' '}
              <Link to="/auth/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
