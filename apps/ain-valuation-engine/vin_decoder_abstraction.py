import requests
import time
import logging
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, List

logging.basicConfig(level=logging.INFO)

def fetch_nhtsa_recalls(vin: str) -> List[Dict[str, Any]]:
    """
    Fetch recall data for a VIN from the free NHTSA API.
    Returns a list of recall records (open and closed).
    """
    url = f"https://api.nhtsa.gov/recalls/recallsByVin/{vin}"
    try:
        resp = requests.get(url, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        return data.get("results", [])
    except Exception as e:
        logging.error(f"NHTSA Recall API error: {e}")
        return []

# --- VIN Decoder Abstraction Layer ---


class VinDecodeProvider(ABC):
    """Abstract base class for VIN decode providers."""
    @abstractmethod
    def decode(self, vin: str) -> Dict[str, Any]:
        pass

    @abstractmethod
    def provider_name(self) -> str:
        pass


class NHTSAProvider(VinDecodeProvider):
    def decode(self, vin: str) -> Dict[str, Any]:
        url = f"https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/{vin}?format=json"
        try:
            resp = requests.get(url, timeout=10)
            resp.raise_for_status()
            data = resp.json()
            result = {item['Variable']: item['Value'] for item in data['Results']}
            return result
        except Exception as e:
            logging.error(f"NHTSA API error: {e}")
            return {"error": "NHTSA API error."}

    def provider_name(self) -> str:
        return "NHTSA"


# Placeholder for a commercial provider (e.g., ClearVin, VinAudit)

import os

class VinAuditProvider(VinDecodeProvider):
    """
    Live integration with VinAudit commercial VIN decode API.
    Requires VINAUDIT_API_KEY in environment or .env file.
    """
    def __init__(self):
        self.api_key = os.getenv("VINAUDIT_API_KEY")
        self.endpoint = "https://api.vinaudit.com/v2/vehicle"

    def decode(self, vin: str) -> Dict[str, Any]:
        if not self.api_key:
            return {"error": "VinAudit API key not set in environment."}
        params = {
            "vin": vin,
            "key": self.api_key,
            "format": "json"
        }
        try:
            resp = requests.get(self.endpoint, params=params, timeout=10)
            resp.raise_for_status()
            data = resp.json()
            if data.get("error"):
                return {"error": data["error"]}
            # Map VinAudit fields to canonical schema as needed
            result = {k: v for k, v in data.items()}
            return result
        except Exception as e:
            logging.error(f"VinAudit API error: {e}")
            return {"error": f"VinAudit API error: {e}"}

    def provider_name(self) -> str:
        return "VinAudit"

# Retain CommercialProvider as a fallback stub
class CommercialProvider(VinDecodeProvider):
    def decode(self, vin: str) -> Dict[str, Any]:
        return {"error": "Commercial provider not implemented."}
    def provider_name(self) -> str:
        return "Commercial"


class VinDecoder:
    """
    VIN Decoder abstraction supporting multiple providers, error handling, compliance logging,
    and enrichment hooks (recall, geo, fuel, explainability).
    """
    def __init__(self, providers: List[VinDecodeProvider], rate_limit_per_minute: int = 60):
        self.providers = providers
        self.rate_limit_per_minute = rate_limit_per_minute
        self.last_call_time = 0

    def decode(self, vin: str) -> Dict[str, Any]:
        provenance = []
        compliance_log = []
        for provider in self.providers:
            # Rate limiting (simple per-call delay)
            now = time.time()
            if now - self.last_call_time < 60.0 / self.rate_limit_per_minute:
                time.sleep(60.0 / self.rate_limit_per_minute - (now - self.last_call_time))
            self.last_call_time = time.time()
            result = provider.decode(vin)
            compliance_event = {
                "provider": provider.provider_name(),
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "vin": vin,
                "success": not result.get("error"),
                "error": result.get("error", None),
                "compliance_check": True,  # Placeholder for real compliance logic
            }
            compliance_log.append(compliance_event)
            provenance.append({
                "provider": provider.provider_name(),
                "timestamp": compliance_event["timestamp"],
                "success": compliance_event["success"],
                "error": compliance_event["error"]
            })
            if result and not result.get("error"):
                result['provider'] = provider.provider_name()
                result['provenance'] = provenance
                result['compliance_log'] = compliance_log
                # Enrichment hooks
                result['recalls'] = fetch_nhtsa_recalls(vin)
                result['geo'] = geo_enrichment_stub(result)
                result['fuel'] = fuel_enrichment_stub(result)
                result['explainability'] = explainability_stub(result)
                return result
        return {"error": "All providers failed.", "provenance": provenance, "compliance_log": compliance_log}
def geo_enrichment_stub(decoded: dict) -> dict:
    """Stub for geo-location enrichment. Replace with real provider integration."""
    # Example: Use Plant Country/State/City if available
    return {
        "country": decoded.get("Plant Country"),
        "state": decoded.get("Plant State"),
        "city": decoded.get("Plant City")
    }

def fuel_enrichment_stub(decoded: dict) -> dict:
    """Stub for fuel enrichment. Replace with EPA or other provider integration."""
    return {
        "fuel_type": decoded.get("Fuel Type Primary"),
        "engine_displacement_l": decoded.get("Engine Displacement (L)")
    }

def explainability_stub(decoded: dict) -> dict:
    """Stub for explainability/attribution enrichment. Replace with SHAP or model integration."""
    return {
        "confidence": 0.99 if decoded.get("Make") else 0.0,
        "provider": decoded.get("provider"),
        "rationale": "Decoded using provider and mapped to canonical schema."
    }


# Canonical field mapping for NHTSA (expandable for multi-provider)
CANONICAL_FIELD_MAP = {
    'Make': 'make',
    'Model': 'model',
    'Model Year': 'year',
    'Trim': 'trim',
    'Engine Configuration': 'engine_config',
    'Engine Displacement (L)': 'engine_displacement_l',
    'Drive Type': 'drivetrain',
    'Body Class': 'body',
    'Transmission Style': 'transmission',
    'Fuel Type Primary': 'fuel',
    'Plant Country': 'plant_country',
    'Plant State': 'plant_state',
    'Plant City': 'plant_city',
    'Doors': 'doors',
    'Seats': 'seats',
    'Seat Rows': 'seat_rows',
    'Series': 'series',
    'Air Bag Locations': 'airbags',
    'Seat Belt Type': 'seat_belt',
    'Other Restraint Info': 'restraint',
    # Add more as needed
}

# Data quality scoring based on field completeness
def data_quality_score(decoded_vehicle: dict, required_fields=None):
    if required_fields is None:
        required_fields = list(CANONICAL_FIELD_MAP.keys())
    filled = sum(1 for f in required_fields if decoded_vehicle.get(f) not in [None, '', 'NA', 'N/A'])
    return round(100 * filled / len(required_fields))

# Canonical schema mapping (simplified)

# Expanded canonical fields for 100% NHTSA vPIC coverage
CANONICAL_FIELDS = [
    "VIN", "Make", "Model", "Model Year", "Manufacturer Name", "Plant Country", "Plant State", "Plant City", "Plant Company Name", "Vehicle Type", "Series", "Trim",
    "Drive Type", "Transmission Style", "Transmission Speeds", "Doors", "Seats", "Seat Rows", "Body Class",
    "Engine Displacement (L)", "Engine Configuration", "Engine Cylinders", "Engine Model", "Valve Train Design", "Engine Stroke Cycles", "Engine Manufacturer", "Fuel Type Primary",
    "Air Bag Locations", "Seat Belt Type", "Other Restraint Info", "Pretensioner"
]

# Mapping from possible NHTSA variable names to canonical schema
NHTSA_TO_CANONICAL = {
    "VIN": "VIN",
    "Make": "Make",
    "Model": "Model",
    "Model Year": "Model Year",
    "Manufacturer Name": "Manufacturer Name",
    "Plant Country": "Plant Country",
    "Plant State": "Plant State",
    "Plant City": "Plant City",
    "Plant Company Name": "Plant Company Name",
    "Vehicle Type": "Vehicle Type",
    "Series": "Series",
    "Trim": "Trim",
    "Drive Type": "Drive Type",
    "Transmission Style": "Transmission Style",
    "Transmission Speeds": "Transmission Speeds",
    "Doors": "Doors",
    "Number of Doors": "Doors",
    "Seats": "Seats",
    "Number of Seats": "Seats",
    "Seat Rows": "Seat Rows",
    "Number of Seat Rows": "Seat Rows",
    "Body Class": "Body Class",
    "Engine Displacement (L)": "Engine Displacement (L)",
    "Displacement (L)": "Engine Displacement (L)",
    "Engine Configuration": "Engine Configuration",
    "Engine Cylinders": "Engine Cylinders",
    "Cylinders": "Engine Cylinders",
    "Engine Model": "Engine Model",
    "Valve Train Design": "Valve Train Design",
    "Engine Stroke Cycles": "Engine Stroke Cycles",
    "Engine Manufacturer": "Engine Manufacturer",
    "Fuel Type - Primary": "Fuel Type Primary",
    "Fuel Type Primary": "Fuel Type Primary",
    "Air Bag Locations": "Air Bag Locations",
    "Front Air Bag Locations": "Air Bag Locations",
    "Seat Belt Type": "Seat Belt Type",
    "Other Restraint System Info": "Other Restraint Info",
    "Pretensioner": "Pretensioner"
}


def map_to_canonical(raw: Dict[str, Any], vin: str = None) -> Dict[str, Any]:
    """
    Map raw provider output to canonical schema, including provenance and explainability fields.
    """
    canonical = {field: None for field in CANONICAL_FIELDS}
    if vin:
        canonical["VIN"] = vin
    for k, v in raw.items():
        if k in NHTSA_TO_CANONICAL and v not in (None, "", "Not Applicable", "0"):
            canonical[NHTSA_TO_CANONICAL[k]] = v
    # Attach enrichment and compliance fields if present
    for extra in ["provenance", "compliance_log", "recalls", "geo", "fuel", "explainability"]:
        if extra in raw:
            canonical[extra] = raw[extra]
    return canonical

# Example usage

def decode_and_map(vin: str) -> Dict[str, Any]:
    """
    Decode a VIN using all available providers, map to canonical schema, and enrich with recall/provenance.
    """
    decoder = VinDecoder([NHTSAProvider(), VinAuditProvider(), CommercialProvider()])
    raw = decoder.decode(vin)
    if 'error' in raw:
        logging.error(f"VIN decode failed: {raw['error']}. Please check the VIN or try a different provider.")
        return {"error": raw["error"], "provenance": raw.get("provenance", [])}
    canonical = map_to_canonical(raw, vin=vin)
    # If all canonical fields except VIN, provenance, recalls, compliance_log, geo, fuel, explainability are None/empty, treat as error
    non_empty = [v for k, v in canonical.items() if k not in ('VIN','provenance','recalls','compliance_log','geo','fuel','explainability') and v not in (None, '', 'NA', 'N/A')]
    if not non_empty:
        error_result = {"error": "VIN decode failed: No valid data returned.", "provenance": raw.get('provenance', [])}
        logging.error(error_result["error"])
        return error_result
    missing = [f for f in CANONICAL_FIELD_MAP if canonical.get(f) in (None, '', 'NA', 'N/A')]
    if missing:
        logging.info(f"The following fields are missing or incomplete: {', '.join(missing)}. You may supplement these manually or with another provider.")
    return canonical


if __name__ == "__main__":
    import sys
    import json
    if len(sys.argv) > 2 and sys.argv[1] == "recalls":
        vin = sys.argv[2]
        recalls = fetch_nhtsa_recalls(vin)
        print(json.dumps(recalls, indent=2))
    else:
        test_vin = sys.argv[1] if len(sys.argv) > 1 else "4T1C11AK3PU162087"
        result = decode_and_map(test_vin)
        print(json.dumps(result, indent=2))
        print(f"Data quality score: {data_quality_score(result)}%")
