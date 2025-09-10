"""
ETL (Extract, Transform, Load) pipeline for the AIN Vehicle Valuation Engine.

This module provides functions to extract raw vehicle data (e.g., from CSV or JSON),
transform it into the comprehensive VehicleDataForValuation schema, and then
preprocess it into a flattened, numerical DataFrame suitable for machine
learning model training or batch inference.

It leverages the `preprocess_input` function from `val_engine.utils.data_loader`
to ensure consistency with the model's expected feature format.

Features:
- Reads raw vehicle data from CSV or a list of dictionaries.
- Validates and maps raw data to the comprehensive VehicleDataForValuation structure.
- Applies preprocessing steps to flatten and numericalize features.
- Handles potential data quality issues during the ETL process.

Dependencies:
    - pandas: For data manipulation.
    - typing: For type hints.
    - val_engine.utils.data_loader: For `preprocess_input`.
    - src.api.enhanced_valuation_api: For `VehicleDataForValuation` Pydantic model.
    - pydantic: For robust data validation.

Example:
    >>> from etl import process_raw_vehicle_data
    >>> 
    >>> # Example 1: Process data from a list of raw dictionaries
    >>> raw_data_list = [
    ...     {
    ...         "VIN": "ABC123...", "Year": 2020, "Make": "Honda", "Model": "Civic",
    ...         "Mileage": 45000, "ZipCode": 94107, "Condition_Rating": "Good",
    ...         "Photo_AI_Score": 85, "Video_Condition_Score": 78,
    ...         "Accident_History": "None", "Title_Type": "Clean",
    ...         "Factory_Warranty_Months": 12, "Sunroof": "Yes", "Advanced_Safety": "Yes",
    ...         "Exterior_Color": "Blue", "Market_Confidence": 90
    ...     },
    ...     {
    ...         "VIN": "DEF456...", "Year": 2018, "Make": "Toyota", "Model": "Camry",
    ...         "Mileage": 70000, "ZipCode": 90210, "Condition_Rating": "Fair",
    ...         "Photo_AI_Score": 60, "Video_Condition_Score": 55,
    ...         "Accident_History": "Minor", "Title_Type": "Clean",
    ...         "Factory_Warranty_Months": 0, "Sunroof": "No", "Advanced_Safety": "No",
    ...         "Exterior_Color": "White", "Market_Confidence": 75
    ...     }
    ... ]
    >>> processed_df_list = process_raw_vehicle_data(raw_data_list)
    >>> print("\\nProcessed DataFrame from List:")
    >>> print(processed_df_list.head())
    >>> 
    >>> # Example 2: Process data from a mock CSV file
    >>> # Create a dummy CSV file for demonstration
    >>> import io
    >>> csv_data = '''VIN,Year,Make,Model,Mileage,ZipCode,Condition_Rating,Photo_AI_Score,Video_Condition_Score,Accident_History,Title_Type,Factory_Warranty_Months,Sunroof,Advanced_Safety,Exterior_Color,Market_Confidence
    ... GHI789...,2022,Tesla,Model 3,20000,94105,Excellent,95,92,None,Clean,36,Yes,Yes,Black,98
    ... JKL012...,2015,BMW,3 Series,90000,10001,Poor,40,30,Major,Salvage,0,No,No,Gray,50
    ... '''
    >>> with open("mock_vehicles.csv", "w") as f:
    ...     f.write(csv_data)
    >>> 
    >>> processed_df_csv = process_raw_vehicle_data("mock_vehicles.csv")
    >>> print("\\nProcessed DataFrame from CSV:")
    >>> print(processed_df_csv.head())
    >>> 
    >>> # Clean up mock CSV
    >>> import os
    >>> os.remove("mock_vehicles.csv")
"""

import pandas as pd
from typing import Dict, Any, List, Union, Optional
import os
import sys
import logging
from datetime import datetime

# Adjust sys.path to allow imports from src/api and val_engine
# Assuming etl.py is in the root or a sibling to src/ and val_engine/
# This ensures that 'val_engine.utils.data_loader' and 'enhanced_valuation_api' can be found.
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'val_engine', 'utils')))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src', 'api')))


from val_engine.utils.data_loader import preprocess_input
from src.api.enhanced_valuation_api import VehicleDataForValuation, AttributeInput, ValuationVideo # Import Pydantic models
from pydantic import ValidationError

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


