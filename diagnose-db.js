
// diagnose-db.js
import { createClient } from '@supabase/supabase-js';

// Use the same credentials as your application
const SUPABASE_URL = "https://xltxqqzattxogxtqrggt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsdHhxcXphdHR4b2d4dHFyZ2d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NTYxMjYsImV4cCI6MjA2MTAzMjEyNn0.kUPmsyUdpcpnPLHWlnP7vODQiRgzCrWjOBfLib3lpvY";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function run() {
  console.log("Checking Supabase tables for vehicle data...");
  
  // Check the makes table
  console.log("\nChecking 'makes' table:");
  const { data: makes, error: makesError } = await supabase
    .from('makes')
    .select('*')
    .limit(5);
  
  if (makesError) {
    console.error("Error fetching makes:", makesError);
  } else {
    console.log(`Found ${makes?.length || 0} makes in the database.`);
    console.log("Sample makes:", makes);
  }
  
  // Check the models table
  console.log("\nChecking 'models' table:");
  const { data: models, error: modelsError } = await supabase
    .from('models')
    .select('*')
    .limit(5);
  
  if (modelsError) {
    console.error("Error fetching models:", modelsError);
  } else {
    console.log(`Found ${models?.length || 0} models in the database.`);
    console.log("Sample models:", models);
  }
  
  // Checking RLS (Row Level Security) permissions
  console.log("\nChecking RLS permissions for these tables:");
  try {
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_table_permissions', { table_name: 'makes' });
    
    if (tablesError) {
      console.log("Could not check RLS permissions programmatically:", tablesError);
      console.log("This is expected if the RPC function doesn't exist.");
    } else {
      console.log("RLS Permissions:", tables);
    }
  } catch (error) {
    console.log("Could not check RLS permissions:", error.message);
  }
  
  console.log("\nDiagnosis complete!");
}

run().catch(console.error);
