
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { VinInputSection } from './VinInputSection';
import { VehicleHistoryForm } from './VehicleHistoryForm';
import { ServiceHistorySection } from './ServiceHistorySection';

interface VehicleHistoryData {
  vin: string;
  title_brand: string;
  num_owners: number;
  has_full_service_history: boolean;
}

export function VehicleHistorySection() {
  const [vin, setVin] = useState('');
  const [titleStatus, setTitleStatus] = useState('Clean');
  const [numberOfOwners, setNumberOfOwners] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFullServiceHistory, setHasFullServiceHistory] = useState(false);
  const [vehicleData, setVehicleData] = useState<VehicleHistoryData | null>(null);
  const [showServiceUploader, setShowServiceUploader] = useState(false);

  // Validate VIN format (17 characters, no I, O, Q)
  const isValidVin = (vin: string) => {
    return /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin);
  };

  const fetchVehicleHistory = async () => {
    if (!isValidVin(vin)) {
      toast.error('Please enter a valid 17-character VIN');
      return;
    }

    setIsLoading(true);
    try {
      // Use direct query
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('vin', vin)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // Not found error code
          // Vehicle not in database yet, set default values
          setVehicleData(null);
          setTitleStatus('Clean');
          setNumberOfOwners(1);
          setHasFullServiceHistory(false);
          
          // Create the vehicle record
          await supabase.from('vehicles').insert({
            vin,
            title_brand: 'Clean',
            num_owners: 1,
            has_full_service_history: false
          });
          
          toast.info('No previous history found for this VIN. Starting fresh.');
          return;
        }
        throw error;
      }

      // Process the returned data
      const typedData = data as unknown as VehicleHistoryData;
      setVehicleData(typedData);
      setTitleStatus(typedData.title_brand || 'Clean');
      setNumberOfOwners(typedData.num_owners || 1);
      setHasFullServiceHistory(typedData.has_full_service_history || false);
      toast.success('Vehicle history loaded successfully');
      
    } catch (error: any) {
      console.error('Error fetching vehicle history:', error);
      toast.error('Failed to fetch vehicle history: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const saveVehicleHistory = async () => {
    if (!vin || !isValidVin(vin)) {
      toast.error('Please enter a valid VIN first');
      return;
    }

    setIsLoading(true);
    try {
      // Direct upsert operation
      const { error } = await supabase
        .from('vehicles')
        .upsert({
          vin,
          title_brand: titleStatus,
          num_owners: numberOfOwners,
          has_full_service_history: hasFullServiceHistory
        }, {
          onConflict: 'vin'
        });

      if (error) throw error;
      
      setVehicleData({
        vin,
        title_brand: titleStatus,
        num_owners: numberOfOwners,
        has_full_service_history: hasFullServiceHistory
      });
      
      toast.success('Vehicle history information saved successfully');
    } catch (error: any) {
      console.error('Error saving vehicle history:', error);
      toast.error('Failed to save vehicle history: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceUploadComplete = () => {
    setHasFullServiceHistory(true);
    setShowServiceUploader(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Vehicle History & Ownership
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <VinInputSection 
            vin={vin} 
            isLoading={isLoading} 
            onVinChange={setVin} 
            onFetchHistory={fetchVehicleHistory} 
          />

          {(vin && isValidVin(vin)) && (
            <VehicleHistoryForm 
              titleStatus={titleStatus}
              numberOfOwners={numberOfOwners}
              isLoading={isLoading}
              onTitleStatusChange={setTitleStatus}
              onNumberOfOwnersChange={setNumberOfOwners}
              onSaveHistory={saveVehicleHistory}
            />
          )}
        </CardContent>
      </Card>

      {vin && isValidVin(vin) && (
        <ServiceHistorySection 
          vin={vin}
          showServiceUploader={showServiceUploader}
          onToggleUploader={() => setShowServiceUploader(!showServiceUploader)}
          onUploadComplete={handleServiceUploadComplete}
        />
      )}
    </div>
  );
}
