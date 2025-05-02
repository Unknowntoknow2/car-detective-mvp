import requests
from supabase import create_client, Client
import time

# --- CONFIG --- 
SUPABASE_URL = "https://xltxqqzattxogxtqrggt.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsdHhxcXphdHR4b2d4dHFyZ2d0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTQ1NjEyNiwiZXhwIjoyMDYxMDMyMTI2fQ.JKcxm60rn5330YH4KZD9bSyWde7RUAncZWyt3YqNN_M"

# Connect to Supabase
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- Functions ---
def fetch_makes():
    url = "https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json"
    response = requests.get(url)
    return response.json()["Results"]

def fetch_models(make_name):
    url = f"https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/{make_name}?format=json"
    response = requests.get(url)
    return response.json()["Results"]

# --- Main Process ---
def main():
    makes = fetch_makes()

    # --- Only popular brands
    popular_makes = [
        "TOYOTA", "HONDA", "BMW", "TESLA", "FORD", "MERCEDES-BENZ",
        "CHEVROLET", "NISSAN", "AUDI", "JEEP", "HYUNDAI", "KIA",
        "VOLKSWAGEN", "SUBARU", "MAZDA", "LEXUS"
    ]

    for make in makes:
        make_name = make["Make_Name"]
        if make_name.upper() not in popular_makes:
            continue

        nice_name = make_name.lower().replace(' ', '-')

        # --- Check if make already exists ---
        existing_makes = supabase.table("makes").select("id").eq("make_name", make_name).execute()

        if existing_makes.data:
            make_id = existing_makes.data[0]["id"]
            print(f"Found existing make: {make_name}")
        else:
            make_insert = supabase.table("makes").insert({
                "make_name": make_name,
                "nice_name": nice_name
            }).execute()
            make_id = make_insert.data[0]["id"]
            print(f"Inserted make: {make_name}")

        # --- Now insert models ---
        models = fetch_models(make_name)
        for model in models:
            model_name = model["Model_Name"]
            model_nice_name = model_name.lower().replace(' ', '-')

            # --- Check if model already exists ---
            existing_models = supabase.table("models").select("id").eq("model_name", model_name).execute()

            if existing_models.data:
                print(f"   Found existing model: {model_name}")
            else:
                model_insert = supabase.table("models").insert({
                    "make_id": make_id,
                    "model_name": model_name,
                    "nice_name": model_nice_name
                }).execute()

                print(f"   Inserted model: {model_name}")

        time.sleep(0.5)  # Sleep 0.5 sec between makes to be safe

if __name__ == "__main__":
    main()
