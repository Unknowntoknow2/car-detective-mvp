
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface ResetPasswordFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const ResetPasswordForm = (
  { isLoading, setIsLoading }: ResetPasswordFormProps,
) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const validatePasswords = () => {
    if (!password) {
      setError("Password is required");
      return false;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validatePasswords()) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        toast.success("Password reset successful", {
          description: "Your password has been updated successfully.",
        });
      }, 1500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-xl transition-all duration-200"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm your new password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (e.target.value && password) validatePasswords();
          }}
          onBlur={validatePasswords}
          className="rounded-xl transition-all duration-200"
          required
        />
        {error && <div className="text-sm text-destructive">{error}</div>}
      </div>
      <Alert variant="default" className="bg-muted/50 text-sm">
        <Info className="h-4 w-4" />
        <AlertDescription>
          Your password must be at least 8 characters long.
        </AlertDescription>
      </Alert>
      <Button
        type="button"
        className="w-full rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
        disabled={isLoading || !!error}
        onClick={handleSubmit}
      >
        {isLoading ? "Updating..." : "Update Password"}
      </Button>
    </div>
  );
};
