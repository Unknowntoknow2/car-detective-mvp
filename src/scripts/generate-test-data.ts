
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// Load environment variables from .env file
dotenv.config();

// Parse command line arguments
const argv = yargs(hideBin(process.argv))
  .option('reset', {
    alias: 'r',
    description: 'Reset existing test data before generating new data',
    type: 'boolean',
    default: false,
  })
  .option('env', {
    alias: 'e',
    description: 'Environment (.env file) to use',
    type: 'string',
    default: '.env',
  })
  .help()
  .alias('help', 'h')
  .argv as any;

async function generateTestData() {
  // Create a Supabase client with the service role key for admin operations
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in your environment');
    process.exit(1);
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  console.log('Generating test data...');
  console.log(argv.reset ? 'Resetting existing test data first' : 'Preserving existing test data');
  
  try {
    // Call the database function to generate test data
    const { data, error } = await supabase
      .rpc('generate_test_data', { reset_existing: argv.reset });
      
    if (error) {
      throw error;
    }
    
    console.log('✅ Test data generation successful!');
    console.log('Generated data:', data);
    
    // Output a message about how to use the test data
    console.log('\nTest data is now available in your database.');
    console.log('You can use this data for running tests or local development.');
    console.log('Valuation IDs:', data.valuations);
    
  } catch (error: any) {
    console.error('❌ Error generating test data:', error.message);
    process.exit(1);
  }
}

// Run the script
generateTestData();
