import React from 'react';
import { useVehicleData } from '@/hooks/useVehicleData';
import { Button } from '@/components/ui/button';
import { RefreshCw, Database, FileInput, Download } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

export function VehicleDataInfo() {
  const { makes, counts, isLoading, refreshData } = useVehicleData();
  
  const handleRefresh = async () => {
    try {
      toast.loading("Refreshing vehicle data...");
      const result = await refreshData(true);
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

  const handleImportNHTSA = async () => {
    try {
      toast.loading("Importing data from NHTSA...");
      
      const { data, error } = await supabase.functions.invoke('import-nhtsa-data', {
        method: 'POST'
      });
      
      if (error) throw error;
      
      if (data.success) {
        toast.success(data.message || "Successfully imported NHTSA data");
        refreshData(true);
      } else {
        toast.error("Failed to import NHTSA data");
      }
    } catch (error) {
      console.error('Error importing NHTSA data:', error);
      toast.error("Error importing data from NHTSA");
    }
  };

  const handleExport = async () => {
    try {
      toast.loading("Exporting vehicle data...");
      
      const { data, error } = await supabase.functions.invoke('export-vehicle-data', {
        method: 'POST'
      });
      
      if (error) throw error;
      
      const makesBlob = new Blob([data.makes], { type: 'text/csv' });
      const makesUrl = window.URL.createObjectURL(makesBlob);
      const makesLink = document.createElement('a');
      makesLink.href = makesUrl;
      makesLink.setAttribute('download', 'makes.csv');
      document.body.appendChild(makesLink);
      makesLink.click();
      document.body.removeChild(makesLink);
      
      const modelsBlob = new Blob([data.models], { type: 'text/csv' });
      const modelsUrl = window.URL.createObjectURL(modelsBlob);
      const modelsLink = document.createElement('a');
      modelsLink.href = modelsUrl;
      modelsLink.setAttribute('download', 'models.csv');
      document.body.appendChild(modelsLink);
      modelsLink.click();
      document.body.removeChild(modelsLink);
      
      toast.success(`Exported ${data.makesCount} makes and ${data.modelsCount} models`);
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error("Error exporting vehicle data");
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
                Data loaded from database and cached locally
              </p>
            </>
          )}
        </div>
      </div>
      <div className="flex gap-2 flex-wrap md:flex-nowrap">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleExport}
          disabled={isLoading || counts.makes === 0}
          className="text-xs gap-1"
        >
          <Download className="h-3 w-3" />
          Export CSV
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleImportNHTSA}
          disabled={isLoading}
          className="text-xs gap-1"
        >
          <FileInput className="h-3 w-3" />
          Import NHTSA
        </Button>
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
