
import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useVehicleData, TrimData } from '@/hooks/useVehicleData';
import { FormValidationError } from '@/components/premium/common/FormValidationError';

interface VehicleDetailsInputsProps {
  selectedModel: string;
  selectedModelId: string;
  selectedTrim: string;
  setSelectedTrim: (trim: string) => void;
  isDisabled?: boolean;
  errors?: Record<string, string>;
}

export function VehicleDetailsInputs({
  selectedModel,
  selectedModelId,
  selectedTrim,
  setSelectedTrim,
  isDisabled = false,
  errors = {}
}: VehicleDetailsInputsProps) {
  const [trims, setTrims] = useState<TrimData[]>([]);
  const [loadingTrims, setLoadingTrims] = useState(false);
  const { isLoading, getTrimsByModel, getYearOptions } = useVehicleData();

  useEffect(() => {
    const fetchTrims = async () => {
      if (selectedModelId) {
        setLoadingTrims(true);
        try {
          const trimData = await getTrimsByModel(selectedModelId);
          setTrims(trimData);
        } catch (error) {
          console.error("Failed to fetch trims:", error);
          setTrims([]);
        } finally {
          setLoadingTrims(false);
        }
      } else {
        setTrims([]);
      }
    };

    fetchTrims();
  }, [selectedModelId, getTrimsByModel]);

  const handleTrimChange = (value: string) => {
    setSelectedTrim(value);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="trim" className="text-sm font-medium text-slate-700">
          Trim
        </Label>
        
        {isLoading || loadingTrims ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <>
            <Select
              value={selectedTrim || ''}
              onValueChange={handleTrimChange}
              disabled={isDisabled || !selectedModel}
            >
              <SelectTrigger 
                id="trim" 
                className={`h-10 transition-all duration-200 ${errors.trim ? 'border-red-300 focus:ring-red-200' : 'focus:ring-primary/20 focus:border-primary hover:border-primary/30'}`}
              >
                <SelectValue placeholder={selectedModel ? "Select trim" : "Select model first"} />
              </SelectTrigger>
              <SelectContent>
                {trims.length > 0 ? (
                  trims.map((trim) => (
                    <SelectItem key={trim.id} value={trim.trim_name}>
                      {trim.trim_name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="standard" disabled>
                    {selectedModel ? "No trims available" : "Select a model first"}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {errors.trim && <FormValidationError error={errors.trim} />}
          </>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="transmission" className="text-sm font-medium text-slate-700">
            Transmission
          </Label>
          <Select
            disabled={isDisabled}
            defaultValue="automatic"
          >
            <SelectTrigger id="transmission">
              <SelectValue placeholder="Select transmission" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="automatic">Automatic</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="cvt">CVT</SelectItem>
              <SelectItem value="dct">Dual-Clutch</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fuelType" className="text-sm font-medium text-slate-700">
            Fuel Type
          </Label>
          <Select
            disabled={isDisabled}
            defaultValue="gasoline"
          >
            <SelectTrigger id="fuelType">
              <SelectValue placeholder="Select fuel type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gasoline">Gasoline</SelectItem>
              <SelectItem value="diesel">Diesel</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
              <SelectItem value="electric">Electric</SelectItem>
              <SelectItem value="plugin_hybrid">Plug-in Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
