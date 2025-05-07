
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function VinLookupForm() {
  const [vin, setVin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vin || vin.length !== 17) {
      toast.error('Please enter a valid 17-character VIN');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // This would be replaced with actual VIN lookup logic
      setTimeout(() => {
        // Mock successful lookup
        navigate(`/result?vin=${vin}`);
      }, 1000);
      
    } catch (err) {
      console.error('Error in VIN lookup:', err);
      setError('Failed to process VIN');
      toast.error('Failed to process VIN');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <div className="flex items-center gap-3">
          <Input
            value={vin}
            onChange={(e) => setVin(e.target.value.toUpperCase())}
            placeholder="Enter 17-character VIN"
            className="font-mono"
            maxLength={17}
          />
          <Button type="submit" disabled={isLoading || vin.length !== 17}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Decoding...
              </>
            ) : (
              'Lookup'
            )}
          </Button>
        </div>
        {error && (
          <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </form>
  );
}
