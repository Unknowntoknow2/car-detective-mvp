
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface ForgotEmailFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const ForgotEmailForm = ({ isLoading, setIsLoading }: ForgotEmailFormProps) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const validatePhone = (value: string) => {
    // Basic international phone validation
    const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    if (!value) {
      setError('Phone number is required');
      return false;
    }
    if (!phoneRegex.test(value)) {
      setError('Please enter a valid international phone number');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validatePhone(phone)) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        toast.success('Account lookup successful', {
          description: 'We found an account associated with this phone number.',
        });
        toast.info('Associated username', {
          description: 'm****@gmail.com',
        });
      }, 1500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="Enter your phone number (+1234567890)"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            if (e.target.value) validatePhone(e.target.value);
          }}
          onBlur={() => validatePhone(phone)}
          className="rounded-xl transition-all duration-200"
          required
        />
        {error && (
          <div className="text-sm text-destructive">{error}</div>
        )}
      </div>
      <Alert variant="default" className="bg-muted/50 text-sm">
        <Info className="h-4 w-4" />
        <AlertDescription>
          Enter your phone number and we'll look up your associated username.
        </AlertDescription>
      </Alert>
      <Button 
        type="button" 
        className="w-full rounded-xl transition-all duration-200 shadow-sm hover:shadow-md" 
        disabled={isLoading || !!error}
        onClick={handleSubmit}
      >
        {isLoading ? 'Searching...' : 'Recover Username'}
      </Button>
    </div>
  );
};
