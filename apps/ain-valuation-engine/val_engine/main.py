#!/usr/bin/env python3
from __future__ import annotations
import os
import sys
import json
import argparse
import traceback
from pathlib import Path

# Optional .env support — will NOT block execution if missing
try:
    from dotenv import load_dotenv  # type: ignore
    load_dotenv()
except Exception:
    # Safe to ignore; environment variables remain as-is
    pass

import pandas as pd

# Centralized loader (deterministic)
from val_engine.pipeline_loader import load_pipeline, PipelineLoadError

def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="AIN Valuation Engine — deterministic inference using bundle['pipe']"
    )
    p.add_argument(
        "--bundle",
        default=os.environ.get("AIN_MODEL_BUNDLE", "artifacts/model_bundle.joblib"),
        help="Path to model bundle (joblib) containing 'pipe'. Default: artifacts/model_bundle.joblib",
    )
    p.add_argument(
        "--input",
        help="Path to JSON/CSV with inference rows; if omitted, runs a 1-row demo.",
    )
    p.add_argument(
        "--output",
        help="Path to write predictions JSON (list of floats). If omitted, prints to stdout.",
    )
    return p.parse_args()

def read_input_frame(path: str | None) -> pd.DataFrame:
    if not path:
        # Minimal 1-row demo aligned to your train_tabular.py feature set (adjust as needed)
        demo = {
            "mileage": 62000,
            "year": 2018,
            "owner_count": 2,
            "engine_hp": 285,
            "mpg_city": 18,
            "mpg_highway": 24,
            "make": "Ford",
            "model": "F-150",
            "trim": "XLT",
            "drivetrain": "4WD",
            "fuel_type": "Gasoline",
            "transmission": "Automatic",
            "exterior_color": "Blue",
            "interior_color": "Gray",
            "state": "CA",
            "zip_region": "900xx",
        }
        return pd.DataFrame([demo])

    p = Path(path)
    if not p.exists():
        raise FileNotFoundError(f"Input file not found: {p.resolve()}")
    if p.suffix.lower() == ".csv":
        return pd.read_csv(p)
    # default try json (list[dict] or dict -> single row)
    with open(p, "r") as f:
        obj = json.load(f)
    if isinstance(obj, dict):
        return pd.DataFrame([obj])
    if isinstance(obj, list):
        return pd.DataFrame(obj)
    raise ValueError("Unsupported JSON structure; expected dict or list of dicts.")

def main() -> int:
    args = parse_args()
    try:
        pipe, meta = load_pipeline(args.bundle)
    except PipelineLoadError as e:
        print(f"[FATAL] {e}", file=sys.stderr)
        return 2
    except Exception as e:
        print("[FATAL] Unexpected error while loading bundle:", file=sys.stderr)
        traceback.print_exc()
        return 2

    try:
        df = read_input_frame(args.input)
        preds = pipe.predict(df)
        out = [float(x) for x in preds]
    except Exception:
        print("[FATAL] Inference failed:", file=sys.stderr)
        traceback.print_exc()
        return 3

    if args.output:
        Path(args.output).parent.mkdir(parents=True, exist_ok=True)
        with open(args.output, "w") as f:
            json.dump(out, f, indent=2)
        print(json.dumps({
            "status": "ok",
            "bundle": meta,
            "output_path": args.output,
            "n_predictions": len(out),
        }, indent=2))
    else:
        print(json.dumps({
            "status": "ok",
            "bundle": meta,
            "predictions": out,
        }, indent=2))
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
# --- Unpickle compatibility shim (for older artifacts that used FrequencyEncoder)
try:
    from sklearn.base import BaseEstimator, TransformerMixin
    class FrequencyEncoder(BaseEstimator, TransformerMixin):  # matches pickled symbol
        def __init__(self, cols=None, min_freq=1): self.cols=cols; self.min_freq=min_freq
        def fit(self, X, y=None): return self
        def transform(self, X):
            import pandas as pd
            df = pd.DataFrame(X).copy()
            maps = getattr(self, "mapping_", None) or getattr(self, "freq_maps_", None)
            if isinstance(maps, dict):
                for col, mp in maps.items():
                    if col in df.columns:
                        df[col] = df[col].map(mp).fillna(0.0)
            return df
