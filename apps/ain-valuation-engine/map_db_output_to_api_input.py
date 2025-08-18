import json
import requests

# Map db_output.json fields to VehicleFeatures API input
DB_OUTPUT_PATH = "db_output.json"
API_URL = "http://localhost:8000/predict"  # Adjust as needed

def map_db_output_to_api_input(db_output):
    # Compose engine displacement as string with 'L' if present
    displacement_val = db_output.get("Engine Displacement (L)")
    if displacement_val is not None and displacement_val != "":
        try:
            displacement_str = f"{float(displacement_val):.1f}L"
        except Exception:
            displacement_str = str(displacement_val)
    else:
        displacement_str = ""

    return {
        "vin": db_output.get("VIN", ""),
        "make": db_output.get("Make", "").title(),
        "model": db_output.get("Model", "").title(),
        "year": int(db_output.get("Model Year", 0)),
        "trim": db_output.get("Trim", "").upper(),
        "engine_displacement": displacement_str,
        "fuel_type": db_output.get("Fuel Type Primary", "").title(),
        "body_type": db_output.get("Body Class", "").title(),
        "schema_version": "v2"
    }

def main():
    with open(DB_OUTPUT_PATH, "r") as f:
        db_output = json.load(f)
    api_input = map_db_output_to_api_input(db_output)
    print("API input:", api_input)
    response = requests.post(API_URL, json=api_input)
    print("Predicted price:", response.json())

if __name__ == "__main__":
    main()
