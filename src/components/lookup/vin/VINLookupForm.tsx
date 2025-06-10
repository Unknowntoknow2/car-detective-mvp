
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface VINLookupFormProps {
  value: string;
  onChange: (vin: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  error: string | null;
}

export const VINLookupForm: React.FC<VINLookupFormProps> = ({
  value,
  onChange,
  onSubmit,
  isLoading,
  error,
}) => {
  const [localVin, setLocalVin] = useState(value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onChange(localVin);
    onSubmit();
  };

  const isValidVin = localVin.length === 17;

  return (
    <Card>
      <CardHeader>
        <CardTitle>VIN Lookup</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="vin">Vehicle Identification Number (VIN)</Label>
            <Input
              id="vin"
              type="text"
              value={localVin}
              onChange={(e) => setLocalVin(e.target.value.toUpperCase())}
              placeholder="Enter 17-character VIN"
              maxLength={17}
              className="font-mono"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Enter the complete 17-character VIN
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
              <AlertTriangle className="h-5 w-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={!isValidVin || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Decoding VIN...
              </>
            ) : (
              'Decode VIN'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default VINLookupForm;
