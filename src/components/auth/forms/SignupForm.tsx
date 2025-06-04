<<<<<<< HEAD

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
=======
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/auth/AuthContext";
import { Eye, EyeOff, KeyRound, Loader2, Mail, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface SignupFormProps {
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
export function SignupForm({
  userType = 'individual',
  role: propRole,
  isLoading: externalIsLoading,
  setIsLoading: externalSetIsLoading,
  redirectPath = '/dashboard',
  alternateLoginPath,
  alternateLoginText,
  showDealershipField = false
}: SignupFormProps = {}) {
=======
export const SignupForm = ({ isLoading, setIsLoading }: SignupFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dealershipName, setDealershipName] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"individual" | "dealer">(propRole as "individual" | "dealer" || userType || "individual");
  const [error, setError] = useState("");
  const [internalIsLoading, setInternalIsLoading] = useState(false);

<<<<<<< HEAD
  // Use external loading state if provided, otherwise use internal
  const isLoading = externalIsLoading !== undefined ? externalIsLoading : internalIsLoading;
  const setIsLoading = externalSetIsLoading || setInternalIsLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!email || !password) {
      setError("Please enter both email and password");
=======
  // Form validation
  const isEmailValid = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = () => password.length >= 6;
  const doPasswordsMatch = () => password === confirmPassword;
  const isFormValid = isEmailValid() && isPasswordValid() &&
    doPasswordsMatch() && fullName.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      setError("Please fill in all required fields correctly");
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

<<<<<<< HEAD
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (showDealershipField && !dealershipName.trim()) {
      setError("Please enter your dealership name");
      return;
    }

=======
    setError(null);
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    setIsLoading(true);

    try {
<<<<<<< HEAD
      const metadata = {
        role,
        userType,
        ...(showDealershipField && { dealershipName: dealershipName.trim() }),
        ...(fullName && { fullName: fullName.trim() })
      };

      const result = await signUp(email, password, { 
        data: metadata
      });

      if (result.error) {
        setError(result.error);
      } else {
        // Success - navigate to redirect path
        navigate(redirectPath);
      }
    } catch (err: any) {
      setError(err.message || "Sign up failed");
    } finally {
=======
      const result = await signUp(email, password, fullName);

      if (result?.error) {
        setError(result.error.toString() || "Failed to sign up");
        toast.error(result.error.toString() || "Failed to sign up");
        setIsLoading(false);
        return;
      }

      toast.success("Account created! You can now sign in");
      navigate("/sign-in");
    } catch (err: any) {
      console.error("Sign up error:", err);
      setError("An unexpected error occurred");
      toast.error(err.message || "Failed to sign up");
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
<<<<<<< HEAD
=======
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input 
          id="fullName"
          type="text" 
          placeholder="John Doe" 
          value={fullName} 
          onChange={(e) => setFullName(e.target.value)} 
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
<<<<<<< HEAD
        <Input 
          id="email"
          type="email" 
          placeholder="your@email.com" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          disabled={isLoading}
        />
=======
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
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
<<<<<<< HEAD
        <Input 
          id="password"
          type="password" 
          placeholder="At least 8 characters" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          disabled={isLoading}
        />
=======
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
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
        {password && !isPasswordValid() && (
          <p className="text-xs text-red-500">
            Password must be at least 6 characters
          </p>
        )}
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input 
          id="confirmPassword"
          type="password" 
          placeholder="Repeat your password" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          required 
          disabled={isLoading}
        />
      </div>

      {!propRole && (
        <div className="space-y-2">
          <Label htmlFor="role">Account Type</Label>
          <select 
            id="role"
            value={role} 
            onChange={(e) => setRole(e.target.value as "individual" | "dealer")} 
            className="w-full border rounded px-3 py-2 bg-white disabled:opacity-50"
            disabled={isLoading}
          >
            <option value="individual">Individual</option>
            <option value="dealer">Dealer</option>
          </select>
        </div>
      )}

      {(showDealershipField || role === 'dealer') && (
        <div className="space-y-2">
          <Label htmlFor="dealershipName">Dealership Name</Label>
          <Input 
            id="dealershipName"
            type="text" 
            placeholder="Your dealership name" 
            value={dealershipName} 
            onChange={(e) => setDealershipName(e.target.value)} 
            disabled={isLoading}
            required={role === 'dealer'}
          />
        </div>
<<<<<<< HEAD
      )}

      {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-md">{error}</p>}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating Account..." : "Create Account"}
=======
        {confirmPassword && !doPasswordsMatch() && (
          <p className="text-xs text-red-500">Passwords do not match</p>
        )}
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
              Creating Account...
            </>
          )
          : (
            "Create Account"
          )}
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      </Button>

      {alternateLoginPath && alternateLoginText && (
        <div className="text-center text-sm mt-4">
          <a 
            href={alternateLoginPath} 
            className="text-primary hover:underline"
          >
            {alternateLoginText}
          </a>
        </div>
      )}
    </form>
  );
}

export default SignupForm;
