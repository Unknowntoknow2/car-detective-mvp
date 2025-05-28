
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

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

  // Use external loading state if provided, otherwise use internal
  const isLoading = externalIsLoading !== undefined ? externalIsLoading : internalIsLoading;
  const setIsLoading = externalSetIsLoading || setInternalIsLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (showDealershipField && !dealershipName.trim()) {
      setError("Please enter your dealership name");
      return;
    }

    setIsLoading(true);
    
    try {
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
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <Input 
          id="email"
          type="email" 
          placeholder="your@email.com" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password"
          type="password" 
          placeholder="At least 8 characters" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          disabled={isLoading}
        />
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
      )}

      {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-md">{error}</p>}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating Account..." : "Create Account"}
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