def _map_raw_to_comprehensive_schema(raw_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    Maps a raw input dictionary (e.g., from CSV row) to the comprehensive
    VehicleDataForValuation Pydantic model structure.

    This function handles common variations in raw input naming and
    converts them into the nested AttributeInput format.

    Args:
        raw_data (Dict[str, Any]): A single dictionary of raw vehicle attributes.

    Returns:
        Optional[Dict[str, Any]]: A dictionary conforming to VehicleDataForValuation's
                                  expected structure, or None if mapping fails.
    """
    mapped_data = {}

    # Helper to create AttributeInput structure
    def create_attribute_input(value: Any, verified: bool = False, source: Optional[str] = None) -> Dict[str, Any]:
        return {"value": value, "verified": verified, "source_origin": source}

    try:
        # Core Vehicle Identity
        mapped_data["vin"] = create_attribute_input(raw_data.get("VIN", raw_data.get("vin")), verified=True, source="Raw_Input")
        mapped_data["year"] = create_attribute_input(raw_data.get("Year", raw_data.get("year")), verified=True, source="Raw_Input")
        mapped_data["make"] = create_attribute_input(raw_data.get("Make", raw_data.get("make")), verified=True, source="Raw_Input")
        mapped_data["model"] = create_attribute_input(raw_data.get("Model", raw_data.get("model")), verified=True, source="Raw_Input")
        mapped_data["mileage"] = create_attribute_input(raw_data.get("Mileage", raw_data.get("mileage")), verified=True, source="Raw_Input")
        mapped_data["zipcode"] = create_attribute_input(raw_data.get("ZipCode", raw_data.get("zipcode")), verified=True, source="Raw_Input")
        
        # Condition & Physical State
        mapped_data["overall_condition_rating"] = create_attribute_input(raw_data.get("Condition_Rating", raw_data.get("condition")), verified=False, source="Raw_Input")
        mapped_data["photo_ai_score"] = create_attribute_input(raw_data.get("Photo_AI_Score", raw_data.get("photo_score")), verified=True, source="AI_Photo")
        
        # Video Analysis (if present in raw data)
        if raw_data.get("Video_Condition_Score") is not None or raw_data.get("Video_URL"):
            mapped_data["valuation_video"] = {
                "file_url": raw_data.get("Video_URL", "N/A"),
                "duration_seconds": raw_data.get("Video_Duration_Seconds"),
                "uploaded_at": raw_data.get("Video_Upload_Time", datetime.now().isoformat()),
                "verified": True,
                "source_origin": "Raw_Input_Video",
                "ai_condition_score": raw_data.get("Video_Condition_Score")
            }

        # History & Title
        # Convert simple strings to list for accident_history if needed
        accident_history_raw = raw_data.get("Accident_History", raw_data.get("accidents", "None"))
        mapped_data["accident_history"] = create_attribute_input(
            [] if accident_history_raw.lower() == "none" else [accident_history_raw],
            verified=True, source="Raw_Input"
        )
        mapped_data["title_type"] = create_attribute_input(raw_data.get("Title_Type", raw_data.get("title")), verified=True, source="Raw_Input")

        # Warranty
        mapped_data["factory_warranty_remaining_months"] = create_attribute_input(raw_data.get("Factory_Warranty_Months", raw_data.get("warranty_months")), verified=True, source="Raw_Input")

        # Features/Options - simple boolean mapping for common ones
        features_val = {}
        if raw_data.get("Sunroof", "").lower() == "yes":
            features_val["sunroof_moonroof"] = True
        if raw_data.get("Advanced_Safety", "").lower() == "yes":
            features_val["advanced_safety_systems"] = True
        mapped_data["features_options"] = create_attribute_input(features_val, verified=False, source="Raw_Input")

        # Cosmetics
        mapped_data["exterior_color"] = create_attribute_input(raw_data.get("Exterior_Color", raw_data.get("color")), verified=True, source="Raw_Input")

        # Market Confidence
        mapped_data["market_confidence_score"] = create_attribute_input(raw_data.get("Market_Confidence", raw_data.get("confidence_score")), verified=True, source="AIN_Engine_ETL")

        # Add other fields similarly based on your comprehensive schema and raw data sources
        # This mapping needs to be exhaustive for all fields you expect to process.
        # Example for other fields (assuming direct mapping if present)
        for key in ["trim_submodel", "body_style", "drive_type", "engine_size_type", "transmission", "fuel_type", "msrp",
                    "exterior_damage", "interior_wear", "mechanical_issues", "tires_brakes_condition", "cleanliness_odor",
                    "number_of_owners", "service_history_available", "open_recalls", "odometer_accuracy_verified",
                    "registered_state_history", "inspection_sticker_validity", "emissions_smog_readiness",
                    "nearby_inventory_count", "market_saturation_level", "listing_velocity_days", "auction_dealer_density",
                    "installed_modifications", "extra_accessories", "interior_color", "epa_mpg_combined",
                    "local_gas_prices_usd_per_gallon", "time_on_market_days", "buyer_search_volume_index",
                    "seasonal_demand_factor", "ownership_intent", "sales_channel", "export_potential",
                    "extended_warranty_available", "certified_pre_owned", "vehicle_recall_status",
                    "insurance_total_loss_history", "past_listing_price_trends", "owner_demographics_type",
                    "last_service_date", "battery_health_percentage", "vin_decode_level"]:
            if raw_data.get(key) is not None:
                # Special handling for list-like fields if they come as strings
                if key in ["exterior_damage", "interior_wear", "mechanical_issues", "open_recalls", "installed_modifications", "extra_accessories", "registered_state_history"]:
                    value = raw_data[key]
                    if isinstance(value, str):
                        # Simple split by comma, or more complex parsing needed
                        mapped_data[key] = create_attribute_input([s.strip() for s in value.split(',')] if value else [], verified=False, source="Raw_Input")
                    elif isinstance(value, list):
                        mapped_data[key] = create_attribute_input(value, verified=False, source="Raw_Input")
                    else:
                        mapped_data[key] = create_attribute_input([], verified=False, source="Raw_Input")
                elif key == "past_listing_price_trends":
                    # This would require more complex parsing if it's a string,
                    # assuming it's already a list of dicts if present.
                    mapped_data[key] = create_attribute_input(raw_data[key], verified=False, source="Raw_Input")
                else:
                    mapped_data[key] = create_attribute_input(raw_data[key], verified=False, source="Raw_Input")

        return mapped_data

    except Exception as e:
        logger.error(f"Error mapping raw data to comprehensive schema: {e}", exc_info=True)
        return None


def process_raw_vehicle_data(
    source_data: Union[str, List[Dict[str, Any]]]
) -> pd.DataFrame:
    """
    Processes raw vehicle data from a CSV file path or a list of dictionaries.

    This function performs the ETL process:
    1. Extracts data from the specified source.
    2. Transforms each raw record into the comprehensive VehicleDataForValuation structure.
    3. Preprocesses each structured record into a flattened DataFrame row.
    4. Concatenates all processed rows into a single DataFrame.

    Args:
        source_data (Union[str, List[Dict[str, Any]]]):
            - If str: Path to a CSV file containing raw vehicle data.
            - If List[Dict[str, Any]]: A list of dictionaries, where each dict
                                       represents a raw vehicle record.

    Returns:
        pd.DataFrame: A DataFrame with all processed vehicle features,
                      ready for ML model training or inference.
                      Returns an empty DataFrame if no valid data is processed.
    """
    raw_records: List[Dict[str, Any]] = []

    if isinstance(source_data, str):
        # Assume CSV file
        if not os.path.exists(source_data):
            logger.error(f"CSV file not found: {source_data}")
            return pd.DataFrame()
        try:
            raw_records = pd.read_csv(source_data).to_dict(orient='records')
            logger.info(f"Successfully loaded {len(raw_records)} records from CSV: {source_data}")
        except Exception as e:
            logger.error(f"Failed to read CSV file {source_data}: {e}", exc_info=True)
            return pd.DataFrame()
    elif isinstance(source_data, list):
        raw_records = source_data
        logger.info(f"Received {len(raw_records)} records from list input.")
    else:
        logger.error("Invalid source_data type. Must be a CSV file path (str) or a list of dictionaries.")
        return pd.DataFrame()

    processed_dfs: List[pd.DataFrame] = []
    failed_records_count = 0

    for i, raw_record in enumerate(raw_records):
        try:
            # Step 1: Map raw data to the comprehensive Pydantic-like structure
            mapped_record_dict = _map_raw_to_comprehensive_schema(raw_record)
            if mapped_record_dict is None:
                failed_records_count += 1
                logger.warning(f"Skipping record {i} due to mapping failure: {raw_record}")
                continue
            
            # Step 2: Validate against the Pydantic schema (optional, but good for strictness)
            # This ensures the mapped_record_dict truly conforms before preprocessing
            try:
                validated_vehicle_data = VehicleDataForValuation(**mapped_record_dict)
            except ValidationError as ve:
                failed_records_count += 1
                logger.warning(f"Skipping record {i} due to Pydantic validation error: {ve.errors()} for raw data: {raw_record}")
                continue

            # Step 3: Preprocess the validated structured data into a flattened DataFrame
            # preprocess_input expects a dictionary, so we pass .model_dump()
            processed_df_row = preprocess_input(validated_vehicle_data.model_dump(by_alias=True))
            
            if not processed_df_row.empty:
                processed_dfs.append(processed_df_row)
            else:
                failed_records_count += 1
                logger.warning(f"Skipping record {i} as preprocess_input returned an empty DataFrame: {raw_record}")

        except Exception as e:
            failed_records_count += 1
            logger.error(f"Failed to process record {i}: {e} for raw data: {raw_record}", exc_info=True)

    if processed_dfs:
        final_df = pd.concat(processed_dfs, ignore_index=True)
        logger.info(f"Successfully processed {len(final_df)} records. {failed_records_count} records failed.")
        return final_df
    else:
        logger.warning(f"No records were successfully processed. {failed_records_count} records failed.")
        return pd.DataFrame()

if __name__ == "__main__":
    print("--- ETL Module Local Test ---")

    # Example 1: Process data from a list of raw dictionaries
    raw_data_list = [
        {
            "VIN": "ABC12345678901234", "Year": 2020, "Make": "Honda", "Model": "Civic",
            "Mileage": 45000, "ZipCode": 94107, "Condition_Rating": "Excellent",
            "Photo_AI_Score": 85, "Video_Condition_Score": 78, "Video_URL": "http://video.com/honda.mp4",
            "Accident_History": "None", "Title_Type": "Clean",
            "Factory_Warranty_Months": 12, "Sunroof": "Yes", "Advanced_Safety": "Yes",
            "Exterior_Color": "Blue", "Market_Confidence": 90, "Last_Service_Date": "2024-01-15"
        },
        {
            "VIN": "DEF45678901234567", "Year": 2018, "Make": "Toyota", "Model": "Camry",
            "Mileage": 70000, "ZipCode": 90210, "Condition_Rating": "Good",
            "Photo_AI_Score": 60, "Video_Condition_Score": 55, "Video_URL": None, # No video
            "Accident_History": "Minor fender bender", "Title_Type": "Clean",
            "Factory_Warranty_Months": 0, "Sunroof": "No", "Advanced_Safety": "No",
            "Exterior_Color": "White", "Market_Confidence": 75, "Last_Service_Date": "2023-05-20"
        },
        { # Invalid record for testing error handling
            "VIN": "INVALID", "Year": "Two Thousand", "Make": "Nissan", "Model": "Altima",
            "Mileage": 100000, "ZipCode": 12345, "Condition_Rating": "Poor"
            # Missing other required fields for comprehensive schema, plus invalid year type
        }
    ]
    processed_df_list = process_raw_vehicle_data(raw_data_list)
    print("\nProcessed DataFrame from List (first 5 rows):")
    print(processed_df_list.head())
    print(f"Shape: {processed_df_list.shape}")
    print(f"Columns: {processed_df_list.columns.tolist()}")


    # Example 2: Process data from a mock CSV file
    csv_data = """VIN,Year,Make,Model,Mileage,ZipCode,Condition_Rating,Photo_AI_Score,Video_Condition_Score,Video_URL,Accident_History,Title_Type,Factory_Warranty_Months,Sunroof,Advanced_Safety,Exterior_Color,Market_Confidence,Last_Service_Date
GHI78901234567890,2022,Tesla,Model 3,20000,94105,Excellent,95,92,http://video.com/tesla.mp4,None,Clean,36,Yes,Yes,Black,98,2024-07-01
JKL01234567890123,2015,BMW,3 Series,90000,10001,Poor,40,30,,Major,Salvage,0,No,No,Gray,50,2023-01-10
MNO34567890123456,2019,Audi,A4,55000,90210,Good,70,65,http://video.com/audi.mp4,None,Clean,0,Yes,No,Silver,85,2024-04-22
"""
    mock_csv_filename = "mock_vehicles_etl.csv"
    with open(mock_csv_filename, "w") as f:
        f.write(csv_data)
    
    processed_df_csv = process_raw_vehicle_data(mock_csv_filename)
    print(f"\nProcessed DataFrame from CSV ({mock_csv_filename}, first 5 rows):")
    print(processed_df_csv.head())
    print(f"Shape: {processed_df_csv.shape}")
    print(f"Columns: {processed_df_csv.columns.tolist()}")
    
    # Clean up mock CSV
    os.remove(mock_csv_filename)

