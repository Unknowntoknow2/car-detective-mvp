
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useVehicleData, MakeData, ModelData, TrimData } from '@/hooks/useVehicleData';
import { Skeleton } from '@/components/ui/skeleton';

interface VehicleDetailsInputsProps {
  make: string;
  setMake: (make: string) => void;
  model: string;
  setModel: (model: string) => void;
  trim: string;
  setTrim: (trim: string) => void;
  year: number | '';
  setYear: (year: number | '') => void;
  mileage?: number;
  setMileage?: (mileage: number) => void;
  color?: string;
  setColor?: (color: string) => void;
  isDisabled?: boolean;
}

export function VehicleDetailsInputs({
  make,
  setMake,
  model,
  setModel,
  trim,
  setTrim,
  year,
  setYear,
  mileage,
  setMileage,
  color,
  setColor,
  isDisabled = false
}: VehicleDetailsInputsProps) {
  const { makes, isLoading, error, getModelsByMake, getTrimsByModel, getYearOptions } = useVehicleData();
  const [models, setModels] = useState<ModelData[]>([]);
  const [trims, setTrims] = useState<TrimData[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingTrims, setLoadingTrims] = useState(false);
  const yearOptions = getYearOptions();

  // Fetch models when make changes
  useEffect(() => {
    async function fetchModels() {
      if (make) {
        try {
          setLoadingModels(true);
          const modelData = await getModelsByMake(make);
          setModels(modelData);
        } catch (err) {
          console.error('Error fetching models:', err);
          setModels([]);
        } finally {
          setLoadingModels(false);
        }
      } else {
        setModels([]);
      }
    }
    
    fetchModels();
  }, [make, getModelsByMake]);

  // Fetch trims when model changes
  useEffect(() => {
    async function fetchTrims() {
      if (model) {
        try {
          setLoadingTrims(true);
          const selectedModel = models.find(m => m.model_name === model);
          if (selectedModel) {
            const trimData = await getTrimsByModel(selectedModel.id);
            setTrims(trimData);
          } else {
            setTrims([]);
          }
        } catch (err) {
          console.error('Error fetching trims:', err);
          setTrims([]);
        } finally {
          setLoadingTrims(false);
        }
      } else {
        setTrims([]);
      }
    }
    
    fetchTrims();
  }, [model, models, getTrimsByModel]);

  // Reset dependent fields when parent field changes
  useEffect(() => {
    if (make && !models.some(m => m.model_name === model)) {
      setModel('');
    }
  }, [make, model, models, setModel]);

  useEffect(() => {
    if (model && !trims.some(t => t.trim_name === trim)) {
      setTrim('');
    }
  }, [model, trim, trims, setTrim]);

  const handleYearChange = (value: string) => {
    setYear(value ? parseInt(value, 10) : '');
  };

  return (
    <div className="space-y-4">
      {/* Make Selection */}
      <div>
        <Label htmlFor="make">Make</Label>
        {isLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select
            disabled={isDisabled}
            value={make}
            onValueChange={setMake}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select make" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {makes.map((makeData: MakeData) => (
                  <SelectItem key={makeData.id} value={makeData.make_name}>
                    {makeData.make_name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Model Selection */}
      <div>
        <Label htmlFor="model">Model</Label>
        {loadingModels ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select
            disabled={isDisabled || !make}
            value={model}
            onValueChange={setModel}
          >
            <SelectTrigger>
              <SelectValue placeholder={make ? "Select model" : "Select make first"} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {models.map((modelData: ModelData) => (
                  <SelectItem key={modelData.id} value={modelData.model_name}>
                    {modelData.model_name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Trim Selection */}
      <div>
        <Label htmlFor="trim">Trim</Label>
        {loadingTrims ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select
            disabled={isDisabled || !model}
            value={trim}
            onValueChange={setTrim}
          >
            <SelectTrigger>
              <SelectValue placeholder={model ? "Select trim" : "Select model first"} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {trims.map((trimData: TrimData) => (
                  <SelectItem key={trimData.id} value={trimData.trim_name}>
                    {trimData.trim_name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Year Selection */}
      <div>
        <Label htmlFor="year">Year</Label>
        <Select
          disabled={isDisabled}
          value={year ? year.toString() : ''}
          onValueChange={handleYearChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {yearOptions.map((yearOption: number) => (
                <SelectItem key={yearOption} value={yearOption.toString()}>
                  {yearOption}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Mileage Input */}
      {setMileage && (
        <div>
          <Label htmlFor="mileage">Mileage</Label>
          <Input
            id="mileage"
            type="number"
            placeholder="Enter mileage"
            value={mileage || ''}
            onChange={(e) => setMileage(parseInt(e.target.value) || 0)}
            disabled={isDisabled}
          />
        </div>
      )}

      {/* Color Input (Optional) */}
      {setColor && (
        <div>
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            type="text"
            placeholder="Enter color"
            value={color || ''}
            onChange={(e) => setColor(e.target.value)}
            disabled={isDisabled}
          />
        </div>
      )}
    </div>
  );
}
