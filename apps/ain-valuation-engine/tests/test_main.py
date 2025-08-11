"""
Comprehensive test suite for the AIN Vehicle Valuation Engine API and core logic.

This module uses pytest to test the enhanced_valuation_api.py endpoints
and the underlying valuation engine components (main.py, model.py, shap_explainer.py, llm_summary.py).

Tests cover:
- API endpoint functionality (single valuation, batch, health check).
- Input validation using the comprehensive VehicleDataForValuation Pydantic schema.
- Buyer/seller mode adjustments and their reflection in the output.
- Integration of ML prediction, SHAP explanations, and LLM summaries.
- Proper error handling for invalid inputs and internal issues.
- Model loading and persistence.

To run these tests:
1. Ensure all dependencies from requirements.txt are installed (`pip install -r requirements.txt`).
2. Navigate to the root of your project (e.g., /workspaces/ain-valuation-engine/).
3. Run pytest: `pytest` or `python -m pytest`
"""

import pytest
import json
import os
import sys
import pandas as pd
from unittest.mock import patch, AsyncMock

# Adjust sys.path to allow imports from src/api and val_engine
# Assuming test_main.py is in /workspaces/ain-valuation-engine/tests/
# We need to add the project root to sys.path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

# Now, imports should work directly from the project root
from src.api.enhanced_valuation_api import app, VehicleDataForValuation, AttributeInput, ValuationVideo
from val_engine.main import initialize_valuation_engine, run_valuation, _loaded_model, _loaded_encoders, _shap_explainer_instance
from val_engine.model import MODEL_PATH, ENCODERS_PATH, train_model # Import train_model for setup
from val_engine.utils.data_loader import load_training_data


# --- Fixtures for Test Setup and Teardown ---

@pytest.fixture(scope='session', autouse=True)
def setup_and_teardown_model_artifacts():
    """
    Fixture to ensure model artifacts are trained and loaded before tests,
    and cleaned up afterwards. This runs once per test session.
    """
    # Ensure a clean state before tests
    if os.path.exists(MODEL_PATH):
        os.remove(MODEL_PATH)
    if os.path.exists(ENCODERS_PATH):
        os.remove(ENCODERS_PATH)
    
    # Initialize the valuation engine (trains and loads model)
    print("\nSetting up valuation engine for tests...")
    initialize_valuation_engine()
    print("Valuation engine setup complete.")

    yield # Tests run here

    # Clean up model artifacts after all tests
    print("\nCleaning up model artifacts after tests...")
    if os.path.exists(MODEL_PATH):
        os.remove(MODEL_PATH)
    if os.path.exists(ENCODERS_PATH):
        os.remove(ENCODERS_PATH)
    print("Model artifacts cleaned up.")

@pytest.fixture(scope='module')
def client():
    """
    Configures the Flask test client for the API.
    """
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

# --- Mock Data for Comprehensive VehicleDataForValuation ---

