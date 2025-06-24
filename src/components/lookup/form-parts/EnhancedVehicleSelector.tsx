
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Star, AlertCircle, Loader2, Database, Clock } from 'lucide-react';
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
    findModelById,
    debugInfo
  } = useMakeModels();

  const [makeSearchQuery, setMakeSearchQuery] = useState('');

  // Filter makes based on search
  const filteredMakes = makeSearchQuery ? searchMakes(makeSearchQuery) : makes;
  const popularMakes = getPopularMakes();

  // Handle make selection and fetch models
  const handleMakeChange = async (makeId: string) => {
    const selectedMake = findMakeById(makeId);
    console.log('🎯 Make selected:', makeId, 'Make name:', selectedMake?.make_name);
    
    // Update parent state immediately
    onMakeChange(makeId);
    onModelChange(''); // Reset model
    onTrimChange(''); // Reset trim
    
    // Fetch models for the selected make
    if (makeId) {
      try {
        await fetchModelsByMakeId(makeId);
      } catch (error) {
        console.error('❌ Error in fetchModelsByMakeId:', error);
      }
    }
  };

  // Handle model selection and fetch trims
  const handleModelChange = async (modelId: string) => {
    const selectedModel = findModelById(modelId);
    console.log('🎯 Model selected:', modelId, 'Model name:', selectedModel?.model_name);
    
    // Update parent state immediately
    onModelChange(modelId);
    onTrimChange(''); // Reset trim
    
    // Fetch trims if we have both model and year
    if (modelId && selectedYear) {
      await fetchTrimsByModelId(modelId, selectedYear);
    }
  };

  // Handle year change and refetch trims
  const handleYearChange = (year: number) => {
    console.log('🎯 Year selected:', year);
    
    // Update parent state immediately
    onYearChange(year);
    onTrimChange(''); // Reset trim
    
    // Fetch trims if we have both model and year
    if (selectedModelId) {
      fetchTrimsByModelId(selectedModelId, year);
    }
  };

  // Generate year options
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const gridClass = compact 
    ? "grid grid-cols-2 gap-3" 
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4";

  // Get detailed error messages
  const getModelSelectPlaceholder = () => {
    if (!selectedMakeId) return "Select make first";
    if (isLoading) return "Loading models...";
    if (error) return error;
    if (models.length === 0) return "No models available";
    return "Select model";
  };

  const getModelSelectStatus = () => {
    if (!selectedMakeId) return "disabled";
    if (isLoading) return "loading";
    if (error) return "error";
    if (models.length === 0) return "empty";
    return "ready";
  };

  return (
    <div className="space-y-4">
      {/* Error Display */}
      {error && (
        <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <div>
            <div className="font-medium">Database Error</div>
            <div>{error}</div>
            {selectedMakeId && (
              <div className="text-xs mt-1 text-red-400">
                Make ID: {selectedMakeId} ({findMakeById(selectedMakeId)?.make_name || 'Unknown'})
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-md flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading vehicle data...
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
            disabled={isDisabled || (isLoading && !selectedMakeId)}
          >
            <SelectTrigger>
              <SelectValue placeholder={isLoading && !makes.length ? "Loading makes..." : "Select make"} />
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
                <SelectItem key={`all-${make.id}`} value={make.id}>
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
            disabled={isDisabled || !selectedMakeId || getModelSelectStatus() === "loading"}
          >
            <SelectTrigger className={
              getModelSelectStatus() === "error" ? "border-red-300" : 
              getModelSelectStatus() === "empty" ? "border-yellow-300" : ""
            }>
              <div className="flex items-center gap-2 w-full">
                {getModelSelectStatus() === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
                {getModelSelectStatus() === "error" && <AlertCircle className="w-4 h-4 text-red-500" />}
                {getModelSelectStatus() === "empty" && <Database className="w-4 h-4 text-yellow-500" />}
                <SelectValue placeholder={getModelSelectPlaceholder()} />
              </div>
            </SelectTrigger>
            <SelectContent className="max-h-80">
              <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-50">
                Models ({models.length})
                {selectedMakeId && (
                  <span className="ml-2 text-blue-600">
                    for {findMakeById(selectedMakeId)?.make_name}
                  </span>
                )}
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
                <div className="flex items-center gap-2 w-full">
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <SelectValue placeholder={
                    !selectedModelId || !selectedYear 
                      ? "Select model & year first" 
                      : isLoading 
                        ? "Loading trims..."
                        : trims.length === 0
                          ? "No trims available"
                          : "Select trim"
                  } />
                </div>
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

      {/* Debug Information (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs text-gray-600">
          <div className="font-semibold mb-2 flex items-center gap-2">
            <Database className="w-3 h-3" />
            Debug Information
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <strong>Selected Make ID:</strong> {selectedMakeId || 'none'}
            </div>
            <div>
              <strong>Available Models:</strong> {models.length}
            </div>
            <div>
              <strong>Loading State:</strong> {isLoading ? 'true' : 'false'}
            </div>
            <div>
              <strong>Error State:</strong> {error || 'none'}
            </div>
            {debugInfo.lastMakeQuery && (
              <>
                <div>
                  <strong>Last Query:</strong> {debugInfo.lastMakeQuery}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <strong>Query Time:</strong> {debugInfo.queryExecutionTime}ms
                </div>
              </>
            )}
            {debugInfo.lastModelQueryResult && (
              <div className="col-span-2 mt-2 p-2 bg-gray-200 rounded text-xs">
                <strong>Last Query Result:</strong>
                <pre className="mt-1 whitespace-pre-wrap">
                  {JSON.stringify({
                    count: debugInfo.lastModelQueryResult.count,
                    dataLength: debugInfo.lastModelQueryResult.data?.length,
                    error: debugInfo.lastModelQueryResult.error?.message,
                    queryTime: debugInfo.lastModelQueryResult.queryTime
                  }, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
