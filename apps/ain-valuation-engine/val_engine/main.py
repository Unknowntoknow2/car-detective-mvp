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
    from dotenv import load_dotenv
    load_dotenv()
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

    # Preprocess input data
    input_df = preprocess_input(input_dict)
    
    # Generate price prediction using the loaded model and encoders
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

if __name__ == "__main__":
    model_path_in_model_py = 'gradient_boosting_model.joblib'
    encoders_path_in_model_py = 'label_encoders.joblib'
    if os.path.exists(model_path_in_model_py):
        os.remove(model_path_in_model_py)
    if os.path.exists(encoders_path_in_model_py):
        os.remove(encoders_path_in_model_py)
    logger.info("Cleaned up model artifacts before starting Flask app for fresh test.")

    initialize_valuation_engine()

    sample_vehicle_data = {
        'vin': {'value': '1HGCM82633A004352', 'verified': True, 'source_origin': 'NHTSA'},
        'year': {'value': 2020, 'verified': True, 'source_origin': 'OEM'},
        'mileage': {'value': 45000, 'verified': True, 'source_origin': 'Odometer'},
        'make': {'value': 'Honda', 'verified': True, 'source_origin': 'OEM'},
        'model': {'value': 'Civic', 'verified': True, 'source_origin': 'OEM'},
        'overall_condition_rating': {'value': 'Good', 'verified': False, 'source_origin': 'User'},
        'zipcode': {'value': 94107, 'verified': True, 'source_origin': 'User'},
        'photo_ai_score': {'value': 84, 'verified': True, 'source_origin': 'AI_Photo'},
        'ai_video_condition_score': {'value': 77, 'verified': True, 'source_origin': 'AI_Video'},
        'accident_history': {'value': [], 'verified': True, 'source_origin': 'Carfax'},
        'title_type': {'value': 'Clean', 'verified': True, 'source_origin': 'Carfax'},
        'factory_warranty_remaining_months': {'value': 24, 'verified': True, 'source_origin': 'OEM'},
        'features_options': {
            'value': {'sunroof_moonroof': True, 'advanced_safety_systems': True},
            'verified': False, 'source_origin': 'User'
        },
        'exterior_color': {'value': 'Blue', 'verified': True, 'source_origin': 'OEM'},
        'market_confidence_score': {'value': 92, 'verified': True, 'source_origin': 'AIN_Engine'}
    }
    
    print("\n--- Running Valuation for Sample Vehicle (Sell Mode) ---")
    result_sell = run_valuation(sample_vehicle_data, mode='sell')
    print("Valuation Results (Sell Mode):")
    print(f"Estimated Value: ${result_sell['estimated_value']:,.2f}")
    print(f"Original Predicted Value: ${result_sell['original_predicted_value']:,.2f}")
    print(f"Mode Adjustment: ${result_sell['mode_adjustment_amount']:,.2f}")
    print(f"Confidence Score: {result_sell['confidence_score']}/100")
    print(f"Summary: {result_sell['summary']}")
    print("\nFeature Contributions (Sell Mode):")
    if result_sell['adjustments']['feature_names'] and result_sell['adjustments']['feature_contributions']:
        for feature, contribution in zip(result_sell['adjustments']['feature_names'], result_sell['adjustments']['feature_contributions']):
            print(f"   {feature}: ${contribution:+.2f}")

    print("\n--- Running Valuation for Sample Vehicle (Buy Mode) ---")
    result_buy = run_valuation(sample_vehicle_data, mode='buy')
    print("Valuation Results (Buy Mode):")
    print(f"Estimated Value: ${result_buy['estimated_value']:,.2f}")
    print(f"Original Predicted Value: ${result_buy['original_predicted_value']:,.2f}")
    print(f"Mode Adjustment: ${result_buy['mode_adjustment_amount']:,.2f}")
    print(f"Confidence Score: {result_buy['confidence_score']}/100")
    print(f"Summary: {result_buy['summary']}")
    print("\nFeature Contributions (Buy Mode):")
    if result_buy['adjustments']['feature_names'] and result_buy['adjustments']['feature_contributions']:
        for feature, contribution in zip(result_buy['adjustments']['feature_names'], result_buy['adjustments']['feature_contributions']):
            print(f"   {feature}: ${contribution:+.2f}")

    output_filename_sell = "valuation_output_sell.json"
    output_filename_buy = "valuation_output_buy.json"
    try:
        with open(output_filename_sell, "w") as f:
            json.dump(result_sell, f, indent=2, default=str)
        print(f"\nResults saved to '{output_filename_sell}'")
        with open(output_filename_buy, "w") as f:
            json.dump(result_buy, f, indent=2, default=str)
        print(f"Results saved to '{output_filename_buy}'")
    except Exception as e:
        print(f"Warning: Failed to save results to JSON: {e}")