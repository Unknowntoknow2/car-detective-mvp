
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface SigninFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  redirectPath?: string;
}

export const SigninForm = (
  { isLoading, setIsLoading, redirectPath = "/" }: SigninFormProps,
) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await signIn(email, password);
      toast.success("Successfully signed in!");
      navigate(redirectPath);
    } catch (error: any) {
      console.error("Sign in error:", error);
      setError(error.message || "Failed to sign in");
      toast.error("Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl transition-all duration-200"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-xl transition-all duration-200"
          required
        />
      </div>
      {error && <div className="text-sm text-destructive">{error}</div>}
      <Button
        type="submit"
        className="w-full rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
        disabled={isLoading}
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
      <div className="text-center text-sm">
        <button
          type="button"
          className="text-primary hover:underline"
          onClick={() => navigate("/auth/forgot-password")}
        >
          Forgot your password?
        </button>
      </div>
    </form>
  );
};
