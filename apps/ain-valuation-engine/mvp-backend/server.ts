import express from "express";
import cors from "cors";
import { normalizeVehicleData } from "./normalizeVehicleData.js";
import logger from "./logger.js";
import { carApiService } from "./carApiService.js";
import { vinLookupService } from "./vinLookupService.js";
import { vehiclePricingService } from "./vehiclePricingService.js";
import { residualValueService } from "./residualValueService.js";
import { carSpecsService } from "./carSpecsService.js";
import { decodeVinAndEstimate } from "./vinValuationService.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "AIN Valuation API running" });
});

app.post("/api/valuation", async (req, res) => {
  try {
    const vin = req.body?.vin;
    if (!vin) return res.status(400).json({ error: 'Missing VIN' });
    const result = await decodeVinAndEstimate(vin);
    return res.json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Decode failed' });
  }
});

app.post("/api/valuate", async (req, res) => {
  try {
    const { vin, year, make, model, mileage, zip, condition, titleStatus } = req.body;
    logger.info(`[AUDIT] Input received: ${JSON.stringify(req.body)}`);
    if (!vin || typeof vin !== 'string' || vin.length < 8) {
      logger.warn(`[AUDIT] Validation FAIL: VIN missing or invalid`);
      return res.status(400).json({ error: 'Invalid VIN' });
    }
    logger.info(`[AUDIT] Validation OK`);
    const vehicle = normalizeVehicleData({ vin, year, make, model, mileage, zip, condition, titleStatus });
    let decodeSource = 'NONE';
    let carSpecsData = null, carApiData = null, lookupData = null;
    carSpecsData = await carSpecsService(vehicle).catch(() => null);
    if (carSpecsData) decodeSource = 'Car Specs';
    carApiData = await carApiService(vehicle).catch(() => null);
    if (carApiData && !carSpecsData) decodeSource = 'Car API';
    lookupData = await vinLookupService(vehicle).catch(() => null);
    if (lookupData && !carSpecsData && !carApiData) decodeSource = 'VIN Lookup';
    logger.info(`[AUDIT] VIN decoded via ${decodeSource}`);
    let enrichmentStatus = {};
    const pricing = await vehiclePricingService(vehicle).catch(() => null);
    const residual = await residualValueService(vehicle).catch(() => null);
    enrichmentStatus = {
      carSpecs: carSpecsData ? 200 : 404,
      carApi: carApiData ? 200 : 404,
      vinLookup: lookupData ? 200 : 404,
      vehiclePricing: pricing ? 200 : 404,
      residual: residual ? 200 : 404
    };
    Object.entries(enrichmentStatus).forEach(([k, v]) => {
      logger.info(`[AUDIT] ${k} enrichment: ${v === 200 ? '✅' : `❌ (${v})`}`);
    });
    let estimatedValue = null, confidence = null;
    if (pricing && pricing.estimatedValue) {
      estimatedValue = pricing.estimatedValue;
      confidence = pricing.confidence || 0.9;
      logger.info(`[AUDIT] Valuation complete: $${estimatedValue} (conf: ${confidence})`);
    } else {
      logger.warn(`[AUDIT] Valuation FAIL`);
    }
    const fields = { year, make, model, mileage, zip, condition, titleStatus };
    Object.entries(fields).forEach(([f, v]) => {
      logger.info(`[AUDIT] Field ${f}: ${v !== undefined && v !== null && v !== 'N/A' && v !== 0 ? 'OK' : 'FAIL'} (${v})`);
    });
    return res.json({
      coreResult: { vin, year, make, model, mileage, zip, condition, titleStatus },
      enrichment: { carSpecsData, carApiData, lookupData, pricing, residual },
      decodeSource,
      enrichmentStatus,
      valuation: { estimatedValue, confidence },
    });
  } catch (err) {
    logger.error(`[AUDIT] ERROR: ${err.message}`);
    return res.status(500).json({ error: "Valuation failed", details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`🚀 AIN Valuation API running on http://localhost:${PORT}`);
});

export default app;
