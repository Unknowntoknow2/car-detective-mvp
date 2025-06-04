<<<<<<< HEAD

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
=======
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/auth/AuthContext";
import { Eye, EyeOff, KeyRound, Loader2, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface SigninFormProps {
  userType?: 'individual' | 'dealer';
  role?: string;
  isLoading?: boolean;
  setIsLoading?: (loading: boolean) => void;
  redirectPath?: string;
  alternateLoginPath?: string;
  alternateLoginText?: string;
  showDealershipField?: boolean;
}

<<<<<<< HEAD
export function SigninForm({
  userType = 'individual',
  role,
  isLoading: externalIsLoading,
  setIsLoading: externalSetIsLoading,
  redirectPath = '/dashboard',
  alternateLoginPath,
  alternateLoginText,
  showDealershipField = false
}: SigninFormProps = {}) {
=======
export const SigninForm = (
  { isLoading, setIsLoading, redirectPath }: SigninFormProps,
) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [internalIsLoading, setInternalIsLoading] = useState(false);

  // Use external loading state if provided, otherwise use internal
  const isLoading = externalIsLoading !== undefined ? externalIsLoading : internalIsLoading;
  const setIsLoading = externalSetIsLoading || setInternalIsLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
<<<<<<< HEAD
    setError("");
=======

    if (!isFormValid) {
      setError("Please fill in all required fields");
      return;
    }

    setError(null);
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    setIsLoading(true);

    try {
      const result = await signIn(email, password);
<<<<<<< HEAD
      if (result.error) {
        setError(result.error);
      } else {
        navigate(redirectPath);
      }
    } catch (err: any) {
      setError(err.message || "Sign in failed");
    } finally {
=======

      if (result?.error) {
        if (result.error.toString().includes("Invalid login")) {
          toast.error("Invalid email or password");
        } else {
          setError(result.error.toString() || "Failed to sign in");
          toast.error(result.error.toString() || "Failed to sign in");
        }
        setIsLoading(false);
        return;
      }

      toast.success("Successfully signed in!");
      navigate(redirectPath);
    } catch (err: any) {
      console.error("Login error:", err);
      setError("An unexpected error occurred");
      toast.error(err.message || "Failed to sign in");
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
<<<<<<< HEAD
      <Input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        required 
        name="email"
        disabled={isLoading}
      />
      <Input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        required 
        name="password"
        disabled={isLoading}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing In..." : "Sign In"}
=======
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            className="pl-10"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            aria-invalid={email ? !isEmailValid() : false}
          />
        </div>
        {email && !isEmailValid() && (
          <p className="text-xs text-red-500">
            Please enter a valid email address
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            to="/forgot-password"
            className="text-xs text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="pl-10 pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword
              ? <EyeOff className="h-4 w-4" />
              : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !isFormValid}
      >
        {isLoading
          ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          )
          : (
            "Sign In"
          )}
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      </Button>
    </form>
  );
}

export default SigninForm;
