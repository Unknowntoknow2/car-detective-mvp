
from datetime import datetime
import pandas as pd
from typing import Dict, Any
from .schema import VehicleDataForValuation, normalize_condition_to_score, normalize_title

def zip3(z: str) -> str:
    return z[:3]

def months_between(d1, d2):
    return (d2.year - d1.year)*12 + (d2.month - d1.month)

def build_inference_df(v: VehicleDataForValuation, vin_info: Dict) -> pd.DataFrame:
    """
    Construct a DataFrame for inference, auto-aligned to the training feature spec.
    Loads feature spec from artifacts/feature_spec.json and enforces order/types.
    """
    import os, json, logging
    year = int(vin_info.get("year")) if vin_info.get("year") else None
    make = vin_info.get("make")
    model = vin_info.get("model")
    trim = vin_info.get("trim")
    fuel_type = (v.fuel_type or vin_info.get("fuel_type") or "").lower() or None
    transmission = vin_info.get("transmission")
    drive_type = vin_info.get("drive_type")
    engine_cyl = vin_info.get("engine_cyl")
    cond_score = normalize_condition_to_score(v.condition)
    title_norm = normalize_title(v.title_status)
    now_year = datetime.utcnow().year
    age = (now_year - year) if year else None
    age = max(age, 0) if age is not None else None
    age_mileage_ratio = (v.mileage / max(age,1)) if age else None
    today = datetime.utcnow().date()
    basic_left = None
    ptrain_left = None
    if v.in_service_date:
        try:
            basic_left = v.warranty_basic_months - months_between(v.in_service_date, today)
            ptrain_left = v.warranty_powertrain_months - months_between(v.in_service_date, today)
        except Exception:
            pass
    basic_miles_left = None
    ptrain_miles_left = None
    if v.mileage is not None:
        basic_miles_left  = max(v.warranty_basic_miles  - v.mileage, 0) if v.warranty_basic_miles  else None
        ptrain_miles_left = max(v.warranty_powertrain_miles - v.mileage, 0) if v.warranty_powertrain_miles else None
    row = {
        "year": year,
        "make": make,
        "model": model,
        "trim": trim,
        "mileage": v.mileage,
        "zip": v.zip,
        "zip3": zip3(v.zip),
        "fuel_type": fuel_type,
        "transmission": transmission,
        "drive_type": drive_type,
        "engine_cyl": engine_cyl,
        "condition_score": cond_score,
        "title_status": title_norm,
        "accidents": v.accidents if v.accidents is not None else 0,
        "owners": v.owners if v.owners is not None else 0,
        "age": age,
        "age_mileage_ratio": age_mileage_ratio,
        "epa_mpg_combined": vin_info.get("epa_mpg_combined"),
        "epa_fuel_type": vin_info.get("epa_fuel_type"),
        "epa_body": vin_info.get("epa_body"),
        "fuel_cost_index": vin_info.get("fuel_cost_index"),
        "warranty_basic_months_left": basic_left,
        "warranty_powertrain_months_left": ptrain_left,
        "warranty_basic_miles_left": basic_miles_left,
        "warranty_powertrain_miles_left": ptrain_miles_left,
    }
    df = pd.DataFrame([row])
    # --- Auto-align to training feature spec ---
    # Try both the pipeline-specific and default feature_spec.json paths
    feature_spec_path = os.environ.get("AIN_FEATURE_SPEC_PATH")
    tried_paths = []
    if not feature_spec_path:
        # Try pipeline-specific
        pipeline_path = os.environ.get("AIN_PIPELINE_PATH", "artifacts/valuation_pipeline.joblib")
        feature_spec_path = pipeline_path.replace(".joblib", "_feature_spec.json")
        tried_paths.append(feature_spec_path)
        if not os.path.exists(feature_spec_path):
            # Try default
            feature_spec_path = os.path.join(os.path.dirname(pipeline_path), "feature_spec.json")
            tried_paths.append(feature_spec_path)
    try:
        with open(feature_spec_path) as f:
            spec = json.load(f)
    except FileNotFoundError:
        logging.error(f"[FeatureAlign] Could not find feature spec. Tried: {tried_paths}")
        raise
        expected_cols = spec["feature_names"]
        expected_types = spec["dtypes"]
        # Add missing columns as NaN, drop extras
        for col in expected_cols:
            if col not in df.columns:
                logging.warning(f"[FeatureAlign] Adding missing column: {col} (NaN)")
                df[col] = float('nan')
        for col in list(df.columns):
            if col not in expected_cols:
                logging.warning(f"[FeatureAlign] Dropping unexpected column: {col}")
                df = df.drop(columns=[col])
        # Reorder
        df = df[expected_cols]
        # Enforce dtypes
        for col, typ in expected_types.items():
            try:
                df[col] = df[col].astype(typ)
            except Exception as e:
                logging.warning(f"[FeatureAlign] Could not cast {col} to {typ}: {e}")
        # Final check
        if list(df.columns) != expected_cols:
            raise ValueError(f"[FeatureAlign] Feature order mismatch after alignment! {list(df.columns)} != {expected_cols}")
    except Exception as e:
        logging.error(f"[FeatureAlign] Could not align features: {e}")
        raise
    return df
