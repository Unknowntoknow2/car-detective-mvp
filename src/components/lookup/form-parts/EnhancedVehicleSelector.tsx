
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Star, AlertCircle } from 'lucide-react';
import { useMakeModels } from '@/hooks/useMakeModels';

interface EnhancedVehicleSelectorProps {
  selectedMakeId: string;
  selectedModelId: string;
  selectedTrimId: string;
  selectedYear: number | null;
  onMakeChange: (makeId: string) => void;
  onModelChange: (modelId: string) => void;
  onTrimChange: (trimId: string) => void;
  onYearChange: (year: number) => void;
  isDisabled?: boolean;
  showTrim?: boolean;
  showYear?: boolean;
  compact?: boolean;
}

export function EnhancedVehicleSelector({
  selectedMakeId,
  selectedModelId,
  selectedTrimId,
  selectedYear,
  onMakeChange,
  onModelChange,
  onTrimChange,
  onYearChange,
  isDisabled = false,
  showTrim = true,
  showYear = true,
  compact = false
}: EnhancedVehicleSelectorProps) {
  const {
    makes,
    models,
    trims,
    isLoading,
    error,
    fetchModelsByMakeId,
    fetchTrimsByModelId,
    searchMakes,
    getPopularMakes,
    findMakeById,
    findModelById
  } = useMakeModels();

  const [makeSearchQuery, setMakeSearchQuery] = useState('');
  const [showMakeSearch, setShowMakeSearch] = useState(false);

  // Filter makes based on search
  const filteredMakes = makeSearchQuery ? searchMakes(makeSearchQuery) : makes;
  const popularMakes = getPopularMakes();

  // Handle make selection and fetch models
  const handleMakeChange = async (makeId: string) => {
    console.log('🔄 Make selected:', makeId);
    
    // Update parent state immediately
    onMakeChange(makeId);
    onModelChange(''); // Reset model
    onTrimChange(''); // Reset trim
    
    // Fetch models for the selected make
    if (makeId) {
      console.log('🔄 Fetching models for makeId:', makeId);
      await fetchModelsByMakeId(makeId);
    }
  };

  // Handle model selection and fetch trims
  const handleModelChange = async (modelId: string) => {
    console.log('🔄 Model selected:', modelId);
    
    // Update parent state immediately
    onModelChange(modelId);
    onTrimChange(''); // Reset trim
    
    // Fetch trims if we have both model and year
    if (modelId && selectedYear) {
      console.log('🔄 Fetching trims for modelId:', modelId, 'year:', selectedYear);
      await fetchTrimsByModelId(modelId, selectedYear);
    }
  };

  // Handle year change and refetch trims
  const handleYearChange = (year: number) => {
    console.log('🔄 Year selected:', year);
    
    // Update parent state immediately
    onYearChange(year);
    onTrimChange(''); // Reset trim
    
    // Fetch trims if we have both model and year
    if (selectedModelId) {
      console.log('🔄 Fetching trims for modelId:', selectedModelId, 'year:', year);
      fetchTrimsByModelId(selectedModelId, year);
    }
  };

  // Generate year options
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const gridClass = compact 
    ? "grid grid-cols-2 gap-3" 
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4";

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className={gridClass}>
        {/* Make Selection */}
        <div className="space-y-2">
          <Label htmlFor="make">
            Make <span className="text-red-500">*</span>
          </Label>
          
          <Select 
            value={selectedMakeId || ""} 
            onValueChange={handleMakeChange}
            disabled={isDisabled || isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={isLoading ? "Loading makes..." : "Select make"} />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              {/* Popular Makes Section */}
              {popularMakes.length > 0 && !makeSearchQuery && (
                <>
                  <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-50">
                    Popular Makes
                  </div>
                  {popularMakes.map((make) => (
                    <SelectItem key={`popular-${make.id}`} value={make.id}>
                      <div className="flex items-center gap-2">
                        <Star className="w-3 h-3 text-yellow-500" />
                        {make.make_name}
                      </div>
                    </SelectItem>
                  ))}
                  <div className="border-t my-1" />
                </>
              )}
              
              {/* All Makes */}
              <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-50">
                All Makes ({makes.length})
              </div>
              {filteredMakes.map((make) => (
                <SelectItem key={make.id} value={make.id}>
                  {make.make_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Model Selection */}
        <div className="space-y-2">
          <Label htmlFor="model">
            Model <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={selectedModelId || ""} 
            onValueChange={handleModelChange}
            disabled={isDisabled || !selectedMakeId || isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={
                !selectedMakeId 
                  ? "Select make first" 
                  : isLoading 
                    ? "Loading models..." 
                    : models.length === 0 
                      ? "No models found"
                      : "Select model"
              } />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-50">
                Models ({models.length})
              </div>
              {models.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex items-center gap-2">
                    {model.popular && <Star className="w-3 h-3 text-yellow-500" />}
                    {model.model_name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Year Selection */}
        {showYear && (
          <div className="space-y-2">
            <Label htmlFor="year">
              Year <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={selectedYear?.toString() || ""} 
              onValueChange={(value) => handleYearChange(parseInt(value))}
              disabled={isDisabled}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Trim Selection */}
        {showTrim && (
          <div className="space-y-2">
            <Label htmlFor="trim">Trim Level</Label>
            <Select 
              value={selectedTrimId || ""} 
              onValueChange={onTrimChange}
              disabled={isDisabled || !selectedModelId || !selectedYear || isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  !selectedModelId || !selectedYear 
                    ? "Select model & year first" 
                    : isLoading 
                      ? "Loading trims..."
                      : trims.length === 0
                        ? "No trims found"
                        : "Select trim"
                } />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-50">
                  Trims ({trims.length})
                </div>
                {trims.map((trim) => (
                  <SelectItem key={trim.id} value={trim.id}>
                    <div className="flex flex-col">
                      <span>{trim.trim_name}</span>
                      {trim.msrp && (
                        <span className="text-xs text-gray-500">
                          MSRP: ${trim.msrp.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Selected Vehicle Preview */}
      {selectedMakeId && selectedModelId && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-blue-800">
            <Badge variant="secondary" className="text-xs">
              Selected Vehicle
            </Badge>
            <span className="font-medium">
              {findMakeById(selectedMakeId)?.make_name} {' '}
              {findModelById(selectedModelId)?.model_name}
              {selectedYear && ` ${selectedYear}`}
              {selectedTrimId && trims.find(t => t.id === selectedTrimId) && 
                ` ${trims.find(t => t.id === selectedTrimId)?.trim_name}`
              }
            </span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          Loading vehicle data from database...
        </div>
      )}

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
          <div>Makes: {makes.length}</div>
          <div>Models: {models.length}</div>
          <div>Trims: {trims.length}</div>
          <div>Selected Make ID: {selectedMakeId}</div>
          <div>Selected Model ID: {selectedModelId}</div>
          <div>Selected Year: {selectedYear}</div>
        </div>
      )}
    </div>
  );
}
