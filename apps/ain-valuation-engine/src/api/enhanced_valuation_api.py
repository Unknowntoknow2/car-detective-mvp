"""
Enhanced Vehicle Valuation API with Comprehensive Data and Buyer/Seller Toggle.

This module provides REST API endpoints for vehicle valuations, integrating
the core valuation engine with robust data validation, model persistence,
and buyer/seller specific pricing.

Features:
- Comprehensive vehicle data input validation using Pydantic.
- Efficient, one-time loading of the ML model pipeline at API startup.
- Buyer/seller specific valuation adjustments.
- AI-powered valuation, SHAP explanations, and LLM-generated summaries.
- Support for batch valuations.
- API health check and valuation retrieval by ID.

Endpoints:
- POST /api/v1/valuations - Create new valuation with comprehensive data and mode.
- GET /api/v1/valuations/<valuation_id> - Retrieve valuation results.
- POST /api/v1/valuations/batch - Process multiple valuations in a single request.
- GET /api/v1/health - API health check.

Author: AIN Engineering Team
Date: 2025-08-05
Version: 3.0 (Comprehensive Schema & Buyer/Seller Toggle)
"""

from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from pydantic import BaseModel, Field, ValidationError
from typing import Any, Dict, List, Optional, Literal, Union
import json
import uuid
from datetime import datetime
import logging
import traceback
import os
import sys

# Add valuation engine to path (assuming 'val_engine' is sibling to 'api' within 'src')
# This handles the structure: /src/api/enhanced_valuation_api.py and /src/val_engine/...
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from val_engine.main import run_valuation, initialize_valuation_engine
from val_engine.model import MODEL_PATH, ENCODERS_PATH # For cleanup in example

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app) # Enable CORS for frontend integration

# In-memory storage for demo (use a persistent database like Supabase in production)
valuation_cache: Dict[str, Dict[str, Any]] = {}

# Global variable to hold the initialized model pipeline
# It will be set by app.before_first_request
MODEL_PIPELINE: Any = None 

# --- Pydantic Models for VehicleDataForValuation (Comprehensive) ---
# This mirrors the TypeScript interface for robust validation

class AttributeInput(BaseModel):
    value: Any
    verified: Optional[bool] = Field(False, description="True if data is verified from an authoritative source.")
    source_origin: Optional[str] = Field(None, description="Source of the data (e.g., 'NHTSA', 'Carfax', 'User', 'AI_Video').")

class FeaturesOptions(BaseModel):
    sunroof_moonroof: Optional[bool] = None
    navigation_system: Optional[bool] = None
    heated_ventilated_seats: Optional[bool] = None
    premium_audio_system: Optional[bool] = None
    advanced_safety_systems: Optional[bool] = None
    leather_seats: Optional[bool] = None
    towing_package: Optional[bool] = None
    third_row_seating: Optional[bool] = None
    remote_start: Optional[bool] = None
    keyless_entry: Optional[bool] = None
    apple_carplay_android_auto: Optional[bool] = None
    # Allows for dynamic additional features not explicitly listed
    model_config = {'extra': 'allow'} # Pydantic v2: allows extra fields

class ValuationVideo(BaseModel):
    file_url: str
    duration_seconds: Optional[float] = None
    uploaded_at: str # ISO string
    verified: bool
    source_origin: Literal['UserUpload', 'DealerSubmission', 'AppRecorded']
    ai_analysis_summary: Optional[str] = None
    ai_condition_score: Optional[float] = Field(None, ge=0, le=100)

class PastListingPriceTrend(BaseModel):
    date: str # ISO 8601 string (e.g., 'YYYY-MM-DD')
    price: float

