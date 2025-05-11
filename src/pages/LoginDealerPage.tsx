
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SharedLoginForm } from '@/components/auth/forms/SharedLoginForm';
import { Toaster } from 'sonner';
import { Link } from 'react-router-dom';

export default function LoginDealerPage() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-blue-50/50">
      <Toaster richColors position="top-center" />
      <Card className="w-full max-w-md shadow-sm border-blue-200">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Dealer Login</CardTitle>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                <path d="M3 9h18v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
                <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"></path>
                <path d="M12 3v6"></path>
              </svg>
            </div>
          </div>
          <CardDescription>
            Sign in to your dealership account to access leads and dealer tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SharedLoginForm 
            isLoading={isLoading} 
            setIsLoading={setIsLoading}
            expectedRole="dealer"
            redirectPath="/dealer-dashboard"
            alternateLoginPath="/login-user"
            alternateLoginText="Individual user? Click here to login"
          />
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <div>Need a dealer account?{' '}
              <Link to="/dealer-signup" className="text-primary hover:underline">
                Register your dealership
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
