import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import process from "node:process";

// Load environment variables from .env file
dotenv.config();

// Parse command line arguments
const argv = yargs(hideBin(process.argv))
  .option("reset", {
    alias: "r",
    description: "Reset existing test data before generating new data",
    type: "boolean",
    default: false,
  })
  .option("env", {
    alias: "e",
    description: "Environment (.env file) to use",
    type: "string",
    default: ".env",
  })
  .help()
  .alias("help", "h")
  .argv as any;

async function generateTestData() {
  // Create a Supabase client with the service role key for admin operations
  const supabaseUrl = import.meta.env.SUPABASE_URL;
  const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error(
      "Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in your environment",
    );
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

    argv.reset
      ? "Resetting existing test data first"
      : "Preserving existing test data",
  );

  try {
    // Call the database function to generate test data
    const { data, error } = await supabase
      .rpc("generate_test_data", { reset_existing: argv.reset });

    if (error) {
      throw error;
    }


    // Output a message about how to use the test data
      "You can use this data for running tests or local development.",
    );
  } catch (error: any) {
    console.error("❌ Error generating test data:", error.message);
    process.exit(1);
  }
}

// Run the script
generateTestData();
