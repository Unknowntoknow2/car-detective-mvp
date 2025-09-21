
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Star, AlertCircle, Loader2, CheckCircle, Clock } from 'lucide-react';
import { useMakeModels } from '@/hooks/useMakeModels';
import { SkeletonSelect } from '@/components/ui/skeleton-select';
import { cn } from '@/lib/utils';

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
    findMakeById,
    findModelById,
    getPopularMakes,
    getNonPopularMakes,
  } = useMakeModels();

  const [makeSearchQuery, setMakeSearchQuery] = useState('');

  // Get popular and non-popular makes to prevent duplicates
  const popularMakes = getPopularMakes();
  const nonPopularMakes = getNonPopularMakes();

  // Handle make selection and fetch models
  const handleMakeChange = async (makeId: string) => {
    const selectedMake = findMakeById(makeId);
      makeId,
      makeName: selectedMake?.make_name,
    });
    
    onMakeChange(makeId);
    onModelChange('');
    onTrimChange('');
    
    if (makeId && makeId.trim() !== '') {
      try {
        await fetchModelsByMakeId(makeId);
      } catch (error) {
        console.error('❌ Error in handleMakeChange:', error);
      }
    }
  };

  // Handle model selection and fetch trims
  const handleModelChange = async (modelId: string) => {
    const selectedModel = findModelById(modelId);
    
    onModelChange(modelId);
    onTrimChange('');
    
    if (modelId && selectedYear) {
      await fetchTrimsByModelId(modelId, selectedYear);
    }
  };

  // Handle year change and refetch trims
  const handleYearChange = (year: number) => {
    
    onYearChange(year);
    onTrimChange('');
    
    if (selectedModelId) {
      fetchTrimsByModelId(selectedModelId, year);
    }
  };

  // Generate year options
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  // Always show trim when requested, use 4-column layout
  const gridClass = compact 
    ? "grid grid-cols-2 gap-4" 
    : showTrim
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";

  // Enhanced status checking for models
  const getModelSelectStatus = () => {
    if (!selectedMakeId) return "disabled";
    if (isLoading) return "loading";
    if (error) return "error";
    if (models.length === 0 && !isLoading) return "empty";
    return "ready";
  };

  const getModelSelectPlaceholder = () => {
    if (!selectedMakeId) return "Select make first";
    if (isLoading) return "Loading models...";
    if (error && error.includes('No models found')) return error;
    if (error) return "Database error";
    if (models.length === 0 && !isLoading) return "No models available";
    return "Select model";
  };

  // Trim field status and placeholder - always allow selection
  const getTrimSelectStatus = () => {
    if (!selectedModelId || !selectedYear) return "disabled";
    if (isLoading) return "loading";
    return "ready";
  };

  const getTrimSelectPlaceholder = () => {
    if (!selectedModelId) return "Select model first";
    if (!selectedYear) return "Select year first";
    if (isLoading) return "Loading trims...";
    return "Select trim (optional)";
  };

  // Status indicator component
  const StatusIndicator = ({ status, className }: { status: string; className?: string }) => {
    const icons = {
      loading: <Loader2 className="w-4 h-4 animate-spin text-blue-500" />,
      error: <AlertCircle className="w-4 h-4 text-red-500" />,
      success: <CheckCircle className="w-4 h-4 text-green-500" />,
      empty: <AlertCircle className="w-4 h-4 text-yellow-500" />
    };
    
    return <div className={className}>{icons[status as keyof typeof icons]}</div>;
  };

  // Loading skeleton for initial load
  if (isLoading && makes.length === 0) {
    return (
      <div className="space-y-6">
        <div className={gridClass}>
          <SkeletonSelect label="Make" />
          <SkeletonSelect label="Model" />
          {showYear && <SkeletonSelect label="Year" />}
          {showTrim && <SkeletonSelect label="Trim Level" />}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <div className="font-semibold text-red-900 mb-1">Data Loading Error</div>
            <div className="text-red-700 text-sm">{error}</div>
            {selectedMakeId && (
              <div className="text-xs mt-2 text-red-600 bg-red-100 px-2 py-1 rounded">
                Make: {findMakeById(selectedMakeId)?.make_name || 'Unknown'} (ID: {selectedMakeId})
              </div>
            )}
          </div>
        </div>
      )}

      {/* Professional Loading Indicator */}
      {isLoading && makes.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <div className="flex-1">
            <div className="font-medium text-blue-900">Loading vehicle data...</div>
            {selectedMakeId && (
              <div className="text-sm text-blue-700 mt-1">
                Fetching models for {findMakeById(selectedMakeId)?.make_name}
              </div>
            )}
          </div>
        </div>
      )}

      <div className={gridClass}>
        {/* Enhanced Make Selection */}
        <div className="space-y-3">
          <Label htmlFor="make" className="text-sm font-semibold text-gray-900 flex items-center gap-1">
            Vehicle Make 
            <span className="text-red-500 text-xs">*</span>
          </Label>
          
          <Select 
            value={selectedMakeId || ""} 
            onValueChange={handleMakeChange}
            disabled={isDisabled || (isLoading && !selectedMakeId)}
          >
            <SelectTrigger className={cn(
              "h-12 border-2 transition-all duration-200",
              "hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
              "bg-white shadow-sm"
            )}>
              <SelectValue 
                placeholder={isLoading && !makes.length ? "Loading makes..." : "Select vehicle make"} 
                className="text-gray-900"
              />
            </SelectTrigger>
            <SelectContent className="max-h-80 bg-white border-2 shadow-xl z-50">
              {/* Popular Makes Section */}
              {popularMakes.length > 0 && (
                <>
                  <div className="px-3 py-2 text-xs font-bold text-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                    ⭐ Popular Makes
                  </div>
                  {popularMakes.map((make) => (
                    <SelectItem 
                      key={`popular-${make.id}`} 
                      value={make.id}
                      className="hover:bg-blue-50 focus:bg-blue-50"
                    >
                      <div className="flex items-center gap-2">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                        <span className="font-medium">{make.make_name}</span>
                      </div>
                    </SelectItem>
                  ))}
                  <div className="border-t mx-2 my-1" />
                </>
              )}
              
              {/* All Other Makes */}
              <div className="px-3 py-2 text-xs font-bold text-gray-700 bg-gradient-to-r from-gray-50 to-slate-50 border-b">
                All Makes ({nonPopularMakes.length})
              </div>
              {nonPopularMakes.map((make) => (
                <SelectItem 
                  key={`all-${make.id}`} 
                  value={make.id}
                  className="hover:bg-gray-50 focus:bg-gray-50"
                >
                  <span className="font-medium">{make.make_name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Enhanced Model Selection */}
        <div className="space-y-3">
          <Label htmlFor="model" className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            Vehicle Model 
            <span className="text-red-500 text-xs">*</span>
            <Badge variant="outline" className="text-xs px-1.5 py-0.5">
              {models.length}
            </Badge>
            <StatusIndicator status={getModelSelectStatus()} />
          </Label>
          
          <Select 
            value={selectedModelId || ""} 
            onValueChange={handleModelChange}
            disabled={isDisabled || !selectedMakeId || getModelSelectStatus() === "loading"}
          >
            <SelectTrigger className={cn(
              "h-12 border-2 transition-all duration-200",
              "hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
              "bg-white shadow-sm",
              getModelSelectStatus() === "error" && "border-red-300 hover:border-red-400",
              !selectedMakeId && "bg-gray-50 cursor-not-allowed"
            )}>
              <SelectValue placeholder={getModelSelectPlaceholder()} />
            </SelectTrigger>
            <SelectContent className="max-h-80 bg-white border-2 shadow-xl z-50">
              <div className="px-3 py-2 text-xs font-bold text-gray-700 bg-gradient-to-r from-gray-50 to-slate-50 border-b">
                Models ({models.length})
                {selectedMakeId && (
                  <span className="ml-2 text-blue-600 font-normal">
                    for {findMakeById(selectedMakeId)?.make_name}
                  </span>
                )}
              </div>
              {models.map((model) => (
                <SelectItem 
                  key={model.id} 
                  value={model.id}
                  className="hover:bg-blue-50 focus:bg-blue-50"
                >
                  <div className="flex items-center gap-2">
                    {model.popular && <Star className="w-3 h-3 text-yellow-500" />}
                    <span className="font-medium">{model.model_name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Enhanced Year Selection */}
        {showYear && (
          <div className="space-y-3">
            <Label htmlFor="year" className="text-sm font-semibold text-gray-900 flex items-center gap-1">
              Model Year 
              <span className="text-red-500 text-xs">*</span>
            </Label>
            <Select 
              value={selectedYear?.toString() || ""} 
              onValueChange={(value) => handleYearChange(parseInt(value))}
              disabled={isDisabled}
            >
              <SelectTrigger className={cn(
                "h-12 border-2 transition-all duration-200",
                "hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                "bg-white shadow-sm"
              )}>
                <SelectValue placeholder="Select model year" />
              </SelectTrigger>
              <SelectContent className="max-h-80 bg-white border-2 shadow-xl z-50">
                <div className="px-3 py-2 text-xs font-bold text-gray-700 bg-gradient-to-r from-gray-50 to-slate-50 border-b">
                  Available Years
                </div>
                {years.map((year) => (
                  <SelectItem 
                    key={year} 
                    value={year.toString()}
                    className="hover:bg-blue-50 focus:bg-blue-50"
                  >
                    <span className="font-medium">{year}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Always Show Trim Selection when requested */}
        {showTrim && (
          <div className="space-y-3">
            <Label htmlFor="trim" className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              Trim Level
              <span className="text-xs text-gray-500">(Optional)</span>
              {trims.length > 0 && (
                <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                  {trims.length}
                </Badge>
              )}
            </Label>
            <Select 
              value={selectedTrimId || ""} 
              onValueChange={onTrimChange}
              disabled={isDisabled || getTrimSelectStatus() === "disabled" || isLoading}
            >
              <SelectTrigger className={cn(
                "h-12 border-2 transition-all duration-200",
                "hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                "bg-white shadow-sm",
                getTrimSelectStatus() === "disabled" && "bg-gray-50 cursor-not-allowed"
              )}>
                <div className="flex items-center gap-2 w-full">
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <SelectValue placeholder={getTrimSelectPlaceholder()} />
                </div>
              </SelectTrigger>
              <SelectContent className="max-h-80 bg-white border-2 shadow-xl z-50">
                {/* Always show the dropdown content area */}
                <div className="px-3 py-2 text-xs font-bold text-gray-700 bg-gradient-to-r from-gray-50 to-slate-50 border-b">
                  {trims.length > 0 ? `Available Trims (${trims.length})` : "No specific trims available"}
                </div>
                {trims.length > 0 ? (
                  trims.map((trim) => (
                    <SelectItem 
                      key={trim.id} 
                      value={trim.id}
                      className="hover:bg-blue-50 focus:bg-blue-50"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{trim.trim_name}</span>
                        {trim.msrp && (
                          <span className="text-xs text-green-600 font-medium">
                            MSRP: ${trim.msrp.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500 italic">
                    No specific trim levels found for this model and year combination.
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Enhanced Selected Vehicle Preview */}
      {selectedMakeId && selectedModelId && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300 font-medium">
              Selected Vehicle
            </Badge>
            <div className="flex-1">
              <span className="font-semibold text-gray-900">
                {findMakeById(selectedMakeId)?.make_name} {' '}
                {findModelById(selectedModelId)?.model_name}
                {selectedYear && ` ${selectedYear}`}
                {selectedTrimId && trims.find(t => t.id === selectedTrimId) && 
                  ` ${trims.find(t => t.id === selectedTrimId)?.trim_name}`
                }
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Minimal Debug Information (only in development) */}
      {import.meta.env.NODE_ENV === 'development' && (
        <details className="mt-6">
          <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700 flex items-center gap-2">
            <Clock className="w-3 h-3" />
            Debug Information
          </summary>
          <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs text-gray-600 border">
            <div className="grid grid-cols-2 gap-2">
              <div><strong>Selected Make:</strong> {selectedMakeId || 'none'}</div>
              <div><strong>Available Models:</strong> {models.length}</div>
              <div><strong>Loading:</strong> {isLoading ? 'yes' : 'no'}</div>
              <div><strong>Error:</strong> {error ? 'yes' : 'no'}</div>
              <div><strong>Total Makes:</strong> {makes.length}</div>
              <div><strong>Available Trims:</strong> {trims.length}</div>
              <div><strong>Show Trim:</strong> {showTrim ? 'yes' : 'no'}</div>
            </div>
          </div>
        </details>
      )}
    </div>
  );
}
