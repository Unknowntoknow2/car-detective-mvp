# Section 2 – Enrichment, Features, and Market Signals

This document outlines the additional data sources, tables, services, and edge functions
added in Phase 2. It includes:

- **IIHS ratings ingestion:** fetch crashworthiness, crash-prevention, and headlights data from IIHS.
- **OEM features:** extract trim-level options (audio, roof, towing, heated seats, etc.) from build sheets or brochures.
- **NHTSA complaints/investigations:** count reliability and defect reports to adjust valuation risk.
- **Market signals:** ingest sales volume, days on market, and search-trend indicators.

All functions use Supabase RPCs, cache responses with TTL + SWR, and enforce RLS.
