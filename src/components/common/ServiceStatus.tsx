
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ServiceStatusProps {
  className?: string;
}

export function ServiceStatus({ className = '' }: ServiceStatusProps) {
  const [nhtsaStatus, setNhtsaStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkNhtsaStatus = async () => {
    setNhtsaStatus('checking');
    try {
      // Quick test VIN for NHTSA API
      const response = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/JH4TB2H26CC000000?format=json', {
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      
      if (response.ok) {
        setNhtsaStatus('online');
      } else {
        setNhtsaStatus('offline');
      }
    } catch (error) {
      console.log('NHTSA API check failed:', error);
      setNhtsaStatus('offline');
    }
    setLastChecked(new Date());
  };

  useEffect(() => {
    checkNhtsaStatus();
    // Check every 5 minutes
    const interval = setInterval(checkNhtsaStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (nhtsaStatus === 'checking') {
    return null; // Don't show anything while checking
  }

  if (nhtsaStatus === 'online') {
    return null; // Don't show status when everything is working
  }

  return (
    <div className={className}>
      <Alert className="border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="h-4 w-4 text-orange-600" />
            <span className="text-orange-800">
              External vehicle data service temporarily unavailable. Using demo data for testing.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs text-orange-700 border-orange-300">
              Demo Mode
            </Badge>
            <button
              onClick={checkNhtsaStatus}
              className="flex items-center gap-1 text-orange-700 hover:text-orange-800 text-xs"
              disabled={nhtsaStatus === 'checking'}
            >
              <RefreshCw className={`h-3 w-3 ${nhtsaStatus === 'checking' ? 'animate-spin' : ''}`} />
              Check Again
            </button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
