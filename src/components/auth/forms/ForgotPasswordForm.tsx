
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ForgotPasswordFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const ForgotPasswordForm = ({ isLoading, setIsLoading }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState('');

  const handleSubmit = async () => {
    if (!email) {
      toast.error('Email is required');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });

      if (error) throw error;
      toast.success('Password reset instructions sent to your email');
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error(error.message || 'Failed to send reset instructions');
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
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="text-sm">
        Enter your email address and we'll send you a link to reset your password.
      </div>
      <Button 
        type="button" 
        className="w-full" 
        disabled={isLoading}
        onClick={handleSubmit}
      >
        {isLoading ? 'Sending...' : 'Send Reset Link'}
      </Button>
    </div>
  );
};
