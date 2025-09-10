import logger from "../utils/logger.js";
export async function vinLookupService(vehicle) {
    logger.info("Calling VIN Lookup Service", { vin: vehicle.vin });
    // Not implemented: return 404/empty
    return {
        source: "VinLookup",
        status: "not_implemented",
        data: {},
    };
}
