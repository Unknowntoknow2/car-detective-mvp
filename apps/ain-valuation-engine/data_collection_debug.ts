// data_collection_debug.ts
import { valuateVehicle } from "./src/ain-backend/valuationEngine";
import { VehicleData } from "./src/types/ValuationTypes";

async function main() {
  const vin = process.argv[2];
  const mileage = parseInt(process.argv[3] || "95000", 10);
  const zip = process.argv[4] || "95821";
  const condition = process.argv[5] || "Very Good";
  const titleStatus = process.argv[6] || "Clean";
  const color = process.argv[7] || "White";

  if (!vin) {
    console.error("❌ Please provide a VIN as an argument");
    console.error("   Example: npx tsx data_collection_debug.ts 4T1K31AK5PU607399 97104 95821 'Very Good' 'Clean' White");
    process.exit(1);
  }

  const vehicleData: VehicleData = {
    vin,
    year: 2023, // fallback, should be filled by decode
    make: "Toyota",
    model: "Camry",
    trim: "XSE",
    mileage,
    zip,
    condition,
    titleStatus,
    color,
  };

  console.log("🔍 Starting Data Collection Debug with input:");
  console.log(JSON.stringify(vehicleData, null, 2));

  try {
    const result = await valuateVehicle(vehicleData);

    if (!result) {
      console.error("❌ Valuation engine returned null/undefined.");
      process.exit(2);
    }

    console.log("✅ Data Collection Debug Output:");
    console.log(JSON.stringify(result, null, 2));

    console.log("🎯 Data collection + comps fetch completed successfully.");
  } catch (err: any) {
    console.error("❌ Data collection debug failed:", err.message || err);
    process.exit(99);
  }
}

main();
