import logger from "../utils/logger.js";
export async function residualValueService(vehicle) {
    logger.info("Calling Residual Value Service", { vin: vehicle.vin });
    // Mocked response for demonstration
    return {
        source: "ResidualValue",
        status: "success",
        data: {
            residualPercent: 48,
            months: 36,
        },
    };
}