@pytest.fixture
def sample_vehicle_data_full():
    """
    Provides a comprehensive, valid VehicleDataForValuation dictionary.
    """
    return {
        "vin": {"value": "1HGCM82633A004352", "verified": True, "source_origin": "NHTSA"},
        "year": {"value": 2020, "verified": True, "source_origin": "OEM"},
        "make": {"value": "Honda", "verified": True, "source_origin": "OEM"},
        "model": {"value": "Civic", "verified": True, "source_origin": "OEM"},
        "mileage": {"value": 45000, "verified": True, "source_origin": "Odometer"},
        "zipcode": {"value": 94107, "verified": True, "source_origin": "User"},
        "overall_condition_rating": {"value": "Good", "verified": False, "source_origin": "User"},
        "photo_ai_score": {"value": 84, "verified": True, "source_origin": "AI_Photo"},
        "ai_video_condition_score": {"value": 77, "verified": True, "source_origin": "AI_Video"},
        "accident_history": {"value": [], "verified": True, "source_origin": "Carfax"},
        "title_type": {"value": "Clean", "verified": True, "source_origin": "Carfax"},
        "factory_warranty_remaining_months": {"value": 24, "verified": True, "source_origin": "OEM"},
        "features_options": {"value": {"sunroof_moonroof": True, "advanced_safety_systems": True}, "verified": False, "source_origin": "User"},
        "installed_modifications": {"value": ["custom wheels"], "verified": False, "source_origin": "User"},
        "exterior_color": {"value": "Blue", "verified": True, "source_origin": "OEM"},
        "interior_color": {"value": "Black", "verified": True, "source_origin": "OEM"},
        "market_confidence_score": {"value": 92, "verified": True, "source_origin": "AIN_Engine"},
        "time_on_market_days": {"value": 30, "verified": True, "source_origin": "MarketListing"},
        "buyer_search_volume_index": {"value": 0.8, "verified": True, "source_origin": "MarketData"},
        "seasonal_demand_factor": {"value": 1.0, "verified": True, "source_origin": "AIN_Engine"},
        "epa_mpg_combined": {"value": 35, "verified": True, "source_origin": "EPA"},
        "local_gas_prices_usd_per_gallon": {"value": 4.20, "verified": True, "source_origin": "API"},
        "ownership_intent": {"value": "Sell", "verified": False, "source_origin": "User"},
        "sales_channel": {"value": "Private", "verified": False, "source_origin": "User"},
        "export_potential": {"value": False, "verified": False, "source_origin": "User"},
        "extended_warranty_available": {"value": False, "verified": False, "source_origin": "User"},
        "certified_pre_owned": {"value": False, "verified": False, "source_origin": "User"},
        "vehicle_recall_status": {"value": "None", "verified": True, "source_origin": "NHTSA"},
        "insurance_total_loss_history": {"value": False, "verified": True, "source_origin": "Carfax"},
        "past_listing_price_trends": {"value": [{"date": "2024-01-01", "price": 20000}], "verified": True, "source_origin": "MarketListing"},
        "owner_demographics_type": {"value": "Individual", "verified": False, "source_origin": "User"},
        "last_service_date": {"value": "2024-06-01", "verified": False, "source_origin": "User"},
        "battery_health_percentage": {"value": 90, "verified": True, "source_origin": "OBD"},
        "vin_decode_level": {"value": "Full", "verified": True, "source_origin": "NHTSA"},
        "valuation_video": {
            "file_url": "http://example.com/video.mp4",
            "duration_seconds": 120.5,
            "uploaded_at": "2024-07-20T10:00:00Z",
            "verified": True,
            "source_origin": "AppRecorded",
            "ai_analysis_summary": "No significant exterior damage detected. Engine sound normal.",
            "ai_condition_score": 88.0
        }
    }

@pytest.fixture
def sample_vehicle_data_minimal():
    """
    Provides a minimal, valid VehicleDataForValuation dictionary.
    """
    return {
        "vin": {"value": "MINIMALVIN12345678", "verified": True, "source_origin": "NHTSA"},
        "year": {"value": 2018, "verified": True, "source_origin": "OEM"},
        "make": {"value": "Ford", "verified": True, "source_origin": "OEM"},
        "model": {"value": "Focus", "verified": True, "source_origin": "OEM"},
        "mileage": {"value": 70000, "verified": True, "source_origin": "Odometer"},
        "zipcode": {"value": 10001, "verified": True, "source_origin": "User"},
        "overall_condition_rating": {"value": "Fair", "verified": False, "source_origin": "User"},
    }

# --- Mocking LLM API Call ---
# Since actual LLM calls are external and can be slow/costly, we mock them for tests.
@pytest.fixture(autouse=True)
def mock_llm_api():
    """
    Mocks the _call_llm_api function to prevent actual external LLM calls during tests.
    """
    with patch('val_engine.llm_summary._call_llm_api', new_callable=AsyncMock) as mock_call:
        mock_call.return_value = "This is a mock LLM summary for testing purposes."
        yield mock_call

# --- Tests for API Endpoints ---

def test_health_check(client):
    """Test the /api/v1/health endpoint."""
    response = client.get('/api/v1/health')
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'healthy'
    assert data['version'] == '3.0'
    assert data['model_pipeline_status'] == 'loaded'

def test_create_valuation_success_sell_mode(client, sample_vehicle_data_full):
    """Test successful valuation creation in 'sell' mode with full data."""
    payload = sample_vehicle_data_full.copy()
    payload['mode'] = 'sell'
    response = client.post('/api/v1/valuations', json=payload)
    assert response.status_code == 200
    data = response.get_json()
    assert data['success'] is True
    assert 'valuation_id' in data
    assert 'estimated_value' in data
    assert 'summary' in data
    assert 'adjustments' in data
    assert isinstance(data['estimated_value'], float)
    assert isinstance(data['summary'], str)
    assert 'seller' in data['summary'].lower() # Check if summary reflects 'sell' mode

