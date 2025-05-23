
import React from 'react';
import { useVehicleData } from '@/hooks/useVehicleData';
import { Button } from '@/components/ui/button';
import { RefreshCw, Database } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export function VehicleDataInfo() {
  const { makes, counts, isLoading, refreshData } = useVehicleData();
  
  const handleRefresh = async () => {
    try {
      toast.loading("Refreshing vehicle data...");
      const result = await refreshData();
      if (result.success) {
        toast.success(`Vehicle data refreshed: ${result.makeCount} makes and ${result.modelCount} models loaded`);
      } else {
        toast.error("Failed to refresh vehicle data");
      }
    } catch (error) {
      toast.error("Error refreshing vehicle data");
      console.error(error);
    }
  };
  
  return (
    <div className="bg-slate-50 rounded-lg p-4 flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Database className="h-5 w-5 text-slate-500" />
        <div>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          ) : (
            <>
              <p className="text-sm font-medium text-slate-700">
                Vehicle Database: {counts.makes} makes and {counts.models} models
              </p>
              <p className="text-xs text-slate-500">
                Data loaded from local cache
              </p>
            </>
          )}
        </div>
      </div>
      <div className="flex gap-2 flex-wrap md:flex-nowrap">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isLoading}
          className="text-xs gap-1"
        >
          <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>
    </div>
  );
}
