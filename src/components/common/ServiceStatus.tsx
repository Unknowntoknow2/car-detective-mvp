
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface ServiceStatusProps {
  className?: string;
}

export function ServiceStatus({ className = '' }: ServiceStatusProps) {
  const [serviceStatus, setServiceStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [failureCount, setFailureCount] = useState(0);

  const checkServiceStatus = async () => {
    setServiceStatus('checking');
    try {
      // Test with a known VIN to check if decode service is working
      const { data, error } = await supabase.functions.invoke('unified-decode', {
        body: { vin: 'JH4TB2H26CC000000' } // Test VIN
      });

      // If we get any response (success or failure), the service is online
      if (data || error) {
        setServiceStatus('online');
        setFailureCount(0);
      } else {
        setServiceStatus('offline');
        setFailureCount(prev => prev + 1);
      }
    } catch (error) {
      console.log('Service status check failed:', error);
      setServiceStatus('offline');
      setFailureCount(prev => prev + 1);
    }
    setLastChecked(new Date());
  };

  useEffect(() => {
    checkServiceStatus();
    // Check every 5 minutes
    const interval = setInterval(checkServiceStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Don't show anything while checking initially
  if (serviceStatus === 'checking' && !lastChecked) {
    return null;
  }

  // Don't show status when everything is working
  if (serviceStatus === 'online' && failureCount === 0) {
    return null;
  }

  return (
    <div className={className}>
      <Alert className="border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="h-4 w-4 text-orange-600" />
            <span className="text-orange-800">
              External vehicle data services are experiencing issues. Some VIN lookups may use cached data or require manual entry.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs text-orange-700 border-orange-300">
              {failureCount > 3 ? 'Service Degraded' : 'Retry Available'}
            </Badge>
            <button
              onClick={checkServiceStatus}
              disabled={serviceStatus === 'checking'}
              className="flex items-center gap-1 text-orange-700 hover:text-orange-800 text-xs disabled:opacity-50"
            >
              <RefreshCw className={`h-3 w-3 ${serviceStatus === 'checking' ? 'animate-spin' : ''}`} />
              Check Status
            </button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