def test_create_valuation_success_buy_mode(client, sample_vehicle_data_full):
    """Test successful valuation creation in 'buy' mode with full data."""
    payload = sample_vehicle_data_full.copy()
    payload['mode'] = 'buy'
    response = client.post('/api/v1/valuations', json=payload)
    assert response.status_code == 200
    data = response.get_json()
    assert data['success'] is True
    assert 'valuation_id' in data
    assert 'estimated_value' in data
    assert 'summary' in data
    assert 'adjustments' in data
    assert isinstance(data['estimated_value'], float)
    assert isinstance(data['summary'], str)
    assert 'buyer' in data['summary'].lower() # Check if summary reflects 'buy' mode
    # Verify that buy mode price is lower than sell mode (approx 10% discount from main.py)
    # This requires a separate call or specific mock for comparison
    # For now, we'll just check the summary reflects the mode.

def test_create_valuation_invalid_mode(client, sample_vehicle_data_minimal):
    """Test valuation with an invalid mode."""
    payload = sample_vehicle_data_minimal.copy()
    payload['mode'] = 'invalid_mode'
    response = client.post('/api/v1/valuations', json=payload)
    assert response.status_code == 400
    data = response.get_json()
    assert data['success'] is False
    assert 'Invalid' in data['error']
    assert 'mode' in data['error']

def test_create_valuation_missing_required_field(client):
    """Test valuation with missing required Pydantic field (e.g., 'vin')."""
    invalid_payload = {
        "year": {"value": 2020, "verified": True, "source_origin": "OEM"},
        "make": {"value": "Honda", "verified": True, "source_origin": "OEM"},
        "model": {"value": "Civic", "verified": True, "source_origin": "OEM"},
        "mileage": {"value": 45000, "verified": True, "source_origin": "Odometer"},
        "zipcode": {"value": 94107, "verified": True, "source_origin": "User"},
        "overall_condition_rating": {"value": "Good", "verified": False, "source_origin": "User"},
    }
    response = client.post('/api/v1/valuations', json=invalid_payload)
    assert response.status_code == 400
    data = response.get_json()
    assert data['success'] is False
    assert 'Invalid input data' in data['error']
    assert any("vin" in error['loc'] for error in data['details']) # Check for specific field error

def test_create_valuation_invalid_field_type(client, sample_vehicle_data_minimal):
    """Test valuation with an invalid type for a Pydantic field."""
    invalid_payload = sample_vehicle_data_minimal.copy()
    invalid_payload['year']['value'] = "two thousand twenty" # Year should be int
    response = client.post('/api/v1/valuations', json=invalid_payload)
    assert response.status_code == 400
    data = response.get_json()
    assert data['success'] is False
    assert 'Invalid input data' in data['error']
    assert any("year" in error['loc'] and "value" in error['loc'] for error in data['details'])

def test_get_valuation_success(client, sample_vehicle_data_full):
    """Test retrieving a previously created valuation."""
    # First, create a valuation to get an ID
    create_response = client.post('/api/v1/valuations', json=sample_vehicle_data_full)
    assert create_response.status_code == 200
    valuation_id = create_response.get_json()['valuation_id']

    # Then, retrieve it
    get_response = client.get(f'/api/v1/valuations/{valuation_id}')
    assert get_response.status_code == 200
    data = get_response.get_json()
    assert data['valuation_id'] == valuation_id
    assert 'estimated_value' in data

def test_get_valuation_not_found(client):
    """Test retrieving a non-existent valuation."""
    response = client.get('/api/v1/valuations/non-existent-id')
    assert response.status_code == 404
    data = response.get_json()
    assert 'Valuation not found' in data['error']

def test_batch_valuations_success(client, sample_vehicle_data_full, sample_vehicle_data_minimal):
    """Test successful batch valuation processing."""
    batch_payload = {
        "vehicles": [
            sample_vehicle_data_full.copy(),
            sample_vehicle_data_minimal.copy()
        ]
    }
    batch_payload['vehicles'][0]['mode'] = 'sell'
    batch_payload['vehicles'][1]['mode'] = 'buy'

    response = client.post('/api/v1/valuations/batch', json=batch_payload)
    assert response.status_code == 200
    data = response.get_json()
    assert data['total_vehicles_in_batch'] == 2
    assert data['successful_valuations'] == 2
    assert data['failed_valuations'] == 0
    assert len(data['results']) == 2
    assert 'valuation_id' in data['results'][0]
    assert 'estimated_value' in data['results'][0]
    assert data['results'][0]['summary'] # Check if summary is present
    assert 'seller' in data['results'][0]['summary'].lower() # Check mode for first item
    assert 'buyer' in data['results'][1]['summary'].lower() # Check mode for second item

