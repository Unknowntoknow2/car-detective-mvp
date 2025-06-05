
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface ForgotPasswordFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const ForgotPasswordForm = (
  { isLoading, setIsLoading }: ForgotPasswordFormProps,
) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setError("Email is required");
      return false;
    }
    if (!emailRegex.test(value)) {
      setError("Please enter a valid email address");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateEmail(email)) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        toast.success("Reset instructions sent", {
          description: "Check your email for password reset instructions.",
        });
      }, 1500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
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
        className="w-full rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
        disabled={isLoading || !!error}
        onClick={handleSubmit}
      >
        {isLoading ? "Sending..." : "Send Reset Instructions"}
      </Button>
    </div>
  );
};
