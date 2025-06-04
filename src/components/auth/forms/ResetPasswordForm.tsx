<<<<<<< HEAD

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const ResetPasswordForm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
=======
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Check, KeyRound, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

// Define form schema
const formSchema = z.object({
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface ResetPasswordFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const ResetPasswordForm = (
  { isLoading, setIsLoading }: ResetPasswordFormProps,
) => {
  const { updatePassword } = useAuth();
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  const navigate = useNavigate();
  const auth = useAuth();

<<<<<<< HEAD
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      setError('Please enter a new password');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setError(null);
=======
  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setFormError(null);
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    setIsLoading(true);

    try {
<<<<<<< HEAD
      // For now, just show a success message since updatePassword might not be available
      // if auth.updatePassword is available, we would call it
      setSuccess(true);
      toast({
        title: "Password reset successful",
        description: "Your password has been reset successfully!",
        variant: "success",
      });
      
      // Simulate API call delay
      setTimeout(() => {
        navigate('/auth/signin');
      }, 3000);
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message || 'An unexpected error occurred');
      toast({
        title: "Reset failed",
        description: err.message || 'Failed to reset password',
        variant: "destructive",
      });
=======
      const result = await updatePassword(values.password);

      if (result.error) {
        setFormError(result.error || "Failed to update password");
        return;
      }

      // Show success message
      setSuccess(true);

      // After brief delay, redirect to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    } catch (err) {
      setFormError("An unexpected error occurred");
      console.error("Password update error:", err);
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
<<<<<<< HEAD
      <div className="text-center">
        <h3 className="text-lg font-medium mb-2">Password Reset Complete</h3>
        <p className="text-muted-foreground mb-4">
          Your password has been reset successfully. You can now sign in with your new password.
        </p>
        <p className="text-sm text-muted-foreground">
          Redirecting you to sign in...
        </p>
=======
      <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Password Updated
        </h3>
        <p className="text-sm text-green-700 mb-4">
          Your password has been successfully updated. Redirecting to
          dashboard...
        </p>
        <div className="h-1 w-full bg-green-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 animate-pulse"
            style={{ width: "100%" }}
          >
          </div>
        </div>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          <Button 
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Resetting Password...
          </>
        ) : (
          'Reset Password'
        )}
      </Button>
      
      <Button
        type="button"
        variant="ghost"
        className="w-full"
        onClick={() => navigate('/auth/signin')}
        disabled={isLoading}
      >
        Back to Sign In
      </Button>
    </form>
=======
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {formError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {formError}
          </div>
        )}

        <div className="mb-4">
          <h2 className="text-lg font-medium">Create New Password</h2>
          <p className="text-sm text-muted-foreground">
            Your new password must be at least 6 characters long.
          </p>
        </div>

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...field}
                    placeholder="Create a new password"
                    type="password"
                    className="pl-10"
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...field}
                    placeholder="Confirm your new password"
                    type="password"
                    className="pl-10"
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading
            ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating password...
              </>
            )
            : (
              "Reset Password"
            )}
        </Button>
      </form>
    </Form>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  );
};
