
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const ForgotPasswordPage: React.FC = () => {
  const { resetPassword } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<{ email: string }>();

  const onSubmit = async (data: { email: string }) => {
    try {
      const { error } = await resetPassword(data.email);
      
      if (error) {
        if (error.message.includes('User not found')) {
          toast.error("No account found with this email address");
        } else {
          toast.error(error.message || "Failed to send password reset email");
        }
        return;
      }
      
      setIsSuccess(true);
      toast.success("Password reset instructions sent to your email");
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  if (isSuccess) {
    return (
      <div className="container flex h-screen items-center justify-center py-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Check Your Email</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              We've sent password reset instructions to your email address.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setIsSuccess(false)}
              className="w-full"
            >
              Send Another Email
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container flex h-screen items-center justify-center py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
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
              <a href="/auth" className="text-primary hover:underline">
                Sign in
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