class VehicleDataForValuation(BaseModel):
    # 1. Core Vehicle Identity
    vin: AttributeInput
    year: AttributeInput
    mileage: AttributeInput
    make: AttributeInput
    model: AttributeInput
    trim_submodel: Optional[AttributeInput] = None
    body_style: Optional[AttributeInput] = None
    drive_type: Optional[AttributeInput] = None
    engine_size_type: Optional[AttributeInput] = None
    transmission: Optional[AttributeInput] = None
    fuel_type: Optional[AttributeInput] = None
    msrp: Optional[AttributeInput] = None

    # 2. Condition & Physical State
    overall_condition_rating: AttributeInput
    exterior_damage: Optional[AttributeInput] = None # value: List[str]
    interior_wear: Optional[AttributeInput] = None # value: List[str]
    mechanical_issues: Optional[AttributeInput] = None # value: List[str]
    tires_brakes_condition: Optional[AttributeInput] = None
    cleanliness_odor: Optional[AttributeInput] = None
    photo_ai_score: Optional[AttributeInput] = None # value: float (0-100)

    # 3. Vehicle History & Title Status
    accident_history: Optional[AttributeInput] = None # value: List[str]
    title_type: Optional[AttributeInput] = None
    number_of_owners: Optional[AttributeInput] = None # value: int
    service_history_available: Optional[AttributeInput] = None # value: bool
    open_recalls: Optional[AttributeInput] = None # value: List[str]
    odometer_accuracy_verified: Optional[AttributeInput] = None # value: bool
    registered_state_history: Optional[AttributeInput] = None # value: List[str]
    inspection_sticker_validity: Optional[AttributeInput] = None # value: bool
    emissions_smog_readiness: Optional[AttributeInput] = None # value: bool

    # 4. Geographic & Market Context
    zipcode: AttributeInput
    nearby_inventory_count: Optional[AttributeInput] = None # value: int
    market_saturation_level: Optional[AttributeInput] = None
    listing_velocity_days: Optional[AttributeInput] = None # value: int
    auction_dealer_density: Optional[AttributeInput] = None # value: int

    # 5. Features, Options & Packages
    features_options: Optional[AttributeInput] = Field(None, description="Container for boolean features/options.")
    installed_modifications: Optional[AttributeInput] = None # value: List[str]
    extra_accessories: Optional[AttributeInput] = None # value: List[str]
    
    # 6. Cosmetic & Aesthetic Factors
    exterior_color: Optional[AttributeInput] = None
    interior_color: Optional[AttributeInput] = None

    # 7. Operational Cost Adjustments
    epa_mpg_combined: Optional[AttributeInput] = None
    local_gas_prices_usd_per_gallon: Optional[AttributeInput] = None

    # 8. Market Behavior & Buyer Psychology
    time_on_market_days: Optional[AttributeInput] = None
    buyer_search_volume_index: Optional[AttributeInput] = None
    seasonal_demand_factor: Optional[AttributeInput] = None

    # 9. Sales Channel & Intent
    ownership_intent: Optional[AttributeInput] = None
    sales_channel: Optional[AttributeInput] = None
    export_potential: Optional[AttributeInput] = None

    # 10. Warranty Status
    factory_warranty_remaining_months: Optional[AttributeInput] = None
    extended_warranty_available: Optional[AttributeInput] = None
    certified_pre_owned: Optional[AttributeInput] = None

    # 11. Other Dynamic/Edge Factors
    vehicle_recall_status: Optional[AttributeInput] = None
    insurance_total_loss_history: Optional[AttributeInput] = None
    past_listing_price_trends: Optional[AttributeInput] = Field(None, description="Container for historical listing prices.")
    owner_demographics_type: Optional[AttributeInput] = None
    last_service_date: Optional[AttributeInput] = None
    battery_health_percentage: Optional[AttributeInput] = None
    vin_decode_level: Optional[AttributeInput] = None
    market_confidence_score: Optional[AttributeInput] = None

    # 12. Video Analysis
    valuation_video: Optional[ValuationVideo] = None # This is not an AttributeInput as it has fixed structure

# --- Model Loading at App Startup ---
# This ensures the model is loaded once when the Flask app starts
# and is ready for predictions.
@app.before_first_request
def load_model_pipeline():
    global MODEL_PIPELINE
    logger.info("Initializing valuation engine pipeline...")
    try:
        MODEL_PIPELINE = initialize_valuation_engine()
        logger.info("Model pipeline loaded successfully.")
    except Exception as e:
        logger.error(f"ERROR during valuation engine initialization: {e}", exc_info=True)
        # In production, you might want to log this error and potentially exit
        # or mark the app as unhealthy (e.g., by raising the exception).
        # For now, we'll let the app start but calls to /valuation will fail.

@app.route('/api/v1/health', methods=['GET'])
def health_check():
    """API health check endpoint"""
    # Check if the model pipeline is loaded
    model_loaded = MODEL_PIPELINE is not None
    return jsonify({
        'status': 'healthy' if model_loaded else 'unhealthy',
        'timestamp': datetime.now().isoformat(),
        'version': '3.0',
        'features': {
            'traditional_valuation': True,
            'video_analysis_ready': True, # Implies schema support, not necessarily active processing
            'ai_insights': True,
            'buyer_seller_toggle': True
        },
        'model_pipeline_status': 'loaded' if model_loaded else 'failed_to_load'
    }), 200

