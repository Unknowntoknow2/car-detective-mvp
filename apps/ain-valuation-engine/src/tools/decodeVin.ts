import { decodeVin } from "../services/unifiedVinDecoder";

async function main() {
  const vinIdx = process.argv.indexOf("--vin");
  if (vinIdx < 0 || !process.argv[vinIdx+1]) {
    console.error("usage: ts-node src/tools/decodeVin.ts --vin <VIN>");
    process.exit(2);
  }
  const vin = process.argv[vinIdx+1];
  const res = await decodeVin(vin);
  console.log(JSON.stringify(res, null, 2));
}
main().catch(e => { console.error(e); process.exit(1); });
