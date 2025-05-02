import requests
from supabase import create_client, Client
import time

# Configuration
SUPABASE_URL = "https://xltxqqzattxogxtqrggt.supabase.co"
SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsdHhxcXphdHR4b2d4dHFyZ2d0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTQ1NjEyNiwiZXhwIjoyMDYxMDMyMTI2fQ.JKcxm60rn5330YH4KZD9bSyWde7RUAncZWyt3YqNN_M"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

def fetch_nhtsa_makes_models():
    print("🔄 Fetching makes and models from NHTSA...")
    makes_url = "https://vpic.nhtsa.dot.gov/api/vehicles/GetAllMakes?format=json"
    makes_response = requests.get(makes_url)
    makes_data = makes_response.json()

    makes = makes_data.get("Results", [])
    
    # Clean list of important professional makes
    allowed_makes = [
        "Toyota", "Honda", "Ford", "Chevrolet", "BMW", "Audi", "Mercedes-Benz", "Lexus", "Nissan", "Hyundai", "Kia",
        "Jeep", "Subaru", "Volkswagen", "Dodge", "Ram", "Mazda", "Volvo", "Porsche", "Jaguar", "Land Rover"
    ]

    inserted_makes = []
    for make in makes:
        make_name = make.get("Make_Name")
        make_id = make.get("Make_ID")

        if make_name and make_name in allowed_makes:
            try:
                supabase.table("makes").insert({
                    "make_id": make_id,
                    "make_name": make_name
                }).execute()
                inserted_makes.append((make_id, make_name))
            except Exception as e:
                print(f"❌ Skipped make {make_name}: {e}")

    print(f"✅ Inserted {len(inserted_makes)} professional makes.")

    print("🔄 Fetching models for each make...")
    time.sleep(2)

    for idx, (make_id, make_name) in enumerate(inserted_makes):
        print(f"Fetching models for {make_name} ({idx + 1}/{len(inserted_makes)})...")
        models_url = f"https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeId/{make_id}?format=json"
        models_response = requests.get(models_url)
        models_data = models_response.json()
        models = models_data.get("Results", [])

        for model in models:
            model_name = model.get("Model_Name")
            if model_name:
                try:
                    supabase.table("models").insert({
                        "make_id": make_id,
                        "model_name": model_name
                    }).execute()
                except Exception as e:
                    print(f"⚠️ Skipped model {model_name}: {e}")

    print("🎉 Finished syncing all makes and models!")

if __name__ == "__main__":
    print("🚀 Starting NHTSA ➔ Supabase Sync...")
    fetch_nhtsa_makes_models()
