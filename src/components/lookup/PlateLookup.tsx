
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, AlertCircle, InfoIcon } from 'lucide-react';
import { toast } from 'sonner';

interface PlateLookupProps {
  onSubmit?: (plate: string, state: string) => void;
  isLoading?: boolean;
}

export function PlateLookup({ onSubmit, isLoading = false }: PlateLookupProps) {
  const [plate, setPlate] = useState('');
  const [state, setState] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Reset lock after 30 seconds
  useEffect(() => {
    return () => {
      if (lockTimer) clearTimeout(lockTimer);
    };
  }, [lockTimer]);
  
  const validatePlate = (value: string) => {
    if (!value) return 'Please enter a license plate';
    if (value.includes('<') || value.includes('>') || value.includes("'") || value.includes('"')) {
      return 'License plate contains invalid characters';
    }
    return null;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      toast.error('Too many attempts. Please wait before trying again.');
      return;
    }
    
    const plateError = validatePlate(plate);
    if (plateError) {
      setError(plateError);
      return;
    }
    
    if (!state) {
      setError('Please select a state');
      return;
    }
    
    setError(null);
    
    // Count attempts for brute force protection
    setAttempts(prev => prev + 1);
    if (attempts >= 4) {
      setIsLocked(true);
      toast.error('Too many lookup attempts. Please wait 30 seconds before trying again.');
      const timer = setTimeout(() => {
        setIsLocked(false);
        setAttempts(0);
      }, 30000);
      setLockTimer(timer);
      return;
    }
    
    if (onSubmit) {
      onSubmit(plate, state);
    } else {
      toast.info(`Looking up plate ${plate} from ${state}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-labelledby="plate-lookup-form">
      <h2 id="plate-lookup-form" className="sr-only">License Plate Lookup</h2>
      
      <div className="space-y-2">
        <label htmlFor="plate" className="text-sm font-medium block">
          License Plate
        </label>
        <Input
          id="plate"
          value={plate}
          onChange={(e) => setPlate(e.target.value.toUpperCase())}
          placeholder="Enter license plate"
          className="uppercase"
          aria-required="true"
          aria-invalid={!!error && error.includes('plate')}
          aria-describedby={error && error.includes('plate') ? "plate-error" : undefined}
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="state" className="text-sm font-medium block">
          State
        </label>
        <Select value={state} onValueChange={setState}>
          <SelectTrigger id="state" aria-required="true" aria-invalid={!!error && error.includes('state')}>
            <SelectValue placeholder="Select state" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AL">Alabama</SelectItem>
            <SelectItem value="AK">Alaska</SelectItem>
            <SelectItem value="AZ">Arizona</SelectItem>
            <SelectItem value="AR">Arkansas</SelectItem>
            <SelectItem value="CA">California</SelectItem>
            <SelectItem value="CO">Colorado</SelectItem>
            <SelectItem value="CT">Connecticut</SelectItem>
            <SelectItem value="DE">Delaware</SelectItem>
            <SelectItem value="FL">Florida</SelectItem>
            <SelectItem value="GA">Georgia</SelectItem>
            <SelectItem value="HI">Hawaii</SelectItem>
            <SelectItem value="ID">Idaho</SelectItem>
            <SelectItem value="IL">Illinois</SelectItem>
            <SelectItem value="IN">Indiana</SelectItem>
            <SelectItem value="IA">Iowa</SelectItem>
            <SelectItem value="KS">Kansas</SelectItem>
            <SelectItem value="KY">Kentucky</SelectItem>
            <SelectItem value="LA">Louisiana</SelectItem>
            <SelectItem value="ME">Maine</SelectItem>
            <SelectItem value="MD">Maryland</SelectItem>
            <SelectItem value="MA">Massachusetts</SelectItem>
            <SelectItem value="MI">Michigan</SelectItem>
            <SelectItem value="MN">Minnesota</SelectItem>
            <SelectItem value="MS">Mississippi</SelectItem>
            <SelectItem value="MO">Missouri</SelectItem>
            <SelectItem value="MT">Montana</SelectItem>
            <SelectItem value="NE">Nebraska</SelectItem>
            <SelectItem value="NV">Nevada</SelectItem>
            <SelectItem value="NH">New Hampshire</SelectItem>
            <SelectItem value="NJ">New Jersey</SelectItem>
            <SelectItem value="NM">New Mexico</SelectItem>
            <SelectItem value="NY">New York</SelectItem>
            <SelectItem value="NC">North Carolina</SelectItem>
            <SelectItem value="ND">North Dakota</SelectItem>
            <SelectItem value="OH">Ohio</SelectItem>
            <SelectItem value="OK">Oklahoma</SelectItem>
            <SelectItem value="OR">Oregon</SelectItem>
            <SelectItem value="PA">Pennsylvania</SelectItem>
            <SelectItem value="RI">Rhode Island</SelectItem>
            <SelectItem value="SC">South Carolina</SelectItem>
            <SelectItem value="SD">South Dakota</SelectItem>
            <SelectItem value="TN">Tennessee</SelectItem>
            <SelectItem value="TX">Texas</SelectItem>
            <SelectItem value="UT">Utah</SelectItem>
            <SelectItem value="VT">Vermont</SelectItem>
            <SelectItem value="VA">Virginia</SelectItem>
            <SelectItem value="WA">Washington</SelectItem>
            <SelectItem value="WV">West Virginia</SelectItem>
            <SelectItem value="WI">Wisconsin</SelectItem>
            <SelectItem value="WY">Wyoming</SelectItem>
            <SelectItem value="DC">District of Columbia</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {error && (
        <div className="flex items-center gap-2 text-red-500 text-sm" id={error.includes('plate') ? "plate-error" : undefined} role="alert">
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
      
      {isLocked && (
        <div className="bg-amber-50 border border-amber-200 rounded p-3 text-amber-700 text-sm">
          <div className="flex items-start gap-2">
            <InfoIcon className="h-4 w-4 mt-0.5" />
            <p>Too many attempts. Please wait 30 seconds before trying again.</p>
          </div>
        </div>
      )}
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading || isLocked}
        aria-disabled={isLoading || isLocked}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            <span>Looking up plate...</span>
          </>
        ) : (
          'Get Vehicle Details'
        )}
      </Button>
      
      <p className="text-xs text-gray-500 mt-2">
        By using this lookup service, you agree to our <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
      </p>
    </form>
  );
}
