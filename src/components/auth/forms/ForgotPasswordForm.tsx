
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface ForgotPasswordFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const ForgotPasswordForm = ({ isLoading, setIsLoading }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (value: string) => {
    if (!value) {
      setError('Email is required');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validateEmail(email)) {
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });

      if (error) throw error;
      toast.success('Reset instructions sent', {
        description: 'Check your email for a link to reset your password.',
      });
    } catch (error: any) {
      console.error('Reset password error:', error);
      if (error.message.includes('rate limit')) {
        toast.error('Too many requests', {
          description: 'Please wait a moment before trying again.',
        });
      } else {
        toast.error('Password reset failed', {
          description: 'We were unable to send reset instructions. Please check your email and try again.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (e.target.value) validateEmail(e.target.value);
          }}
          onBlur={() => validateEmail(email)}
          className="rounded-xl transition-all duration-200"
          required
        />
        {error && <div className="text-sm text-destructive">{error}</div>}
      </div>
      <Alert variant="default" className="bg-muted/50 text-sm">
        <Info className="h-4 w-4" />
        <AlertDescription>
          Enter your email address and we'll send you a link to reset your password.
        </AlertDescription>
      </Alert>
      <Button 
        type="button" 
        className="w-full rounded-xl shadow-sm hover:shadow-md transition-all duration-200" 
        disabled={isLoading || !!error}
        onClick={handleSubmit}
      >
        {isLoading ? 'Sending...' : 'Send Reset Link'}
      </Button>
    </div>
  );
};
