
import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { VEHICLE_MAKES, VEHICLE_YEARS } from '@/data/vehicle-data';
import { useVehicleData } from '@/hooks/useVehicleData';

interface VehicleDetailsInputsProps {
  make: string;
  setMake: (value: string) => void;
  model: string;
  setModel: (value: string) => void;
  year: number;
  setYear: (value: number) => void;
  mileage: number;
  setMileage: (value: number) => void;
  trim?: string;
  setTrim?: (value: string) => void;
  color?: string;
  setColor?: (value: string) => void;
  availableModels?: string[];
}

export function VehicleDetailsInputs({
  make,
  setMake,
  model,
  setModel,
  year,
  setYear,
  mileage,
  setMileage,
  trim,
  setTrim,
  color,
  setColor,
  availableModels = []
}: VehicleDetailsInputsProps) {
  const { getModelsByMake, getTrimsByModel, getDefaultTrims } = useVehicleData();
  const [models, setModels] = useState<string[]>(availableModels);
  const [trims, setTrims] = useState<{ id: string; trim_name: string }[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [isLoadingTrims, setIsLoadingTrims] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<string>('');
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);
  
  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value === '') {
      setMileage(0);
    } else {
      setMileage(parseInt(value, 10));
    }
  };

  // Fetch models when make changes
  useEffect(() => {
    if (make) {
      setIsLoadingModels(true);
      getModelsByMake(make)
        .then(modelData => {
          const modelNames = modelData.map(m => m.model_name);
          setModels(modelNames);
          
          // Store the model IDs for later use
          if (model) {
            const modelObj = modelData.find(m => m.model_name === model);
            if (modelObj) {
              setSelectedModelId(modelObj.id);
            }
          }
          
          // If current model is not in the new model list, reset it
          if (model && !modelNames.includes(model)) {
            setModel('');
          }
        })
        .catch(err => {
          console.error('Error fetching models:', err);
          setModels([]);
        })
        .finally(() => {
          setIsLoadingModels(false);
        });
    } else {
      setModels([]);
      if (model) setModel(''); // Reset model when make is cleared
    }
  }, [make, getModelsByMake]);
  
  // Fetch trims when model changes
  useEffect(() => {
    if (model && selectedModelId) {
      setIsLoadingTrims(true);
      
      if (selectedModelId.startsWith('local')) {
        // Use default trims for local models
        const defaultTrims = getDefaultTrims(model);
        setTrims(defaultTrims);
        setIsLoadingTrims(false);
      } else {
        // Fetch trims from database
        getTrimsByModel(selectedModelId)
          .then(trimData => {
            if (trimData.length > 0) {
              setTrims(trimData);
            } else {
              // Use default trims if none found
              const defaultTrims = getDefaultTrims(model);
              setTrims(defaultTrims);
            }
            
            // If current trim is not in the new trim list, reset it
            if (trim && setTrim) {
              const trimExists = trimData.some(t => t.trim_name === trim) || 
                                getDefaultTrims(model).some(t => t.trim_name === trim);
              if (!trimExists) {
                setTrim('');
              }
            }
          })
          .catch(err => {
            console.error('Error fetching trims:', err);
            // Use default trims on error
            const defaultTrims = getDefaultTrims(model);
            setTrims(defaultTrims);
          })
          .finally(() => {
            setIsLoadingTrims(false);
          });
      }
    } else {
      setTrims([]);
      // Reset trim when model is cleared
      if (trim && setTrim) setTrim('');
    }
  }, [model, selectedModelId, getTrimsByModel, getDefaultTrims]);
  
  // Update selectedModelId when model changes
  useEffect(() => {
    if (model) {
      getModelsByMake(make)
        .then(modelData => {
          const modelObj = modelData.find(m => m.model_name === model);
          if (modelObj) {
            setSelectedModelId(modelObj.id);
          }
        })
        .catch(err => {
          console.error('Error finding model ID:', err);
        });
    } else {
      setSelectedModelId('');
    }
  }, [model, make, getModelsByMake]);
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="make">Make</Label>
          <Select
            value={make}
            onValueChange={setMake}
          >
            <SelectTrigger id="make">
              <SelectValue placeholder="Select make" />
            </SelectTrigger>
            <SelectContent>
              {VEHICLE_MAKES.map((makeName) => (
                <SelectItem key={makeName} value={makeName}>
                  {makeName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Select
            value={model}
            onValueChange={setModel}
            disabled={!make || isLoadingModels}
          >
            <SelectTrigger id="model">
              <SelectValue placeholder={
                !make 
                  ? "Select make first" 
                  : isLoadingModels 
                    ? "Loading models..." 
                    : "Select model"
              } />
            </SelectTrigger>
            <SelectContent>
              {isLoadingModels ? (
                <SelectItem value="loading-models" disabled>Loading models...</SelectItem>
              ) : models.length > 0 ? (
                models.map((modelName) => (
                  <SelectItem key={modelName} value={modelName}>
                    {modelName}
                  </SelectItem>
                ))
              ) : (
                make && <SelectItem value="no-models-found">No models found</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Select
            value={year.toString()}
            onValueChange={(value) => setYear(parseInt(value, 10))}
          >
            <SelectTrigger id="year">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="mileage">Mileage</Label>
          <Input
            id="mileage"
            type="text"
            value={mileage || ''}
            onChange={handleMileageChange}
            placeholder="e.g. 45000"
          />
        </div>
      </div>
      
      {/* Trim and color inputs */}
      {setTrim && setColor && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="trim">Trim</Label>
            <Select
              value={trim || ''}
              onValueChange={setTrim}
              disabled={!model || isLoadingTrims}
            >
              <SelectTrigger id="trim">
                <SelectValue placeholder={
                  !model 
                    ? "Select model first" 
                    : isLoadingTrims 
                      ? "Loading trims..." 
                      : "Select trim"
                } />
              </SelectTrigger>
              <SelectContent>
                {isLoadingTrims ? (
                  <SelectItem value="loading-trims">Loading trims...</SelectItem>
                ) : trims.length > 0 ? (
                  trims.map((trimOption) => (
                    <SelectItem key={trimOption.id} value={trimOption.trim_name}>
                      {trimOption.trim_name}
                    </SelectItem>
                  ))
                ) : (
                  model && <SelectItem value="standard">Standard</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="color">Color (Optional)</Label>
            <Input
              id="color"
              type="text"
              value={color || ''}
              onChange={(e) => setColor(e.target.value)}
              placeholder="e.g. Blue, Silver"
            />
          </div>
        </div>
      )}
    </>
  );
}