def test_batch_valuations_with_invalid_item(client, sample_vehicle_data_full):
    """Test batch valuation with one invalid item."""
    invalid_item = sample_vehicle_data_full.copy()
    del invalid_item['vin'] # Make it invalid by removing a required field

    batch_payload = {
        "vehicles": [
            sample_vehicle_data_full.copy(),
            invalid_item
        ]
    }
    response = client.post('/api/v1/valuations/batch', json=batch_payload)
    assert response.status_code == 200 # Batch endpoint returns 200 even if some items fail
    data = response.get_json()
    assert data['total_vehicles_in_batch'] == 2
    assert data['successful_valuations'] == 1
    assert data['failed_valuations'] == 1
    assert data['results'][1]['status'] == 'failed'
    assert 'Invalid input data' in data['results'][1]['error']

def test_batch_valuations_empty_array(client):
    """Test batch valuation with an empty vehicles array."""
    response = client.post('/api/v1/valuations/batch', json={"vehicles": []})
    assert response.status_code == 400
    data = response.get_json()
    assert 'non-empty array' in data['error']

def test_batch_valuations_exceed_limit(client, sample_vehicle_data_minimal):
    """Test batch valuation exceeding the maximum limit."""
    many_vehicles = [sample_vehicle_data_minimal.copy() for _ in range(30)] # Max is 25
    response = client.post('/api/v1/valuations/batch', json={"vehicles": many_vehicles})
    assert response.status_code == 400
    data = response.get_json()
    assert 'Maximum 25 vehicles per batch' in data['error']

# --- Integration Tests for Core Logic (beyond API) ---

def test_run_valuation_core_logic_sell(sample_vehicle_data_full):
    """Test run_valuation function directly in 'sell' mode."""
    # Ensure model is initialized (done by autouse fixture)
    assert _loaded_model is not None
    assert _loaded_encoders is not None
    assert _shap_explainer_instance is not None

    result = run_valuation(sample_vehicle_data_full, mode='sell')
    assert 'estimated_value' in result
    assert result['estimated_value'] > 0
    assert 'summary' in result
    assert 'seller' in result['summary'].lower()
    assert 'adjustments' in result
    assert 'feature_contributions' in result['adjustments']
    assert 'feature_names' in result['adjustments']
    assert 'expected_base_value' in result['adjustments']
    assert 'original_predicted_value' in result
    assert result['mode_adjustment_amount'] >= 0 # Sell mode typically no discount or slight premium

def test_run_valuation_core_logic_buy(sample_vehicle_data_full):
    """Test run_valuation function directly in 'buy' mode."""
    # Ensure model is initialized (done by autouse fixture)
    assert _loaded_model is not None
    assert _loaded_encoders is not None
    assert _shap_explainer_instance is not None

    result = run_valuation(sample_vehicle_data_full, mode='buy')
    assert 'estimated_value' in result
    assert result['estimated_value'] > 0
    assert 'summary' in result
    assert 'buyer' in result['summary'].lower()
    assert 'adjustments' in result
    assert 'original_predicted_value' in result
    assert result['mode_adjustment_amount'] < 0 # Buy mode typically applies a discount

    # Verify buy price is lower than sell price (assuming default 10% discount in main.py)
    # This is a rough check, actual values depend on the trained model
    sell_result = run_valuation(sample_vehicle_data_full, mode='sell')
    assert result['estimated_value'] < sell_result['estimated_value']

def test_run_valuation_invalid_input_data_type():
    """Test run_valuation with invalid input data type (not a dict)."""
    with pytest.raises(Exception) as excinfo: # Expecting a Pydantic ValidationError from API, or potentially ValueError from preprocess_input
        # We need to mock preprocess_input here if we want to test run_valuation in isolation
        # For now, we'll let it flow through and catch general exception
        run_valuation("not a dict", mode='sell')
    assert "Invalid input" in str(excinfo.value) or "must be a dict" in str(excinfo.value) # Adjust based on exact error from preprocess_input

def test_run_valuation_uninitialized_engine():
    """Test run_valuation when the engine is not initialized."""
    # Temporarily set globals to None to simulate uninitialized state
    global _loaded_model, _loaded_encoders, _shap_explainer_instance
    original_model = _loaded_model
    original_encoders = _loaded_encoders
    original_explainer = _shap_explainer_instance

    _loaded_model = None
    _loaded_encoders = {}
    _shap_explainer_instance = None

    try:
        with pytest.raises(RuntimeError, match="Valuation engine not initialized"):
            run_valuation({}, mode='sell') # Empty dict will fail Pydantic, but RuntimeError should come first
    finally:
        # Restore original state
        _loaded_model = original_model
        _loaded_encoders = original_encoders
        _shap_explainer_instance = original_explainer

