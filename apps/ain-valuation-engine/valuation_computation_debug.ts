// valuation_computation_debug.ts
import { valuateVehicle } from "./src/ain-backend/valuationEngine";
import { VehicleData } from "./src/types/ValuationTypes";

async function main() {
  const vin = process.argv[2] || "4T1K31AK5PU607399";
  const mileage = parseInt(process.argv[3] || "97104", 10);
  const zip = process.argv[4] || "95821";
  const condition = process.argv[5] || "Very Good";
  const titleStatus = process.argv[6] || "Clean";
  const color = process.argv[7] || "White";

  const vehicleData: VehicleData = {
    vin,
    year: 2023,
    make: "Toyota",
    model: "Camry",
    trim: "XSE",
    mileage,
    zip,
    condition,
    titleStatus,
    color,
  };

  console.log("🔍 Starting Valuation Computation Debug with input:");
  console.log(JSON.stringify(vehicleData, null, 2));

  try {
    const result = await valuateVehicle(vehicleData);

    if (!result) {
      console.error("❌ ERROR: valuation engine returned null/undefined.");
      process.exit(1);
    }

    console.log("📊 Full Valuation Breakdown:");
    console.log("  Base/Anchor Value:", result.baseValue || "N/A");
    console.log("  Adjustments:", JSON.stringify(result.adjustments, null, 2));
    console.log("  Market Factors:", JSON.stringify(result.marketFactors, null, 2));
    console.log("  Confidence:", result.confidence);
    console.log("  Final Estimated Value:", result.estimatedValue);

    if (
      result.estimatedValue === 0 ||
      result.estimatedValue === null ||
      result.estimatedValue === undefined
    ) {
      console.error("❌ FAIL: Engine produced a zero/invalid estimatedValue.");
      process.exit(2);
    }

    console.log("✅ PASS: Engine produced a valid non-zero valuation result.");
    console.log("🎯 Valuation Computation Debug completed successfully.");
  } catch (err: any) {
    console.error("❌ Computation debug failed:", err.message || err);
    process.exit(99);
  }
}

main();
