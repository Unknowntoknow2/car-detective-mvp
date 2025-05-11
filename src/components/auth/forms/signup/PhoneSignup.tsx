import { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { isValidPhone } from './validation';
import { supabase } from '@/integrations/supabase/client';

interface PhoneSignupProps {
  isLoading: boolean;
  onSignup: (phone: string) => Promise<void>;
  phoneError: string;
  setPhoneError: (error: string) => void;
}

export const PhoneSignup = ({ isLoading, onSignup, phoneError, setPhoneError }: PhoneSignupProps) => {
  const [phone, setPhone] = useState('');
  const [phoneCheckTimeout, setPhoneCheckTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);

  const checkPhoneExists = (phone: string) => {
    if (!isValidPhone(phone)) {
      setPhoneError('');
      return;
    }
    
    if (phoneCheckTimeout) {
      clearTimeout(phoneCheckTimeout);
    }
    
    const timeout = setTimeout(async () => {
      setIsCheckingPhone(true);
      
      try {
        const { error } = await supabase.auth.signInWithOtp({
          phone,
          options: {
            shouldCreateUser: false,
          }
        });

        if (error && error.message.includes("Phone number not found")) {
          setPhoneError('');
        } else {
          setPhoneError('An account with this phone number already exists. Try logging in instead.');
        }
      } catch (error) {
        console.error('Error checking phone:', error);
      } finally {
        setIsCheckingPhone(false);
      }
    }, 600);
    
    setPhoneCheckTimeout(timeout);
  };

  const handleSubmit = async () => {
    const phoneValidation = isValidPhone(phone);
    if (!phoneValidation && !phoneError) {
      await onSignup(phone);
    }
  };

  useEffect(() => {
    return () => {
      if (phoneCheckTimeout) clearTimeout(phoneCheckTimeout);
    };
  }, [phoneCheckTimeout]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <div className="relative">
          <Input
            id="phone"
            type="tel"
            placeholder="Enter your phone number (+1234567890)"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              checkPhoneExists(e.target.value);
            }}
            className={`rounded-xl transition-all duration-200 ${isCheckingPhone ? 'opacity-70' : ''}`}
            disabled={isCheckingPhone}
            required
          />
          {isCheckingPhone && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin h-4 w-4 border-2 border-primary border-opacity-50 border-t-primary rounded-full"></div>
            </div>
          )}
        </div>
        {phoneError && (
          <div className={`text-sm ${phoneError.includes('already exists') ? 'text-amber-500' : 'text-destructive'}`}>
            {phoneError}
          </div>
        )}
      </div>

      <Alert variant="default" className="bg-muted/50 text-sm">
        <Info className="h-4 w-4" />
        <AlertDescription>
          A verification code will be sent to your phone. Message and data rates may apply.
        </AlertDescription>
      </Alert>
    </div>
  );
};
