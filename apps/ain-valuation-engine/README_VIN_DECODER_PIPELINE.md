# VIN Decoder Pipeline Integration (FAANG-Level)

## Overview
This script (`vin_decoder_pipeline_integration.py`) runs the production-grade Python VIN decoder abstraction, persists the output to `db_output.json`, and is ready for downstream enrichment and valuation pipelines.

---

## Usage
```bash
python vin_decoder_pipeline_integration.py <VIN>
```
- Decoded, enriched, and compliance-logged output is saved to `db_output.json`.
- Output is ready for ingestion by JS/TS enrichment/valuation modules or any downstream system.

---

## Integration
- Schedule this script in Airflow/Temporal or CI/CD for continuous ingestion.
- `db_output.json` can be read by Node.js, TypeScript, or Python enrichment/valuation engines.
- All provenance, enrichment, and compliance fields are included for full auditability.

---


## Commercial Provider Integration

### Setup
- Obtain a commercial VIN decode API key (e.g., from VinAudit).
- Set the following environment variables in your `.env` or shell:
  - `VINAUDIT_API_KEY=your_vinaudit_key`
  - `VINAUDIT_API_ENDPOINT=https://api.vinaudit.com/v2/vehicle` (optional, defaults to VinAudit)
  - `VINAUDIT_API_TIMEOUT=10` (optional, request timeout in seconds)
  - `VINAUDIT_API_MAX_RETRIES=2` (optional, retry attempts on timeout)

### Usage
- The pipeline will automatically try NHTSA first, then fall back to the commercial provider if NHTSA fails or is incomplete.
- All provenance, compliance, and error details are included in the output.

### Example
```bash
export VINAUDIT_API_KEY=your_vinaudit_key
python vin_decoder_pipeline_integration.py <VIN>
```

### Error Handling
- If the commercial provider fails (timeout, rate limit, bad VIN), errors are logged and included in the output.
- See the `provenance` and `compliance_log` fields in `db_output.json` for details.

### Extending
- To add new enrichment or output fields, update `vin_decoder_abstraction.py`.
- For new output targets (DB, queue, API), extend `persist_to_db_output()`.

---

## Example Output
```json
{
  "VIN": "4T1C11AK3PU162087",
  "Make": "TOYOTA",
  ...,
  "provenance": [...],
  "compliance_log": [...],
  "recalls": [...],
  "geo": {...},
  "fuel": {...},
  "explainability": {...}
}
```

---

## FAANG-Level Best Practices
- Modular, testable, and ready for continuous deployment
- All compliance, provenance, and enrichment fields included
- Fully auditable and extensible for future requirements