@app.route('/api/v1/valuations', methods=['POST'])
def create_valuation():
    """
    Create a new vehicle valuation.
    Accepts comprehensive VehicleDataForValuation and a 'mode' (buy/sell).
    """
    if not request.is_json:
        logger.warning("Received non-JSON request to /api/v1/valuations.")
        return make_response(jsonify({"error": "Request must be JSON"}), 400)

    try:
        payload = request.get_json()
        
        # Extract valuation mode, default to 'sell'
        # Pydantic will validate the rest of the payload, 'mode' is API-specific
        valuation_mode = payload.pop('mode', 'sell') 
        if valuation_mode not in ['buy', 'sell']:
            logger.warning(f"Invalid 'mode' provided: {valuation_mode}. Must be 'buy' or 'sell'.")
            return make_response(jsonify({"error": "Invalid 'mode' provided. Must be 'buy' or 'sell'."}), 400)

        # Validate the rest of the payload against the comprehensive schema
        # This will raise ValidationError if input does not conform
        validated_data = VehicleDataForValuation(**payload)

        logger.info(f"Received valid valuation request (VIN: {validated_data.vin.value if validated_data.vin else 'N/A'}) in '{valuation_mode}' mode.")
        
        # Ensure model pipeline is loaded before running valuation
        if MODEL_PIPELINE is None:
            logger.error("Valuation engine not initialized. Cannot process request.")
            return make_response(jsonify({"error": "Valuation engine not ready. Please try again later."}), 503)

        # Pass the mode to run_valuation
        # .model_dump() converts Pydantic model to a dict, including nested models
        valuation_result = run_valuation(validated_data.model_dump(by_alias=True), mode=valuation_mode) 

        # Generate a unique ID for this valuation and cache it
        valuation_id = str(uuid.uuid4())
        valuation_result['valuation_id'] = valuation_id
        valuation_result['timestamp'] = datetime.now().isoformat()
        valuation_result['api_version'] = '3.0'
        valuation_cache[valuation_id] = valuation_result
        
        logger.info(f"Completed valuation {valuation_id}: Estimated Value ${valuation_result['estimated_value']:,.2f} in '{valuation_mode}' mode.")

        return jsonify({
            "success": True,
            "valuation_id": valuation_id,
            "estimated_value": valuation_result.get("estimated_value"),
            "confidence_score": valuation_result.get("confidence_score"),
            "adjustments": valuation_result.get("adjustments"),
            "summary": valuation_result.get("summary"), # Key is 'summary' from main.py
            "raw_valuation_data": valuation_result  # Include full result for trace/debug
        }), 200

    except ValidationError as ve:
        logger.warning(f"Validation error for /api/v1/valuations: {ve.errors()}")
        return make_response(jsonify({
            "success": False,
            "error": "Invalid input data",
            "details": ve.errors()
        }), 400)

    except Exception as e:
        logger.error(f"Unexpected error during /api/v1/valuations: {e}", exc_info=True)
        return make_response(jsonify({
            "success": False,
            "error": "Internal server error",
            "details": "An unexpected error occurred during valuation processing."
        }), 500)

# Removed /api/v1/valuations/video as its functionality is covered by the comprehensive /api/v1/valuations endpoint

@app.route('/api/v1/valuations/<valuation_id>', methods=['GET'])
def get_valuation(valuation_id):
    """Retrieve a previously computed valuation by ID"""
    try:
        if valuation_id not in valuation_cache:
            logger.info(f"Valuation ID {valuation_id} not found in cache.")
            return jsonify({'error': 'Valuation not found'}), 404
        
        logger.info(f"Retrieving valuation {valuation_id} from cache.")
        return jsonify(valuation_cache[valuation_id]), 200
        
    except Exception as e:
        logger.error(f"Failed to retrieve valuation {valuation_id}: {str(e)}", exc_info=True)
        return jsonify({
            'error': 'Failed to retrieve valuation',
            'details': 'An internal error occurred.'
        }), 500

