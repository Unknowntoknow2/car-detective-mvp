from vin_decoder_abstraction import VinDecoder, NHTSAProvider
from vehicle_data_enrichment import enrich_with_geocoding, enrich_with_epa_nhtsa, enrich_with_market_signals
import json

vin = "4T1G11AK4NU714632"
providers = [NHTSAProvider()]
decoder = VinDecoder(providers)

# Step 1: Decode VIN
result = decoder.decode(vin)

# Step 2: Enrich with geo (no address, so this will be skipped or return missing)
result = enrich_with_geocoding(result)

# Step 3: Enrich with EPA/NHTSA
result = enrich_with_epa_nhtsa(result)

# Step 4: Enrich with market signals (will require API key, may be skipped)
result = enrich_with_market_signals(result)

# Step 5: Print the full, real, enriched result
print(json.dumps(result, indent=2, default=str))
