
// This edge function fetches vehicle make and model data from the NHTSA vPIC API
// and stores it in the Supabase database

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.5.0";

interface VehicleMake {
  Make_ID: number;
  Make_Name: string;
}

interface VehicleModel {
  Make_ID: number;
  Make_Name: string;
  Model_ID: number;
  Model_Name: string;
}

async function fetchAllMakes(): Promise<VehicleMake[]> {
  const response = await fetch("https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json");
  const data = await response.json();
  return data.Results;
}

async function fetchModelsForMake(makeName: string): Promise<VehicleModel[]> {
  const encodedMakeName = encodeURIComponent(makeName);
  const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${encodedMakeName}?format=json`);
  const data = await response.json();
  return data.Results;
}

// Popular car manufacturers in the US market to prioritize
const popularMakes = [
  "Toyota", "Honda", "Ford", "Chevrolet", "Nissan", "Hyundai", "Kia", "Subaru", 
  "Volkswagen", "BMW", "Mercedes-Benz", "Audi", "Lexus", "Jeep", "Mazda", 
  "Tesla", "Volvo", "Acura", "Dodge", "Ram", "GMC", "Buick", "Cadillac", 
  "Chrysler", "Infiniti", "Lincoln", "Porsche", "Land Rover", "Jaguar"
];

// Logo URL patterns for popular manufacturers
const getLogoUrl = (makeName: string): string => {
  // Clean up make name for URL usage
  const cleanMakeName = makeName.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Special cases for certain manufacturers
  const specialCases: Record<string, string> = {
    'mercedesbenz': 'mercedes-benz',
    'landrover': 'landrover',
    'ram': 'ramtrucks'
  };
  
  const urlName = specialCases[cleanMakeName] || cleanMakeName;
  return `https://logo.clearbit.com/${urlName}.com`;
};

serve(async (req) => {
  // Create a Supabase client with the project URL and anon key
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    // Get all makes from the API
    const allMakes = await fetchAllMakes();
    console.log(`Fetched ${allMakes.length} makes from NHTSA API`);
    
    // Filter for popular makes to limit the dataset
    const priorityMakes = allMakes.filter(make => 
      popularMakes.some(popularMake => 
        make.Make_Name.toLowerCase() === popularMake.toLowerCase()
      )
    );
    
    // Add other makes that might be less common but still relevant
    const otherMakes = allMakes.filter(make => 
      !priorityMakes.some(priorityMake => 
        priorityMake.Make_ID === make.Make_ID
      ) && 
      make.Make_Name.length > 1 && // Filter out single-character makes which are usually errors
      !/[0-9]/.test(make.Make_Name) // Filter out makes with numbers which are usually incorrect
    ).slice(0, 100); // Limit to 100 additional makes
    
    // Combine the filtered makes
    const filteredMakes = [...priorityMakes, ...otherMakes];
    console.log(`Filtered to ${filteredMakes.length} relevant makes`);

    // Prepare data for insertion
    const makesForInsert = filteredMakes.map(make => ({
      id: crypto.randomUUID(),
      make_name: make.Make_Name,
      logo_url: getLogoUrl(make.Make_Name),
      nhtsa_make_id: make.Make_ID
    }));

    // Insert makes into the database
    const { error: makesError } = await supabase
      .from('makes')
      .upsert(makesForInsert, { 
        onConflict: 'nhtsa_make_id',
        ignoreDuplicates: false 
      });

    if (makesError) {
      throw new Error(`Error inserting makes: ${makesError.message}`);
    }

    // Get the inserted makes to reference their UUIDs
    const { data: insertedMakes, error: fetchError } = await supabase
      .from('makes')
      .select('id, make_name, nhtsa_make_id');

    if (fetchError) {
      throw new Error(`Error fetching inserted makes: ${fetchError.message}`);
    }

    // Create a mapping for make IDs to UUIDs
    const makeIdToUUID = insertedMakes.reduce((acc, make) => {
      acc[make.nhtsa_make_id] = make.id;
      return acc;
    }, {} as Record<number, string>);

    let modelsInserted = 0;

    // Fetch models for each make and insert them into the database
    for (const make of filteredMakes) {
      try {
        const models = await fetchModelsForMake(make.Make_Name);
        console.log(`Fetched ${models.length} models for ${make.Make_Name}`);

        // Ensure we have a UUID for this make
        const makeUUID = makeIdToUUID[make.Make_ID];
        if (!makeUUID) {
          console.log(`Skipping models for ${make.Make_Name} - no UUID found`);
          continue;
        }

        // Prepare models for insertion
        const modelsForInsert = models.map(model => ({
          id: crypto.randomUUID(),
          model_name: model.Model_Name,
          make_id: makeUUID,
          nhtsa_model_id: model.Model_ID
        }));

        // Insert models into the database
        const { error: modelsError } = await supabase
          .from('models')
          .upsert(modelsForInsert, { 
            onConflict: 'nhtsa_model_id',
            ignoreDuplicates: false 
          });

        if (modelsError) {
          throw new Error(`Error inserting models for ${make.Make_Name}: ${modelsError.message}`);
        }

        modelsInserted += models.length;
      } catch (error) {
        console.error(`Error processing models for ${make.Make_Name}:`, error);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully processed ${filteredMakes.length} makes and ${modelsInserted} models`,
        makes: filteredMakes.length,
        models: modelsInserted
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in fetch-vehicle-data function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