except Exception:
    pass
"""
Main valuation engine entry point for vehicle price estimation and analysis.

This module provides the primary interface for running complete vehicle valuations,
combining machine learning predictions with explainable AI insights and natural
language summaries. It orchestrates the entire valuation workflow from data loading
through final report generation.

The valuation process now includes:
1. One-time model loading/training at application startup for efficient inference.
2. Input preprocessing and validation.
3. Price prediction using the loaded machine learning model.
4. Feature importance analysis with SHAP.
5. Natural language summary generation, considering buyer/seller mode.
6. Price adjustment based on buyer/seller mode.
7. **Persistent audit logging of each valuation to Supabase.**

Dependencies:
    - model: Core ML prediction functionality, now including persistence.
    - shap_explainer: Model interpretability.
    - llm_summary: Natural language generation.
    - utils.data_loader: Data management utilities.
    - pandas: Data manipulation and analysis.
    - joblib: For efficient model persistence (saving/loading).
    - supabase: For database interaction and audit logging.
    - dotenv: For loading environment variables (Supabase credentials).

Example:
    >>> from val_engine.main import run_valuation, initialize_valuation_engine
    >>> 
    >>> # Initialize the engine once at application start
    >>> initialize_valuation_engine()
    >>> 
    >>> vehicle_data = {
    ...     'vin': {'value': '1HGCM82633A004352', 'verified': True, 'source_origin': 'NHTSA'},
    ...     'year': {'value': 2020, 'verified': True, 'source_origin': 'OEM'},
    ...     'mileage': {'value': 25000, 'verified': True, 'source_origin': 'Odometer'},
    ...     'make': {'value': 'Toyota', 'verified': True, 'source_origin': 'OEM'},
    ...     'model': {'value': 'Camry', 'verified': True, 'source_origin': 'OEM'},
    ...     'overall_condition_rating': {'value': 'Excellent', 'verified': True, 'source_origin': 'User'},
    ...     'zipcode': {'value': 90210, 'verified': True, 'source_origin': 'User'},
    ...     'ai_video_condition_score': {'value': 92, 'verified': True, 'source_origin': 'AI_Video'},
    ...     'photo_ai_score': {'value': 95, 'verified': True, 'source_origin': 'AI_Photo'},
    ...     'accident_history': {'value': [], 'verified': True, 'source_origin': 'Carfax'},
    ...     'title_type': {'value': 'Clean', 'verified': True, 'source_origin': 'Carfax'},
    ...     'factory_warranty_remaining_months': {'value': 12, 'verified': True, 'source_origin': 'OEM'},
    ...     'features_options': {
    ...         'value': {'sunroof_moonroof': True, 'advanced_safety_systems': True},
    ...         'verified': True, 'source_origin': 'OEM'
    ...     },
    ...     'installed_modifications': {'value': ['custom exhaust'], 'verified': False, 'source_origin': 'User'},
    ...     'exterior_color': {'value': 'Red', 'verified': True, 'source_origin': 'OEM'},
    ...     'market_confidence_score': {'value': 90, 'verified': True, 'source_origin': 'AIN_Engine'}
    ... }
    >>> 
    >>> # Run valuation in 'sell' mode
    >>> result_sell = run_valuation(vehicle_data, mode='sell')
    >>> print(f"Estimated Seller value: ${result_sell['estimated_value']:,.2f}")
    >>> print(f"Summary: {result_sell['summary']}")
    >>> 
    >>> # Run valuation in 'buy' mode
    >>> result_buy = run_valuation(vehicle_data, mode='buy')
    >>> print(f"Estimated Buyer value: ${result_buy['estimated_value']:,.2f}")
    >>> print(f"Summary: {result_buy['summary']}")
"""

import warnings
warnings.simplefilter(action='ignore', category=FutureWarning)

import pandas as pd
import json
import os
import uuid
import logging
from datetime import datetime
from typing import Dict, Any, Union, Tuple, List, Optional
from pathlib import Path
import joblib

DEFAULT_BUNDLE = Path("artifacts/model_bundle.joblib")
import joblib

# Supabase imports (optional)
try:
    from supabase import create_client, Client
    SUPABASE_AVAILABLE = True
