# vin_decoder_docs.md

# VIN Decoder Internal Documentation

## Canonical Schema
See `canonical_vehicle_schema.py` for the full list of fields and types.

## Provider Abstraction
- All VIN decode providers must implement the `VinDecodeProvider` interface (see `vin_decoder_abstraction.py`).
- Add new providers by subclassing and registering in the `VinDecoder`.

## Coverage Matrix
- See `vin_decoder_coverage_matrix.py` for which fields are available from each provider.

## Golden VIN Test Suite
- Run `vin_golden_test_suite.py` to validate decoder coverage and normalization.
- Add new edge-case VINs to the test suite as needed.

## Error Handling
- All decode attempts and failures should be logged for monitoring.
- If all providers fail, return a clear error message and prompt for user correction.

## Extending the Decoder
- To add a new provider, create a new class implementing `VinDecodeProvider` and add to the provider list.
- To add new fields, update the canonical schema and mapping logic.

## Data Quality Scoring
- (Planned) Assign a confidence score to each decode based on field completeness and provider reliability.

## User-Editable Fields
- (Planned) Allow users to correct or supplement decoded data, with audit trail.

---

This documentation should be updated as new providers, fields, or features are added.
