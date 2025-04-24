
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

interface ForgotEmailFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const ForgotEmailForm = ({ isLoading, setIsLoading }: ForgotEmailFormProps) => {
  const [phone, setPhone] = useState('');

  const handleSubmit = async () => {
    if (!phone) {
      toast.error('Phone number is required');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        toast.success('If this phone number matches an account, we will show the associated email.');
        toast.info('Associated email: m****@gmail.com');
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
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>
      <div className="text-sm">
        Enter your phone number and we'll look up your associated username.
      </div>
      <Button 
        type="button" 
        className="w-full" 
        disabled={isLoading}
        onClick={handleSubmit}
      >
        {isLoading ? 'Searching...' : 'Recover Email'}
      </Button>
    </div>
  );
};
