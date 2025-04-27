
import { supabase } from '@/integrations/supabase/client';
import { Make, Model } from '@/hooks/types/vehicle';
import { toast } from 'sonner';

// Mock data for makes and models since we've removed the tables
const mockMakes: Make[] = [
  { id: 'toyota', make_name: 'Toyota', logo_url: null, country_of_origin: 'Japan', nhtsa_make_id: null, description: null, founding_year: null },
  { id: 'honda', make_name: 'Honda', logo_url: null, country_of_origin: 'Japan', nhtsa_make_id: null, description: null, founding_year: null },
  { id: 'ford', make_name: 'Ford', logo_url: null, country_of_origin: 'USA', nhtsa_make_id: null, description: null, founding_year: null },
  { id: 'chevrolet', make_name: 'Chevrolet', logo_url: null, country_of_origin: 'USA', nhtsa_make_id: null, description: null, founding_year: null },
  { id: 'bmw', make_name: 'BMW', logo_url: null, country_of_origin: 'Germany', nhtsa_make_id: null, description: null, founding_year: null },
  { id: 'mercedes', make_name: 'Mercedes-Benz', logo_url: null, country_of_origin: 'Germany', nhtsa_make_id: null, description: null, founding_year: null },
  { id: 'audi', make_name: 'Audi', logo_url: null, country_of_origin: 'Germany', nhtsa_make_id: null, description: null, founding_year: null },
  { id: 'volvo', make_name: 'Volvo', logo_url: null, country_of_origin: 'Sweden', nhtsa_make_id: null, description: null, founding_year: null }
];

const mockModelsMap: Record<string, Model[]> = {
  'toyota': [
    { id: 'camry', model_name: 'Camry', make_id: 'toyota', nhtsa_model_id: null },
    { id: 'corolla', model_name: 'Corolla', make_id: 'toyota', nhtsa_model_id: null },
    { id: 'rav4', model_name: 'RAV4', make_id: 'toyota', nhtsa_model_id: null }
  ],
  'honda': [
    { id: 'civic', model_name: 'Civic', make_id: 'honda', nhtsa_model_id: null },
    { id: 'accord', model_name: 'Accord', make_id: 'honda', nhtsa_model_id: null },
    { id: 'crv', model_name: 'CR-V', make_id: 'honda', nhtsa_model_id: null }
  ],
  'ford': [
    { id: 'f150', model_name: 'F-150', make_id: 'ford', nhtsa_model_id: null },
    { id: 'mustang', model_name: 'Mustang', make_id: 'ford', nhtsa_model_id: null },
    { id: 'explorer', model_name: 'Explorer', make_id: 'ford', nhtsa_model_id: null }
  ],
  'chevrolet': [
    { id: 'silverado', model_name: 'Silverado', make_id: 'chevrolet', nhtsa_model_id: null },
    { id: 'malibu', model_name: 'Malibu', make_id: 'chevrolet', nhtsa_model_id: null },
    { id: 'equinox', model_name: 'Equinox', make_id: 'chevrolet', nhtsa_model_id: null }
  ],
  'bmw': [
    { id: '3series', model_name: '3 Series', make_id: 'bmw', nhtsa_model_id: null },
    { id: '5series', model_name: '5 Series', make_id: 'bmw', nhtsa_model_id: null },
    { id: 'x5', model_name: 'X5', make_id: 'bmw', nhtsa_model_id: null }
  ],
  'mercedes': [
    { id: 'cclass', model_name: 'C-Class', make_id: 'mercedes', nhtsa_model_id: null },
    { id: 'eclass', model_name: 'E-Class', make_id: 'mercedes', nhtsa_model_id: null },
    { id: 'gclass', model_name: 'G-Class', make_id: 'mercedes', nhtsa_model_id: null }
  ],
  'audi': [
    { id: 'a4', model_name: 'A4', make_id: 'audi', nhtsa_model_id: null },
    { id: 'q5', model_name: 'Q5', make_id: 'audi', nhtsa_model_id: null },
    { id: 'a6', model_name: 'A6', make_id: 'audi', nhtsa_model_id: null }
  ],
  'volvo': [
    { id: 'xc90', model_name: 'XC90', make_id: 'volvo', nhtsa_model_id: null },
    { id: 's60', model_name: 'S60', make_id: 'volvo', nhtsa_model_id: null },
    { id: 'v60', model_name: 'V60', make_id: 'volvo', nhtsa_model_id: null }
  ]
};

export async function fetchVehicleData() {
  console.log("Fetching vehicle data (mock data)...");
  
  try {
    // Now we'll return mock data directly
    console.log(`Returning ${mockMakes.length} makes and models from mock data`);
    
    return {
      makes: mockMakes,
      models: Object.values(mockModelsMap).flat()
    };
  } catch (error) {
    console.error("Exception in fetchVehicleData:", error);
    toast.error("Couldn't fetch vehicle data");
    return {
      makes: mockMakes,
      models: Object.values(mockModelsMap).flat()
    };
  }
}

export async function getMakeById(id: string): Promise<Make | null> {
  try {
    // Find make in mock data
    const make = mockMakes.find(make => make.id === id);
    
    if (make) {
      return make;
    }
    return null;
  } catch (error) {
    console.error("Error fetching make by ID:", error);
    return null;
  }
}

export async function getModelById(id: string): Promise<Model | null> {
  try {
    // Find model in mock data
    const allModels = Object.values(mockModelsMap).flat();
    const model = allModels.find(model => model.id === id);
    
    if (model) {
      return model;
    }
    return null;
  } catch (error) {
    console.error("Error fetching model by ID:", error);
    return null;
  }
}

export async function getModelsByMakeId(makeId: string): Promise<Model[]> {
  try {
    // Return models for this make from mock data
    return mockModelsMap[makeId] || [];
  } catch (error) {
    console.error("Error fetching models by make ID:", error);
    return [];
  }
}
