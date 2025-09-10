// vin_decode_debug.ts
import { decodeVin } from "./src/services/unifiedVinDecoder";

async function main() {
  const vin = process.argv[2];
  if (!vin) {
    console.error("❌ Please provide a VIN as an argument");
    console.error("   Example: npx tsx vin_decode_debug.ts 4T1K31AK5PU607399");
    process.exit(1);
  }

  console.log(`🔍 Starting VIN decode debug for: ${vin}`);

  try {
    const decoded = await decodeVin(vin);

    if (!decoded) {
      console.warn("⚠️ VIN decode returned null/empty result.");
      process.exit(2);
    }

    // Source logging
    const source = (decoded as any)?.metadata?.source || "unknown";
    console.log(`📡 Source used: ${source}`);

    // Canonical decoded output
    console.log("✅ Decoded VIN result:");
    console.log(JSON.stringify(decoded, null, 2));

    // Minimal sanity checks
    const year = (decoded as any)?.categories?.identity?.modelYear;
    const make = (decoded as any)?.categories?.identity?.make;
    const model = (decoded as any)?.categories?.identity?.model;
    if (!year || !make || !model) {
      console.warn("⚠️ Decoded result is missing critical fields (year/make/model).");
      process.exit(3);
    }

    console.log("🎯 VIN decode debug completed successfully.");
  } catch (err: any) {
    console.error("❌ VIN decode failed:", err.message || err);
    process.exit(99);
  }
}

main();
