import sys
import json
import requests
import time
import logging
from abc import ABC, abstractmethod
from typing import Dict, Any, List
import os

logging.basicConfig(level=logging.INFO)

# --- Recall Lookup ---

def fetch_nhtsa_recalls(vin: str) -> list:
    url = f"https://api.nhtsa.gov/recalls/recallsByVin?vin={vin}"
    try:
        resp = requests.get(url, timeout=10)
        if resp.status_code == 403:
            logging.warning("NHTSA Recall API requires authentication or is unavailable (HTTP 403). Skipping recalls data.")
            return []
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
            result = {item["Variable"]: item["Value"] for item in data["Results"]}
            # Require Make, Model, and Model Year for a successful decode
            if not (result.get("Make") and result.get("Model") and result.get("Model Year")):
                result["error"] = "Incomplete decode: missing Make/Model/Year"
            return result
        except Exception as e:
            logging.error(f"NHTSA API error: {e}")
            return {"error": "NHTSA API error."}

    def provider_name(self) -> str:
        return "NHTSA"

# You can add more providers here using the same interface.

class VinDecoder:
    """
    VIN Decoder abstraction supporting multiple providers.
    """

    def __init__(self, providers: List[VinDecodeProvider]):
        self.providers = providers

    def decode(self, vin: str) -> Dict[str, Any]:
        provenance = []
        for provider in self.providers:
            result = provider.decode(vin)
            provenance.append({
                "provider": provider.provider_name(),
                "success": not result.get("error"),
                "error": result.get("error", None),
            })
            if result and not result.get("error"):
                # Attach provenance and recalls
                result["provider"] = provider.provider_name()
                result["provenance"] = provenance
                result["recalls"] = fetch_nhtsa_recalls(vin)
                result["explainability"] = explainability_stub(result)
                return result
        return {
            "error": "All providers failed.",
            "provenance": provenance,
        }

def explainability_stub(decoded: dict) -> dict:
    return {
        "confidence": 0.99 if decoded.get("Make") else 0.0,
        "provider": decoded.get("provider"),
        "rationale": "Decoded using provider and mapped to canonical schema.",
    }

CANONICAL_FIELDS = [
    "VIN", "Make", "Model", "Model Year", "Manufacturer Name", "Plant Country", "Plant State",
    "Plant City", "Plant Company Name", "Vehicle Type", "Series", "Trim", "Drive Type", "Transmission Style",
    "Transmission Speeds", "Doors", "Seats", "Seat Rows", "Body Class", "Engine Displacement (L)",
    "Engine Configuration", "Engine Cylinders", "Engine Model", "Valve Train Design", "Engine Stroke Cycles",
    "Engine Manufacturer", "Fuel Type Primary", "Air Bag Locations", "Seat Belt Type", "Other Restraint Info",
    "Pretensioner"
]

NHTSA_TO_CANONICAL = {field: field for field in CANONICAL_FIELDS}

def decode_and_map(vin):
    decoder = VinDecoder([NHTSAProvider()])
    result = decoder.decode(vin)
    # Map to canonical schema (filter only canonical fields)
    mapped = {k: v for k, v in result.items() if k in CANONICAL_FIELDS}
    mapped["VIN"] = vin
    # Attach provenance, recalls, etc. if present
    for key in ("provider", "provenance", "recalls", "explainability"):
        if key in result:
            mapped[key] = result[key]
    if "error" in result:
        mapped["error"] = result["error"]
    return mapped

def data_quality_score(decoded_vehicle: dict, required_fields=None):
    if required_fields is None:
        required_fields = CANONICAL_FIELDS
    filled = sum(
        1 for f in required_fields if decoded_vehicle.get(f) not in [None, "", "NA", "N/A"]
    )
    return round(100 * filled / len(required_fields))

if __name__ == "__main__":
    print("[STEP 1] Script started.")
    if len(sys.argv) > 2 and sys.argv[1] == "recalls":
        vin = sys.argv[2]
        print(f"[STEP 1] VIN received: {vin}")
        recalls = fetch_nhtsa_recalls(vin)
        print(json.dumps(recalls, indent=2))
    else:
        test_vin = sys.argv[1] if len(sys.argv) > 1 else "4T1C11AK3PU162087"
        print(f"[STEP 1] VIN received: {test_vin}")
        result = decode_and_map(test_vin)
        print(json.dumps(result, indent=2))
        print(f"Data quality score: {data_quality_score(result)}%")
