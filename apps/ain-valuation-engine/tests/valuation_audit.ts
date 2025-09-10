// Automated audit test for /api/valuate end-to-end flow
// Sends real VINs, logs each stage, and writes audit log file

import fs from 'fs';
import path from 'path';
import axios from 'axios';

const VINs = [
  { vin: '4T1B31HK0KU509959', label: '2019 Toyota Camry' },
  { vin: '1FTEW1CG6HKD46234', label: '2017 Ford F-150' },
];

const API_URL = process.env.VALUATION_API_URL || 'http://localhost:3000/api/valuate';

// ESM-compatible __dirname
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const LOG_DIR = path.join(__dirname, '../logs');
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-');
const LOG_FILE = path.join(LOG_DIR, `valuation_audit_${TIMESTAMP}.log`);

function log(msg: string) {
  fs.appendFileSync(LOG_FILE, msg + '\n');
  console.log(msg);
}

async function runAudit() {
  if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR);
  log(`# VIN→Valuation Audit Run: ${TIMESTAMP}`);
  for (const { vin, label } of VINs) {
    log(`\n---\nVIN: ${vin} (${label})`);
    try {
      log('[AUDIT] Sending request...');
      const res = await axios.post(API_URL, { vin });
      const data = res.data;
      // Validation
      if (data.inputValidation?.pass) {
        log('[AUDIT] Validation OK');
      } else {
        log('[AUDIT] Validation FAIL');
      }
      // VIN decode
      log(`[AUDIT] VIN decoded via: ${data.decodeSource || 'UNKNOWN'}`);
      // Enrichment
      ['carSpecs', 'carApi', 'vinLookup', 'vehiclePricing', 'residual'].forEach((k) => {
        const status = data.enrichment?.[k]?.status;
        log(`[AUDIT] ${k} enrichment: ${status === 200 ? '✅' : `❌ (${status})`}`);
      });
      // Valuation
      if (data.valuation) {
        log(`[AUDIT] Valuation complete: $${data.valuation.estimatedValue} (conf: ${data.valuation.confidence})`);
      } else {
        log('[AUDIT] Valuation FAIL');
      }
      // Final response
      const fields = ['year', 'make', 'model', 'mileage', 'zip', 'condition', 'titleStatus'];
      fields.forEach(f => {
        const v = data[f];
        log(`[AUDIT] Field ${f}: ${v !== undefined && v !== null && v !== 'N/A' && v !== 0 ? 'OK' : 'FAIL'} (${v})`);
      });
    } catch (err: any) {
      log(`[AUDIT] ERROR: ${err.message}`);
    }
  }
  log('\n# Audit complete.');
}

runAudit();
