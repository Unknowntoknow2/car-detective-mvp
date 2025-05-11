
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ForgotPasswordForm } from '@/components/auth/forms/ForgotPasswordForm';
import { Toaster } from 'sonner';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50/50">
      <Toaster richColors position="top-center" />
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email to receive a password reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm isLoading={isLoading} setIsLoading={setIsLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
