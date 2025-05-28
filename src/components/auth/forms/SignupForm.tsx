
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function SignupForm() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"individual" | "dealer">("individual");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      const result = await signUp(email, password, { 
        data: { role } 
      });
      if (result.error) {
        setError(result.error);
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Sign up failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      <select 
        value={role} 
        onChange={(e) => setRole(e.target.value as "individual" | "dealer")} 
        className="w-full border rounded px-3 py-2 bg-white"
        disabled={isLoading}
      >
        <option value="individual">Individual</option>
        <option value="dealer">Dealer</option>
      </select>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
}

export default SignupForm;
