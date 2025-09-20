import { decodeVin } from "../services/unifiedVinDecoder";
async function main() {
    const vinIdx = process.argv.indexOf("--vin");
    if (vinIdx < 0 || !process.argv[vinIdx + 1]) {
        
        process.exit(2);
    }
    const vin = process.argv[vinIdx + 1];
    const res = await decodeVin(vin);
    );
}
main().catch(e => {  process.exit(1); });