@app.route('/api/v1/valuations/batch', methods=['POST'])
def batch_valuations():
    """Process multiple valuations in a single request"""
    if not request.is_json:
        logger.warning("Received non-JSON request to /api/v1/valuations/batch.")
        return make_response(jsonify({"error": "Request must be JSON"}), 400)

    try:
        data = request.get_json()
        if not data or 'vehicles' not in data:
            logger.warning("Batch request missing 'vehicles' array.")
            return make_response(jsonify({'error': 'vehicles array required in batch request'}), 400)
        
        vehicles_payload = data['vehicles']
        if not isinstance(vehicles_payload, list) or len(vehicles_payload) == 0:
            logger.warning("Batch request 'vehicles' must be a non-empty array.")
            return make_response(jsonify({'error': 'vehicles must be a non-empty array'}), 400)
        
        # Limit batch size for performance and resource management
        MAX_BATCH_SIZE = 25 # Increased from 10 to 25 for typical dealer inventories
        if len(vehicles_payload) > MAX_BATCH_SIZE:
            logger.warning(f"Batch size {len(vehicles_payload)} exceeds limit of {MAX_BATCH_SIZE}.")
            return make_response(jsonify({'error': f'Maximum {MAX_BATCH_SIZE} vehicles per batch'}), 400)
        
        # Ensure model pipeline is loaded
        if MODEL_PIPELINE is None:
            logger.error("Valuation engine not initialized for batch request.")
            return make_response(jsonify({"error": "Valuation engine not ready. Please try again later."}), 503)

        results = []
        for i, vehicle_data_raw in enumerate(vehicles_payload):
            valuation_id = f"batch_{uuid.uuid4()}_{i}"
            try:
                # Extract mode for each vehicle in batch, default to 'sell'
                batch_valuation_mode = vehicle_data_raw.pop('mode', 'sell')
                if batch_valuation_mode not in ['buy', 'sell']:
                    logger.warning(f"Invalid 'mode' for batch item {i}: {batch_valuation_mode}. Defaulting to 'sell'.")
                    batch_valuation_mode = 'sell' # Default if invalid mode

                # Validate each vehicle's data against the comprehensive schema
                validated_data = VehicleDataForValuation(**vehicle_data_raw)
                
                logger.info(f"Processing batch item {i} (VIN: {validated_data.vin.value if validated_data.vin else 'N/A'}) in '{batch_valuation_mode}' mode.")
                
                result = run_valuation(validated_data.model_dump(by_alias=True), mode=batch_valuation_mode)
                
                result.update({
                    'valuation_id': valuation_id,
                    'batch_index': i,
                    'timestamp': datetime.now().isoformat(),
                    'status': 'success'
                })
                
                results.append(result)
                valuation_cache[valuation_id] = result
                
            except ValidationError as ve:
                logger.warning(f"Validation error for batch item {i}: {ve.errors()}")
                results.append({
                    'batch_index': i,
                    'valuation_id': valuation_id,
                    'error': "Invalid input data",
                    'details': ve.errors(),
                    'status': 'failed'
                })
            except Exception as e:
                logger.error(f"Error processing batch item {i}: {e}", exc_info=True)
                results.append({
                    'batch_index': i,
                    'valuation_id': valuation_id,
                    'error': "Internal processing error",
                    'details': str(e),
                    'status': 'failed'
                })
        
        logger.info(f"Batch processing complete. Total: {len(vehicles_payload)}, Success: {len([r for r in results if r.get('status') == 'success'])}, Failed: {len([r for r in results if r.get('status') == 'failed'])}")

        return jsonify({
            'batch_request_id': str(uuid.uuid4()),
            'total_vehicles_in_batch': len(vehicles_payload),
            'successful_valuations': len([r for r in results if r.get('status') == 'success']),
            'failed_valuations': len([r for r in results if r.get('status') == 'failed']),
            'results': results
        }), 200
        
    except Exception as e:
        logger.error(f"Overall batch request failed: {e}", exc_info=True)
        return jsonify({
            'error': 'Batch request processing failed',
            'details': 'An unexpected error occurred during batch processing.'
        }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({'error': 'Method not allowed'}), 405

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Development server configuration
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    logger.info(f"Starting AIN Valuation API v3.0 on port {port}")
    logger.info(f"Debug mode: {debug}")
    logger.info("Features: Comprehensive valuation + AI video analysis + Buyer/Seller Toggle")
    
    # Clean up model artifacts from previous local test runs (if any)
    # This is for development convenience, not for production deployment.
    # This ensures a fresh start for model loading during app.before_first_request
    model_path_in_model_py = 'gradient_boosting_model.joblib'
    encoders_path_in_model_py = 'label_encoders.joblib'
    if os.path.exists(model_path_in_model_py):
        os.remove(model_path_in_model_py)
    if os.path.exists(encoders_path_in_model_py):
        os.remove(encoders_path_in_model_py)
    logger.info("Cleaned up model artifacts before starting Flask app for fresh test.")

    app.run(host='0.0.0.0', port=port, debug=debug)