except ImportError:
    print("Warning: Supabase package not installed. Audit logging will be disabled.")
    SUPABASE_AVAILABLE = False
    # Create mock types for type hints
    class Client:
        pass

# Import model persistence functions
from val_engine.model import train_model, predict_price, load_model_artifacts, save_model_artifacts
from sklearn.ensemble import GradientBoostingRegressor # For type hinting loaded model
from sklearn.preprocessing import LabelEncoder # For type hinting loaded encoders

# Import SHAP explainer functions
from val_engine.shap_explainer import set_explainer, explain_prediction as get_shap_explanation

# Import LLM summary function
from val_engine.llm_summary import generate_valuation_summary

# Load environment variables (optional)
try:
    try:
        from dotenv import load_dotenv
        load_dotenv()
    except ImportError:
        pass  # dotenv not available, that's fine
except ImportError:
    # dotenv not available, that's fine
    pass

# Import data loader/preprocessor
from val_engine.utils.data_loader import load_training_data, preprocess_input

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global variables to store the loaded model, encoders, SHAP explainer, and Supabase client
_loaded_model: Union[GradientBoostingRegressor, None] = None
_loaded_encoders: Dict[str, LabelEncoder] = {}
_shap_explainer_instance: Optional[Any] = None # Use Any for shap.TreeExplainer to avoid circular import if needed
_supabase_client: Optional[Client] = None

# --- Supabase Configuration ---
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
AUDIT_TABLE_NAME = "valuation_audits" # Name of your Supabase table for audit logs

def initialize_supabase_client() -> None:
    """
    Initializes the Supabase client using environment variables.
    """
    global _supabase_client
    
    if not SUPABASE_AVAILABLE:
        logger.warning("Supabase package not available. Audit logging will be disabled.")
        _supabase_client = None
        return
        
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_KEY")

    if not supabase_url or not supabase_key:
        logger.warning("SUPABASE_URL or SUPABASE_KEY environment variables not set. Supabase logging will be disabled.")
        _supabase_client = None
    else:
        try:
            _supabase_client = create_client(supabase_url, supabase_key)
            logger.info("Supabase client initialized successfully.")
        except Exception as e:
            logger.error(f"Failed to initialize Supabase client: {e}", exc_info=True)
            _supabase_client = None # Ensure client is None if initialization fails

def initialize_valuation_engine() -> None:
    """
    Initializes the valuation engine by loading a pre-trained model and encoders.
    If no pre-trained model is found, it trains a new one and saves it.
    This function should be called once when the application starts.
    It also initializes the SHAP explainer and Supabase client (if available).
    """
    global _loaded_model, _loaded_encoders, _shap_explainer_instance

    logger.info("Initializing valuation engine...")
    
    # Initialize Supabase client (optional)
    initialize_supabase_client()

    # Load or Train ML Model
    try:
        _loaded_model, _loaded_encoders = load_model_artifacts()
        logger.info("Valuation engine initialized with loaded model.")
    except FileNotFoundError:
        logger.info("Pre-trained model not found. Training new model and saving artifacts...")
        training_df = load_training_data()
        train_model(training_df)
        save_model_artifacts()
        _loaded_model, _loaded_encoders = load_model_artifacts()
        logger.info("New model trained, saved, and loaded for inference.")
    except RuntimeError as e:
        logger.error(f"Error initializing valuation engine model: {e}", exc_info=True)
        raise # Re-raise to indicate a critical startup failure for the model

    # 3. Initialize SHAP Explainer
    if _loaded_model:
        set_explainer(_loaded_model)
        _shap_explainer_instance = True  # Mark as initialized
        logger.info("SHAP explainer initialized.")
    else:
        logger.error("Model not loaded, cannot initialize SHAP explainer.")
        raise RuntimeError("Model not loaded, cannot initialize SHAP explainer.")

