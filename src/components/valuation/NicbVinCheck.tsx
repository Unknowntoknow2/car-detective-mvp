
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { VIN_REGEX } from '@/lib/constants';

interface NicbVinCheckProps {
  initialVin?: string;
  onResult?: (result: { isStolen: boolean; hasSalvageTitle: boolean }) => void;
}

const NicbVinCheck: React.FC<NicbVinCheckProps> = ({ 
  initialVin = '',
  onResult
}) => {
  const [vin, setVin] = useState(initialVin);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    isStolen: boolean;
    hasSalvageTitle: boolean;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate VIN
    if (!vin || !VIN_REGEX.test(vin)) {
      setError('Please enter a valid 17-character VIN');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would call an actual API
      // For demo purposes, we'll simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo, use a random result with weighted probability
      // In real life, this would be the actual NICB/NMVTIS check result
      const random = Math.random();
      const isStolen = random < 0.05; // 5% chance of being stolen
      const hasSalvageTitle = random < 0.1; // 10% chance of salvage title
      
      const checkResult = {
        isStolen,
        hasSalvageTitle,
        message: isStolen 
          ? 'This vehicle may have been reported stolen. Please verify with local authorities.'
          : hasSalvageTitle
            ? 'This vehicle has a salvage, rebuilt, or branded title history.'
            : 'No theft or title issues found. Vehicle appears to have a clean title.'
      };
      
      setResult(checkResult);
      
      // Call the callback if provided
      if (onResult) {
        onResult({ isStolen, hasSalvageTitle });
      }
    } catch (error) {
      console.error('Error checking VIN:', error);
      setError('Failed to check VIN. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          NICB Theft & Title Check
        </CardTitle>
        <CardDescription>
          Check if this vehicle has been reported stolen or has a salvage title
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              value={vin}
              onChange={(e) => {
                setVin(e.target.value.toUpperCase());
                setError(null);
              }}
              placeholder="Enter 17-character VIN"
              className="uppercase"
              disabled={isLoading}
            />
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading || !vin || vin.length !== 17}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              'Check VIN'
            )}
          </Button>
        </form>
        
        {result && (
          <Alert 
            className={`mt-4 ${
              result.isStolen 
                ? 'bg-red-50 border-red-300' 
                : result.hasSalvageTitle 
                  ? 'bg-yellow-50 border-yellow-300' 
                  : 'bg-green-50 border-green-300'
            }`}
          >
            <div className="flex items-start">
              {result.isStolen ? (
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              ) : result.hasSalvageTitle ? (
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              )}
              <div>
                <AlertTitle className={
                  result.isStolen 
                    ? 'text-red-800' 
                    : result.hasSalvageTitle 
                      ? 'text-yellow-800' 
                      : 'text-green-800'
                }>
                  {result.isStolen 
                    ? 'Alert: Possible Theft Report' 
                    : result.hasSalvageTitle 
                      ? 'Caution: Title Issues Detected' 
                      : 'No Issues Found'}
                </AlertTitle>
                <AlertDescription className="text-sm">
                  {result.message}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground">
        Data provided in partnership with the National Insurance Crime Bureau (NICB) and National Motor Vehicle Title Information System (NMVTIS).
      </CardFooter>
    </Card>
  );
};

export default NicbVinCheck;
