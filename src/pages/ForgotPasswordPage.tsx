<<<<<<< HEAD

import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
=======
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const ForgotPasswordPage: React.FC = () => {
  const { resetPassword } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<{ email: string }>();
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

    try {
<<<<<<< HEAD
      // This would call your actual password reset API
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSuccess(true);
    } catch (error) {
      console.error('Error requesting password reset:', error);
    } finally {
      setIsSubmitting(false);
=======
      await resetPassword(data.email);
      toast.success("Password reset instructions sent to your email");
    } catch (error) {
      toast.error("Failed to send password reset email");
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    }
  };

  return (
    <div className="container flex h-screen items-center justify-center py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
<<<<<<< HEAD
          <CardTitle className="text-2xl">Reset your password</CardTitle>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="text-center py-4">
              <h3 className="text-lg font-medium mb-2">Check your email</h3>
              <p className="text-muted-foreground mb-4">
                If an account exists for {email}, we've sent instructions to reset your password.
              </p>
              <Link to="/login" className="text-primary hover:underline">
                Return to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send reset link'}
              </Button>
            </form>
          )}
=======
          <CardTitle className="text-2xl text-center">
            Forgot Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Reset Instructions"}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              Remember your password?{" "}
              <a href="/login" className="text-primary hover:underline">
                Log in
              </a>
            </p>
          </form>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link to="/login" className="text-sm text-muted-foreground hover:underline">
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
