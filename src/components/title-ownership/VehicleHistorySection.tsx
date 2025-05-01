
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { TitleStatusSelector } from './TitleStatusSelector';
import { OwnershipHistory } from './OwnershipHistory';
import { ServiceHistoryUploader } from '../service-history/ServiceHistoryUploader';
import { ServiceHistoryDisplay } from '../service-history/ServiceHistoryDisplay';
import { AlertCircle, Search, Loader2, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
          <div>
            <Label htmlFor="vin-input" className="text-sm font-medium">
              Vehicle Identification Number (VIN)
            </Label>
            <div className="flex gap-2 mt-1.5">
              <Input
                id="vin-input"
                placeholder="Enter 17-character VIN"
                value={vin}
                onChange={(e) => setVin(e.target.value.toUpperCase())}
                className="font-mono"
                maxLength={17}
              />
              <Button
                type="button"
                onClick={fetchVehicleHistory}
                disabled={!vin || isLoading || !isValidVin(vin)}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Fetch History
              </Button>
            </div>
            {vin && !isValidVin(vin) && (
              <div className="flex items-start gap-2 mt-1.5 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>VIN must be 17 characters (no I, O, or Q)</span>
              </div>
            )}
          </div>

          {(vin && isValidVin(vin)) && (
            <>
              <div className="grid gap-6 md:grid-cols-2">
                <TitleStatusSelector
                  value={titleStatus}
                  onChange={setTitleStatus}
                  required={true}
                />
                
                <OwnershipHistory
                  numberOfOwners={numberOfOwners}
                  onChange={setNumberOfOwners}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={saveVehicleHistory}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4 mr-2" />
                  )}
                  Save Vehicle History
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {vin && isValidVin(vin) && (
        <div className="space-y-4">
          <ServiceHistoryDisplay vin={vin} />
          
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              onClick={() => setShowServiceUploader(!showServiceUploader)}
            >
              {showServiceUploader ? 'Hide Upload Form' : 'Add Service Record'}
            </Button>
          </div>
          
          {showServiceUploader && (
            <ServiceHistoryUploader 
              vin={vin} 
              onUploadComplete={() => {
                setHasFullServiceHistory(true);
                setShowServiceUploader(false);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
