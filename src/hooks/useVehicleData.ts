
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { VEHICLE_MAKES, VEHICLE_MODELS } from '@/data/vehicle-data';

export interface Make {
  id: string;
  make_name: string;
  logo_url?: string;
}

export interface Model {
  id: string;
  make_id: string;
  model_name: string;
}

export interface Trim {
  id: string;
  model_id: string;
  trim_name: string;
  year?: number;
  fuel_type?: string;
  transmission?: string;
}

export function useVehicleData() {
  const [makes, setMakes] = useState<Make[]>([]);
  const [modelsList, setModelsList] = useState<Model[]>([]); 
  const [trimsList, setTrimsList] = useState<Trim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch makes from Supabase
  useEffect(() => {
    async function fetchMakes() {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('makes')
          .select('id, make_name')
          .order('make_name');
          
        if (error) {
          console.error('Error fetching makes from Supabase:', error);
          // Fall back to local data
          const localMakes: Make[] = VEHICLE_MAKES.map((makeName, index) => ({
            id: String(index + 1),
            make_name: makeName
          }));
          setMakes(localMakes);
        } else if (data && data.length > 0) {
          setMakes(data);
        } else {
          // If no data in Supabase, use local data
          const localMakes: Make[] = VEHICLE_MAKES.map((makeName, index) => ({
            id: String(index + 1),
            make_name: makeName
          }));
          setMakes(localMakes);
        }
      } catch (err) {
        console.error('Error in fetchMakes:', err);
        setError('Failed to load vehicle makes');
        
        // Fall back to local data
        const localMakes: Make[] = VEHICLE_MAKES.map((makeName, index) => ({
          id: String(index + 1),
          make_name: makeName
        }));
        setMakes(localMakes);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchMakes();
  }, []);

  // Function to get models for a make
  const getModelsByMake = useCallback(async (makeName: string): Promise<Model[]> => {
    try {
      console.log('Fetching models for make:', makeName);
      // Find the make id
      const make = makes.find(m => m.make_name === makeName);
      
      if (make) {
        // Try to fetch from Supabase first
        const { data, error } = await supabase
          .from('models')
          .select('id, make_id, model_name')
          .eq('make_id', make.id)
          .order('model_name');
          
        if (error) {
          console.error('Error fetching models from Supabase:', error);
          // Fall back to filtered local data
          const filteredModels = getFilteredLocalModels(makeName);
          setModelsList(prevModels => [...prevModels, ...filteredModels]);
          return filteredModels;
        }
        
        if (data && data.length > 0) {
          setModelsList(data); // Update the models list state
          return data;
        }
        
        // If no models found in Supabase, use filtered local data
        const filteredModels = getFilteredLocalModels(makeName);
        setModelsList(prevModels => [...prevModels, ...filteredModels]);
        return filteredModels;
      }
      
      // Fallback to filtered local data if make not found
      const filteredModels = getFilteredLocalModels(makeName);
      setModelsList(prevModels => [...prevModels, ...filteredModels]);
      return filteredModels;
    } catch (err) {
      console.error('Error in getModelsByMake:', err);
      const filteredModels = getFilteredLocalModels(makeName);
      return filteredModels;
    }
  }, [makes]);

  // Function to get trims for a model
  const getTrimsByModel = useCallback(async (modelId: string): Promise<Trim[]> => {
    try {
      console.log('Fetching trims for model ID:', modelId);
      
      // Try to fetch from Supabase
      const { data, error } = await supabase
        .from('model_trims')
        .select('id, model_id, trim_name, year, fuel_type, transmission')
        .eq('model_id', modelId)
        .order('trim_name');
        
      if (error) {
        console.error('Error fetching trims from Supabase:', error);
        return [];
      }
      
      if (data && data.length > 0) {
        setTrimsList(data);
        return data;
      }
      
      // If no trims found, return empty array
      return [];
    } catch (err) {
      console.error('Error in getTrimsByModel:', err);
      return [];
    }
  }, []);

  // Helper function to filter local models based on make
  const getFilteredLocalModels = (makeName: string): Model[] => {
    // This is a more comprehensive mapping of makes to models
    const makeModelsMap: Record<string, string[]> = {
      'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Tacoma', 'Tundra', '4Runner', 'Sienna', 'Prius', 'Avalon', 'Land Cruiser', 'Sequoia', 'C-HR', 'Venza', 'GR86', 'Supra', 'bZ4X'],
      'Honda': ['Accord', 'Civic', 'CR-V', 'Pilot', 'Odyssey', 'Fit', 'HR-V', 'Ridgeline', 'Passport', 'Insight', 'Clarity', 'Element', 'S2000', 'Prelude'],
      'Ford': ['F-150', 'Mustang', 'Explorer', 'Escape', 'Edge', 'Fusion', 'Ranger', 'Bronco', 'Expedition', 'EcoSport', 'Mach-E', 'Maverick', 'Transit', 'Focus', 'Fiesta'],
      'Chevrolet': ['Silverado', 'Camaro', 'Equinox', 'Malibu', 'Traverse', 'Tahoe', 'Suburban', 'Colorado', 'Trax', 'Blazer', 'Bolt', 'Corvette', 'Impala', 'Spark', 'Trailblazer'],
      'BMW': ['3 Series', '5 Series', 'X3', 'X5', '7 Series', 'X1', 'X7', '4 Series', '8 Series', 'Z4', 'i4', 'i3', 'i7', 'i8', 'M3', 'M4', 'M5', 'M8', 'X6', 'X4', 'X2', 'iX'],
      'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE', 'A-Class', 'GLA', 'GLB', 'GLS', 'G-Class', 'CLA', 'CLS', 'SL', 'AMG GT', 'EQS', 'EQE', 'Maybach'],
      'Audi': ['A4', 'Q5', 'A6', 'Q7', 'A3', 'Q3', 'A8', 'e-tron', 'Q8', 'A5', 'A7', 'Q4 e-tron', 'TT', 'R8', 'S4', 'S5', 'S6', 'S7', 'S8', 'RS6', 'RS7'],
      'Nissan': ['Altima', 'Rogue', 'Sentra', 'Pathfinder', 'Murano', 'Maxima', 'Frontier', 'Titan', 'Kicks', 'Armada', 'Versa', 'Leaf', 'GT-R', '370Z', 'Z', 'Juke'],
      'Hyundai': ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Kona', 'Palisade', 'Venue', 'Accent', 'Ioniq', 'Veloster', 'Nexo', 'Ioniq 5', 'Ioniq 6', 'Santa Cruz'],
      'Kia': ['Forte', 'Sportage', 'Sorento', 'Telluride', 'Soul', 'Seltos', 'K5', 'Optima', 'Niro', 'Carnival', 'Stinger', 'EV6', 'Rio', 'Cadenza', 'Sedona'],
      'Volkswagen': ['Jetta', 'Tiguan', 'Atlas', 'Passat', 'Golf', 'Taos', 'ID.4', 'Arteon', 'GTI', 'Atlas Cross Sport', 'Golf R', 'Touareg'],
      'Subaru': ['Outback', 'Forester', 'Crosstrek', 'Impreza', 'Legacy', 'Ascent', 'WRX', 'BRZ', 'Solterra'],
      'Mazda': ['CX-5', 'Mazda3', 'CX-9', 'Mazda6', 'CX-30', 'MX-5 Miata', 'CX-50', 'CX-3'],
      'Lexus': ['RX', 'ES', 'NX', 'IS', 'GX', 'UX', 'LS', 'LX', 'LC', 'RC', 'RZ', 'CT', 'GS'],
      'Acura': ['MDX', 'RDX', 'TLX', 'ILX', 'NSX', 'Integra', 'RLX', 'ZDX', 'TSX', 'RSX', 'TL'],
      'Jeep': ['Grand Cherokee', 'Wrangler', 'Cherokee', 'Compass', 'Renegade', 'Gladiator', 'Wagoneer', 'Grand Wagoneer'],
      'Tesla': ['Model 3', 'Model Y', 'Model S', 'Model X', 'Cybertruck', 'Roadster'],
      'Volvo': ['XC90', 'XC60', 'S60', 'XC40', 'V60', 'S90', 'V90', 'C40', 'S40', 'V40']
    };
    
    // If we have a mapping for this make, use it
    const modelsForMake = makeModelsMap[makeName] || [];
    
    // If no specific mapping, try to find models that might match this make from our static data
    if (modelsForMake.length === 0) {
      const fallbackModels = VEHICLE_MODELS.slice(0, 10); // Use the first 10 models as a fallback
      return fallbackModels.map((modelName, index) => ({
        id: `local-${index}`,
        make_id: makes.find(m => m.make_name === makeName)?.id || 'unknown',
        model_name: modelName
      }));
    }
    
    // Return the mapped models
    return modelsForMake.map((modelName, index) => ({
      id: `local-${makeName}-${index}`,
      make_id: makes.find(m => m.make_name === makeName)?.id || 'unknown',
      model_name: modelName
    }));
  };

  // Function to get default trims for a model if none are found in the database
  const getDefaultTrims = (modelName: string): Trim[] => {
    const defaultTrims: Record<string, string[]> = {
      'Camry': ['LE', 'SE', 'XLE', 'XSE', 'TRD'],
      'Civic': ['LX', 'Sport', 'EX', 'Touring'],
      'F-150': ['XL', 'XLT', 'Lariat', 'King Ranch', 'Platinum', 'Limited', 'Raptor'],
      'Mustang': ['EcoBoost', 'GT', 'Mach 1', 'Shelby GT500'],
      'Model 3': ['Standard Range', 'Long Range', 'Performance'],
      '3 Series': ['330i', '330e', 'M340i', 'M3']
    };

    const trims = defaultTrims[modelName] || ['Base', 'Standard', 'Premium', 'Limited', 'Sport'];
    
    return trims.map((trimName, index) => ({
      id: `default-${modelName}-${index}`,
      model_id: 'unknown',
      trim_name: trimName
    }));
  };

  // Function to get years range
  const getYearOptions = useCallback(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 50 }, (_, i) => currentYear - i);
  }, []);

  // Function to refresh data
  const refreshData = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    
    try {
      const { data: makesData, error: makesError } = await supabase
        .from('makes')
        .select('id, make_name')
        .order('make_name');
        
      if (makesError) {
        throw makesError;
      }
      
      if (makesData && makesData.length > 0) {
        setMakes(makesData);
      }
      
      // For demo purposes, let's just return a success message
      return {
        success: true,
        makeCount: makesData?.length || 0,
        modelCount: modelsList.length
      };
    } catch (error) {
      console.error('Error refreshing vehicle data:', error);
      return { success: false, makeCount: 0, modelCount: 0 };
    } finally {
      setIsLoading(false);
    }
  }, [modelsList.length]);

  // Calculate counts
  const counts = {
    makes: makes.length,
    models: modelsList.length,
    trims: trimsList.length
  };

  return {
    makes,
    models: modelsList,
    trims: trimsList,
    isLoading,
    error,
    getModelsByMake,
    getTrimsByModel,
    getDefaultTrims,
    getYearOptions,
    refreshData,
    counts
  };
}