def _log_valuation_to_supabase(valuation_record: Dict[str, Any]) -> None:
    """
    Logs a valuation record to the Supabase audit table.
    This function is non-blocking and handles its own errors.
    """
    if _supabase_client is None:
        logger.warning("Supabase client not initialized. Cannot log valuation audit.")
        return

    try:
        # Prepare data for Supabase insertion
        log_data = {
            "valuation_id": valuation_record.get("valuation_id"),
            "timestamp": valuation_record.get("timestamp"),
            "estimated_value": valuation_record.get("estimated_value"),
            "original_predicted_value": valuation_record.get("original_predicted_value"),
            "mode": valuation_record.get("mode"),
            "mode_adjustment_amount": valuation_record.get("mode_adjustment_amount"),
            "confidence_score": valuation_record.get("confidence_score"),
            "summary": valuation_record.get("summary"),
            "input_vin": valuation_record.get("input_data", {}).get("vin", {}).get("value"),
            "input_year": valuation_record.get("input_data", {}).get("year", {}).get("value"),
            "input_make": valuation_record.get("input_data", {}).get("make", {}).get("value"),
            "input_model": valuation_record.get("input_data", {}).get("model", {}).get("value"),
            "input_mileage": valuation_record.get("input_data", {}).get("mileage", {}).get("value"),
            "input_zipcode": valuation_record.get("input_data", {}).get("zipcode", {}).get("value"),
            "shap_adjustments": valuation_record.get("adjustments"),
            "api_version": valuation_record.get("api_version")
        }

        response = _supabase_client.table(AUDIT_TABLE_NAME).insert(log_data).execute()
        
        if response.data:
            logger.info(f"Valuation {log_data['valuation_id']} logged to Supabase successfully.")
        elif response.error:
            logger.error(f"Failed to log valuation {log_data['valuation_id']} to Supabase: {response.error}", exc_info=True)
        else:
            logger.warning(f"Supabase insert for {log_data['valuation_id']} returned unexpected response: {response}")

    except Exception as e:
        logger.error(f"An unexpected error occurred during Supabase logging for valuation {valuation_record.get('valuation_id')}: {e}", exc_info=True)


