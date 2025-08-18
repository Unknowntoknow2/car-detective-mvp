from vin_decoder_abstraction import VinDecoder, NHTSAProvider
from vehicle_data_enrichment import enrich_with_geocoding, enrich_with_epa_nhtsa, enrich_with_market_signals
import json

vin = "4T1G11AK4NU714632"
mileage = 69484
zip_code = "95821"

providers = [NHTSAProvider()]
decoder = VinDecoder(providers)

# Step 1: Decode VIN
result = decoder.decode(vin)

# Step 2: Add user-supplied features
result["mileage"] = mileage
result["zip_code"] = zip_code

# Step 3: Enrich with geo (using ZIP as location)
result["location"] = zip_code
result = enrich_with_geocoding(result)

# Step 4: Enrich with EPA/NHTSA
result = enrich_with_epa_nhtsa(result)

# Step 5: Enrich with market signals (will require API key, may be skipped)
result = enrich_with_market_signals(result)

# Step 6: Print the full, real, enriched result
print(json.dumps(result, indent=2, default=str))
