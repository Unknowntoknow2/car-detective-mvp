

import express from "express";
import cors from "cors";
import { normalizeVehicleData } from "../services/normalizeVehicleData.js";
import logger from "../utils/logger.js";
import { carApiService } from "../services/carApiService.js";
import { vinLookupService } from "../services/vinLookupService.js";
import axios from "axios";
import { residualValueService } from "../services/residualValueService.js";
import { carSpecsService } from "../services/carSpecsService.js";
import { decodeVinAndEstimate } from "../services/vinValuationService.js";


const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ status: "AIN Valuation API running" });
});

// MVP Used Car Valuation Endpoint
app.post("/api/valuation", async (req, res) => {
  try {
    const vin = req.body?.vin;
    if (!vin) return res.status(400).json({ error: 'Missing VIN' });
    const result = await decodeVinAndEstimate(vin);
    return res.json(result);
  } catch (e: any) {
    return res.status(500).json({ error: e.message || 'Decode failed' });
  }
});

// 🚨 Canonical Valuation Endpoint
app.post("/api/valuate", async (req, res) => {
  try {
    const { vin, year, make, model, mileage, zip, condition, titleStatus } = req.body;
    logger.info(`[AUDIT] Input received: ${JSON.stringify(req.body)}`);

    // Input validation
    if (!vin || typeof vin !== 'string' || vin.length < 8) {
      logger.warn(`[AUDIT] Validation FAIL: VIN missing or invalid`);
      return res.status(400).json({ error: 'Invalid VIN' });
    }
    logger.info(`[AUDIT] Validation OK`);

    // Normalize vehicle data for all services
    const vehicle = normalizeVehicleData({ vin, year, make, model, mileage, zip, condition, titleStatus });

    // Decode VINs (pass vehicle object)
    let decodeSource = 'NONE';
    let carSpecsData = null, carApiData = null, lookupData = null;
  carSpecsData = await carSpecsService(vehicle).catch(() => null);
  if (carSpecsData) decodeSource = 'Car Specs';
  carApiData = await carApiService(vehicle).catch(() => null);
  if (carApiData && !carSpecsData) decodeSource = 'Car API';
  lookupData = await vinLookupService(vehicle).catch(() => null);
  if (lookupData && !carSpecsData && !carApiData) decodeSource = 'VIN Lookup';
  logger.info(`[AUDIT] VIN decoded via ${decodeSource}`);


    // Valuation (Google-level, real ML/SHAP/LLM via Python API)
    let valuationResult = null;
    let valuationError = null;
    try {
      const pythonApiUrl = process.env.PYTHON_VALUATION_API_URL || "http://localhost:8000/valuate";
      const payload = {
        vin,
        year,
        make,
        model,
        mileage,
        zip,
        condition,
        titleStatus
      };
      const response = await axios.post(pythonApiUrl, payload, { timeout: 10000 });
      valuationResult = response.data;
      logger.info(`[AUDIT] Valuation complete: $${valuationResult.value} (conf: ${valuationResult.confidence})`);
    } catch (err) {
      valuationError = err;
      logger.error(`[AUDIT] Valuation FAIL: ${err?.message || err}`);
    }

    // Enrichment status (real only)
    const enrichmentStatus = {
      carSpecs: carSpecsData ? 200 : 404,
      carApi: carApiData ? 200 : 404,
      vinLookup: lookupData ? 200 : 404,
      valuationEngine: valuationResult ? 200 : 500
    };
    Object.entries(enrichmentStatus).forEach(([k, v]) => {
      logger.info(`[AUDIT] ${k} enrichment: ${v === 200 ? '✅' : `❌ (${v})`}`);
    });

    // Final response fields
    const fields = { year, make, model, mileage, zip, condition, titleStatus };
    Object.entries(fields).forEach(([f, v]) => {
      logger.info(`[AUDIT] Field ${f}: ${v !== undefined && v !== null && v !== 'N/A' && v !== 0 ? 'OK' : 'FAIL'} (${v})`);
    });

    // Response (Google-level, no mocks)
    if (valuationResult) {
      return res.json({
        coreResult: { vin, year, make, model, mileage, zip, condition, titleStatus },
        enrichment: { carSpecsData, carApiData, lookupData },
        decodeSource,
        enrichmentStatus,
        valuation: valuationResult,
      });
    } else {
      return res.status(500).json({ error: "Valuation failed", details: valuationError?.message || valuationError });
    }
  } catch (err: any) {
    logger.error(`[AUDIT] ERROR: ${err.message}`);
    return res.status(500).json({ error: "Valuation failed", details: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`🚀 AIN Valuation API running on http://localhost:${PORT}`);
});

// Optionally export app for testing
export default app;