def run_valuation(input_dict: Dict[str, Any], mode: str = 'sell') -> Dict[str, Any]:
    """
    Execute a complete vehicle valuation with price prediction and analysis.
    
    This function provides the main entry point for vehicle valuations, handling
    the entire workflow from input preprocessing through final report generation.
    It uses a pre-loaded ML model for efficient predictions and adjusts the price
    based on the specified mode (buyer or seller).
    
    Args:
        input_dict (Dict[str, Any]): Vehicle characteristics dictionary conforming to
                                      VehicleDataForValuation schema.
        mode (str): The valuation mode, either 'buy' (from buyer's perspective)
                    or 'sell' (from seller's perspective). Defaults to 'sell'.
    
    Returns:
        Dict[str, Any]: Comprehensive valuation report containing:
            - estimated_value (float): Predicted vehicle price in USD (adjusted by mode)
            - adjustments (Dict[str, Any]): SHAP values and feature names
            - summary (str): Natural language explanation of the valuation
            - confidence_score (float, optional): Market confidence score
            - original_predicted_value (float): The price before mode adjustment
            - mode_adjustment_amount (float): The amount adjusted due to buyer/seller mode
            - valuation_id (str): Unique ID for this valuation
            - timestamp (str): ISO formatted timestamp of the valuation
            - api_version (str): Version of the API that processed the valuation
            - input_data (Dict[str, Any]): The original input data (for audit purposes)
    
    Raises:
        ValueError: If required input fields are missing or invalid.
        RuntimeError: If the model is not initialized (call `initialize_valuation_engine()` first).
        KeyError: If input_dict lacks required vehicle attributes.
    """
    global _loaded_model, _loaded_encoders, _shap_explainer_instance

    if _loaded_model is None or _loaded_encoders is None or _shap_explainer_instance is None:
        raise RuntimeError("Valuation engine not initialized. Call `initialize_valuation_engine()` first.")
    
    if mode not in ['buy', 'sell']:
        raise ValueError("Invalid mode provided. Must be 'buy' or 'sell'.")

    # Preprocess input data (raw, single-row DataFrame)
    input_df = preprocess_input(input_dict)
    # PATCH: Pass raw input DataFrame to pipeline; do not align, reorder, or fill columns manually
    original_predicted_price = predict_price(input_df, _loaded_model, _loaded_encoders)
    
    # Apply buyer/seller adjustment
    adjusted_price = float(original_predicted_price)
    mode_adjustment_amount = 0.0
    if mode == 'buy':
        adjustment_factor = 0.90 
        adjusted_price *= adjustment_factor
        mode_adjustment_amount = original_predicted_price * (adjustment_factor - 1)
    elif mode == 'sell':
        adjustment_factor = 1.00
        adjusted_price *= adjustment_factor
        mode_adjustment_amount = original_predicted_price * (adjustment_factor - 1)

    is_comprehensive = any(isinstance(value, dict) and 'value' in value for value in input_dict.values())
    
    if is_comprehensive:
        from val_engine.shap_explainer import explain_prediction_comprehensive
        explanation = explain_prediction_comprehensive(input_dict)
        shap_values = explanation.get('shap_values', [[]])
        expected_value = explanation.get('expected_value', original_predicted_price)
        feature_names = explanation.get('feature_names', [])
    else:
        from val_engine.shap_explainer import explain_prediction_legacy
        try:
            import val_engine.shap_explainer as shap_module
            shap_module._encoders = _loaded_encoders
            shap_module._model = _loaded_model
            
            shap_result = explain_prediction_legacy(input_df)
            if hasattr(shap_result, 'values'):
                shap_values = [shap_result.values] if shap_result.values.ndim == 1 else shap_result.values.tolist()
                expected_value = getattr(shap_result, 'base_values', original_predicted_price)
                feature_names = input_df.columns.tolist()
            else:
                shap_values = [[]]
                expected_value = original_predicted_price
                feature_names = []
        except Exception as e:
            logger.warning(f"SHAP explanation failed: {e}. Using basic explanation.")
            shap_values = [[]]
            expected_value = original_predicted_price
            feature_names = []
    
    # Fixed bug: don't call .tolist() on a list
    adjustments_list = shap_values[0] if isinstance(shap_values, list) and shap_values else []
    
    if mode_adjustment_amount != 0.0:
        adjustments_list.append(mode_adjustment_amount)
        feature_names.append(f"valuation_mode_{mode}")

    confidence_score = None
    market_confidence_info = input_dict.get('market_confidence_score')
    if market_confidence_info and market_confidence_info.get('verified', False):
        confidence_score = market_confidence_info.get('value')

    summary = generate_valuation_summary(
        adjusted_price, 
        input_dict,
        [adjustments_list],
        expected_value, 
        feature_names,
        mode=mode
    )
    
    valuation_result = {
        "estimated_value": adjusted_price,
        "original_predicted_value": float(original_predicted_price),
        "mode_adjustment_amount": mode_adjustment_amount,
        "mode": mode,
        "adjustments": {
            "feature_contributions": adjustments_list,
            "feature_names": feature_names,
            "expected_base_value": float(expected_value)
        },
        "summary": summary,
        "confidence_score": confidence_score,
        "valuation_id": str(uuid.uuid4()),
        "timestamp": datetime.now().isoformat(),
        "api_version": "3.0",
        "input_data": input_dict
    }

    _log_valuation_to_supabase(valuation_result)
    
    return valuation_result

def load_pipeline(bundle_path: str | Path = DEFAULT_BUNDLE):
    bundle = joblib.load(bundle_path)
    if isinstance(bundle, dict) and "pipe" in bundle:
        return bundle["pipe"], bundle
    # Backward compatibility: if a bare Pipeline was saved
    return bundle, {"metadata": {"note": "legacy pipeline without bundle format"}}

