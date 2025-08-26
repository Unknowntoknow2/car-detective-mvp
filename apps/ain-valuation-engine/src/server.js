import express from "express";
import { normalizeVehicleData } from "./utils/normalizeVehicleData";
import { carSpecsService } from "./services/carSpecsService";
import { carApiService } from "./services/carApiService";
import { vinLookupService } from "./services/vinLookupService";
import { vehiclePricingService } from "./services/vehiclePricingService";
import { residualValueService } from "./services/residualValueService";
import { logger } from "./logger";
const app = express();
app.use(express.json());
app.post("/api/valuate", async (req, res) => {
    try {
        // 1. Strict normalization
        const normalizedVehicle = normalizeVehicleData(req.body);
        // 2. Enrichment (multi-source)
        const enrichment = {};
        const audit = [];
        const enrichmentCalls = [
            { name: "carSpecs", fn: carSpecsService },
            { name: "carApi", fn: carApiService },
            { name: "vinLookup", fn: vinLookupService },
            { name: "vehiclePricing", fn: vehiclePricingService },
            { name: "residualValue", fn: residualValueService },
        ];
        for (const { name, fn } of enrichmentCalls) {
            try {
                const result = await fn(normalizedVehicle);
                enrichment[name] = result;
                audit.push({ name, status: "success" });
                logger.info(`Enrichment ${name} success`, { vin: normalizedVehicle.vin });
            }
            catch (err) {
                enrichment[name] = { error: err.message || "Unknown error" };
                audit.push({ name, status: "error", error: err.message });
                logger.error(`Enrichment ${name} failed`, { vin: normalizedVehicle.vin, error: err.message });
            }
        }
        // 3. Valuation Engine (mocked)
        const valuation = {
            value: enrichment.vehiclePricing?.data?.retail ?? null,
            confidence: 0.9,
            currency: "USD",
        };
        res.json({
            normalizedVehicle,
            valuation,
            enrichment,
            audit,
        });
    }
    catch (err) {
        logger.error("Valuation pipeline error", { error: err.message });
        res.status(400).json({
            error: {
                message: err.message,
                code: "VALIDATION_ERROR",
            },
        });
    }
});
app.listen(3000, () => {
    logger.info("AIN Valuation Engine listening on port 3000");
});