if __name__ == "__main__":
    import argparse
    import os
    import sys
    from val_engine.utils.vin import decode_vin
    from val_engine.utils.epa_lookup import attach_epa
    from val_engine.utils.feature_builder import build_inference_df
    from val_engine.utils.schema import VehicleDataForValuation
    from val_engine.model import load_model_artifacts, predict_price
    from val_engine.market import load_comps_file, compute_market_anchor
    import json
    from datetime import datetime

    parser = argparse.ArgumentParser(description="AIN Valuation Engine: Production-Grade Vehicle Valuation")
    parser.add_argument("--vin", type=str, required=True, help="17-digit VIN for the target vehicle")
    parser.add_argument("--mileage", type=int, required=True, help="Current odometer reading (miles)")
    parser.add_argument("--zip", type=str, required=True, help="5-digit ZIP code for market context")
    parser.add_argument("--condition", type=str, required=True, choices=["excellent", "very_good", "good", "fair", "poor"], help="Vehicle condition (standardized)")
    parser.add_argument("--mode", type=str, required=True, choices=["buy", "sell"], help="Valuation mode: 'buy' or 'sell'")
    parser.add_argument("--title-status", dest="title_status", default=None)
    parser.add_argument("--accidents", type=int, default=None)
    parser.add_argument("--owners", type=int, default=None)
    parser.add_argument("--fuel-type", dest="fuel_type", default=None)
    parser.add_argument("--in-service-date", type=str, default=None, help="Date vehicle entered service (YYYY-MM-DD)")
    parser.add_argument("--warranty-basic-months", type=int, default=36)
    parser.add_argument("--warranty-powertrain-months", type=int, default=60)
    parser.add_argument("--warranty-basic-miles", type=int, default=36000)
    parser.add_argument("--warranty-powertrain-miles", type=int, default=60000)
    parser.add_argument("--comps-file", type=str, default=None, help="Path to JSON file with market comps (optional)")
    parser.add_argument("--output", type=str, default=None, help="Output JSON file path (default: ${AIN_OUTDIR}/valuation_{VIN}.json)")
    args = parser.parse_args()

    # 1. VIN decode
    try:
        vin_decoded = decode_vin(args.vin)
        vin_decoded = attach_epa(vin_decoded)
    except Exception as e:
        print(f"ERROR: VIN decode failed: {e}", file=sys.stderr)
        sys.exit(1)
    if not vin_decoded.get('make') or not vin_decoded.get('model') or not vin_decoded.get('year'):
        print(f"ERROR: VIN decode did not return valid make/model/year for {args.vin}", file=sys.stderr)
        sys.exit(1)

    # 2. Build feature vector using schema and new builder
    from datetime import datetime
    in_service_date = None
    if args.in_service_date:
        try:
            in_service_date = datetime.strptime(args.in_service_date, "%Y-%m-%d").date()
        except Exception:
            print(f"WARNING: Could not parse in_service_date: {args.in_service_date}")
    payload = VehicleDataForValuation(
        vin=args.vin,
        mileage=args.mileage,
        zip=args.zip,
        condition=args.condition,
        mode=args.mode,
        title_status=args.title_status,
        accidents=args.accidents,
        owners=args.owners,
        fuel_type=args.fuel_type,
        in_service_date=in_service_date,
        warranty_basic_months=args.warranty_basic_months,
        warranty_powertrain_months=args.warranty_powertrain_months,
        warranty_basic_miles=args.warranty_basic_miles,
        warranty_powertrain_miles=args.warranty_powertrain_miles
    )

    features_df = build_inference_df(payload, vin_decoded)
    # Load pipeline from bundle
    pipe, bundle = load_pipeline()
    model = pipe

    # 3. Load model
    try:
        model, _ = load_model_artifacts()
    except Exception as e:
        print(f"ERROR: Model load failed: {e}", file=sys.stderr)
        sys.exit(1)

    # 4. Market comps anchoring
    comps_file = args.comps_file or os.environ.get("AIN_COMPS_FILE")
    market_anchor = None
    if comps_file:
        try:
            comps = load_comps_file(comps_file)
            market_anchor = compute_market_anchor(
                comps,
                target_trim=vin_decoded.get('trim'),
                target_year=vin_decoded.get('year'),
                target_miles=args.mileage
            )
        except Exception as e:
            print(f"WARNING: Failed to load or process comps file: {e}", file=sys.stderr)
            market_anchor = None


    # 5. Run valuation (model prediction, market anchoring logic)
    import pandas as pd
    input_df = features_df
    # === Feature alignment (make inference columns match training)
    import pandas as pd, datetime
    now_year = datetime.datetime.utcnow().year

    # 1) Figure out what columns the trained pipeline expects
    expected_cols = None
    if hasattr(model, "feature_names_in_"):
        expected_cols = list(model.feature_names_in_)
    elif isinstance(bundle, dict) and "feature_names" in bundle:
        expected_cols = list(bundle["feature_names"])


    # === Predict
    print("=== DEBUG: Input to model.predict (raw, unaligned) ===")
    print(features_df.head())
    print("dtypes:\n", features_df.dtypes)
    try:
        print("Model expects columns:", model.feature_names_in_)
    except AttributeError:
        pass
    model_pred = float(model.predict(features_df)[0])
    estimated_value = model_pred
    confidence_score = 80
    comps_used = 0
    market_point_estimate = None
    if market_anchor and market_anchor['comps_used'] >= 3 and market_anchor['median_price']:
        # Anchor: blend model and market median, bounded by ±7.5% of median, cannot override by >10%
        market_point_estimate = market_anchor['median_price']
        comps_used = market_anchor['comps_used']
        lower = market_point_estimate * 0.925
        upper = market_point_estimate * 1.075
        estimated_value = min(max(model_pred, lower), upper)
        # If model is outside ±10%, force to median unless confidence < 60
        if abs(model_pred - market_point_estimate) / market_point_estimate > 0.10:
            estimated_value = market_point_estimate
        confidence_score = 90 if comps_used >= 3 else 70

    # 6. SHAP explainability
    try:
        from val_engine.shap_explainer import set_explainer, explain_prediction
        set_explainer(model)
        shap_result = explain_prediction(input_df)
        # For legacy/simple format, shap_result is np.ndarray; for comprehensive, it's a dict
        if isinstance(shap_result, dict):
            top_factors = shap_result.get('feature_explanations', [])[:10]
        else:
            # Legacy: build top factors from feature importances
            top_factors = []
            feature_names = list(input_df.columns)
            for i, val in enumerate(shap_result[0]):
                top_factors.append({
                    'feature': feature_names[i],
                    'contribution': float(val)
                })
            top_factors = sorted(top_factors, key=lambda x: abs(x['contribution']), reverse=True)[:10]
    except Exception as e:
        print(f"WARNING: SHAP explainability failed: {e}", file=sys.stderr)
        top_factors = []

    # 7. LLM summary
    try:
        from val_engine.llm_summary import generate_valuation_summary
        llm_summary = generate_valuation_summary(
            estimated_value,
            {
                'vin': {'value': args.vin, 'verified': True, 'source_origin': 'NHTSA'},
                'year': {'value': vin_decoded.get('year'), 'verified': True, 'source_origin': 'NHTSA'},
                'make': {'value': vin_decoded.get('make'), 'verified': True, 'source_origin': 'NHTSA'},
                'model': {'value': vin_decoded.get('model'), 'verified': True, 'source_origin': 'NHTSA'},
                'trim': {'value': vin_decoded.get('trim'), 'verified': True, 'source_origin': 'NHTSA'},
                'mileage': {'value': args.mileage, 'verified': True, 'source_origin': 'User'},
                'zipcode': {'value': args.zip, 'verified': True, 'source_origin': 'User'},
                'overall_condition_rating': {'value': args.condition, 'verified': True, 'source_origin': 'User'}
            },
            shap_values=[ [f['contribution'] for f in top_factors] ],
            expected_value=market_point_estimate or model_pred,
            feature_names=[f['feature'] for f in top_factors],
            mode=args.mode
        )
    except Exception as e:
        print(f"WARNING: LLM summary failed: {e}", file=sys.stderr)
        llm_summary = ""

    # 8. Compose output
    output = {
        "vin": args.vin,
        "decoded_vehicle": vin_decoded,
        "input": {
            "mileage": args.mileage,
            "zip": args.zip,
            "condition": args.condition,
            "mode": args.mode
        },
        "market": {
            "median_price": market_point_estimate,
            "comps_used": comps_used,
            "listings": market_anchor['listings'] if market_anchor else []
        },
        "estimated_value": round(estimated_value, 2),
        "confidence_score": confidence_score,
        "shap": {
            "top_factors": top_factors
        },
        "llm_summary": llm_summary,
        "timestamp": datetime.now().isoformat(),
        "engine_version": "3.0"
    }

    # 7. Output path
    out_path = args.output or os.path.join(
        os.environ.get("AIN_OUTDIR", os.getcwd()),
        f"valuation_{args.vin}.json"
    )
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w") as f:
        json.dump(output, f, indent=2, default=str)
    print(f"Valuation complete. Output written to {out_path}")