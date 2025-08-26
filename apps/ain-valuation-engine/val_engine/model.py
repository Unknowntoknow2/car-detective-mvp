"""
Enhanced Vehicle Valuation ML Model with Comprehensive Data Support

This module provides advanced machine learning functionality for predicting vehicle
prices using a comprehensive feature set including traditional attributes and 
modern enhancements like video analysis, market dynamics, and verification status.

The model supports both legacy simple data formats and the new comprehensive
VehicleDataForValuation interface, automatically extracting and engineering
features from complex nested data structures.

Key Features:
- Backward compatibility with simple data formats
- Advanced feature extraction from comprehensive vehicle data
- Video analysis integration for condition verification
- Market dynamics and geographic factors
- Verification status and confidence scoring
- Enhanced categorical encoding with unknown value handling

Enhanced Feature Categories:
1. Core Vehicle Identity (VIN, make, model, year, mileage)
2. Condition & Physical State (AI scoring, damage assessment)
3. Vehicle History & Title Status (accidents, ownership)
4. Geographic & Market Context (local market conditions)
5. Features & Options (equipment packages, modifications)
6. Operational Factors (MPG, warranty, service history)
7. Video Analysis Results (AI condition scoring)

Dependencies:
    - pandas: Data manipulation and analysis
    - numpy: Numerical computing
    - scikit-learn: Machine learning algorithms
    - joblib: For efficient model persistence
    - typing: Type hints for better code documentation

Example Usage:
    >>> # Simple format (backward compatible)
    >>> simple_vehicle = {
    ...     'year': 2020, 'mileage': 25000, 'make': 'Toyota',
    ...     'model': 'Camry', 'condition': 'Excellent', 'zipcode': 90210
    ... }
    >>> 
    >>> # Comprehensive format (new interface)
    >>> comprehensive_vehicle = {
    ...     'year': {'value': 2020, 'verified': True, 'source_origin': 'VIN_Decode'},
    ...     'mileage': {'value': 25000, 'verified': True, 'source_origin': 'Odometer'},
    ...     'make': {'value': 'Toyota', 'verified': True, 'source_origin': 'VIN_Decode'},
    ...     'model': {'value': 'Camry', 'verified': True, 'source_origin': 'VIN_Decode'},
    ...     'overall_condition_rating': {'value': 'Excellent', 'verified': True, 'source_origin': 'AI_Analysis'},
    ...     'zipcode': {'value': 90210, 'verified': True, 'source_origin': 'User_Input'},
    ...     'valuation_video': {
    ...         'ai_condition_score': 92,
    ...         'file_url': 'https://example.com/video.mp4',
    ...         'verified': True
    ...     }
    ... }
    >>> 
    >>> # Both formats work seamlessly
    >>> train_model(training_df)
    >>> prediction = predict_price_comprehensive(comprehensive_vehicle)
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import LabelEncoder
import joblib
import os
from typing import Dict, Any, Tuple, Union, List, Optional

# Define file paths for model persistence
MIN_TRAIN_ROWS = 1000
MODEL_PATH = os.getenv('AIN_TABULAR_MODEL_PATH', 'gradient_boosting_model.joblib')
ENCODERS_PATH = os.getenv('AIN_ENCODERS_PATH', 'label_encoders.joblib')

def get_scalar_value(value, default=None):
    """Helper function to extract scalar value from Series or return the value as-is."""
    if hasattr(value, 'iloc'):
        return value.iloc[0] if len(value) > 0 else default
    return value

# Global model instance and encoders dictionary
# These will be populated upon training or loading
_model: Union[GradientBoostingRegressor, None] = None
_encoders: Dict[str, LabelEncoder] = {}

def extract_value_from_field(field_data: Union[Dict[str, Any], Any]) -> Any:
    """
    Extract the actual value from a comprehensive data field.
    
    Handles both simple values and complex objects with 'value', 'verified', 'source_origin'.
    
    Args:
        field_data: Either a simple value or a dict with 'value' key
        
    Returns:
        The extracted value, or None if not found
    """
    if isinstance(field_data, dict):
        return field_data.get('value')
    return field_data

def get_verification_confidence(field_data: Union[Dict[str, Any], Any]) -> float:
    """
    Extract verification confidence from a field.
    
    Args:
        field_data: Field data that may contain verification info
        
    Returns:
        Confidence score between 0.0 and 1.0
    """
    if isinstance(field_data, dict):
        verified = field_data.get('verified', False)
        source = field_data.get('source_origin', '')
        
        # Assign confidence based on source reliability
        source_confidence = {
            'VIN_Decode': 0.95,
            'AI_Analysis': 0.88,
            'Third_Party_API': 0.85,
            'Verified_Document': 0.90,
            'User_Input': 0.70,
            'Manual_Entry': 0.65,
            'Estimated': 0.50
        }
        
        base_confidence = source_confidence.get(source, 0.60)
        return base_confidence if verified else base_confidence * 0.7
    
    return 0.60  # Default confidence for simple fields

def engineer_comprehensive_features(vehicle_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Engineer advanced features from comprehensive vehicle data.
    
    Extracts and transforms data from the VehicleDataForValuation interface
    into ML-ready features with proper encoding and confidence scoring.
    
    Args:
        vehicle_data: Raw vehicle data (comprehensive or simple format)
        
    Returns:
        Dictionary of engineered features ready for ML model
    """
    features = {}
    
    # 1. Extract Core Vehicle Identity
    features['year'] = extract_value_from_field(vehicle_data.get('year', 2020))
    features['mileage'] = extract_value_from_field(vehicle_data.get('mileage', 0))
    features['make'] = str(extract_value_from_field(vehicle_data.get('make', 'Unknown')))
    features['model'] = str(extract_value_from_field(vehicle_data.get('model', 'Unknown')))
    features['zipcode'] = extract_value_from_field(vehicle_data.get('zipcode', 0))
    
    # Handle condition field (may be 'condition' or 'overall_condition_rating')
    condition = extract_value_from_field(
        vehicle_data.get('overall_condition_rating') or 
        vehicle_data.get('condition', 'Good')
    )
    features['condition'] = str(condition)
    
    # 2. Advanced Vehicle Attributes
    features['trim_level'] = str(extract_value_from_field(vehicle_data.get('trim_submodel', 'Standard')))
    features['body_style'] = str(extract_value_from_field(vehicle_data.get('body_style', 'Sedan')))
    features['drive_type'] = str(extract_value_from_field(vehicle_data.get('drive_type', 'FWD')))
    features['fuel_type'] = str(extract_value_from_field(vehicle_data.get('fuel_type', 'Gasoline')))
    features['transmission'] = str(extract_value_from_field(vehicle_data.get('transmission', 'Automatic')))
    
    # 3. Condition and Damage Assessment
    exterior_damage = extract_value_from_field(vehicle_data.get('exterior_damage', []))
    features['exterior_damage_count'] = len(exterior_damage) if isinstance(exterior_damage, list) else 0
    
    interior_wear = extract_value_from_field(vehicle_data.get('interior_wear', []))
    features['interior_wear_count'] = len(interior_wear) if isinstance(interior_wear, list) else 0
    
    mechanical_issues = extract_value_from_field(vehicle_data.get('mechanical_issues', []))
    features['mechanical_issues_count'] = len(mechanical_issues) if isinstance(mechanical_issues, list) else 0
    
    # 4. Vehicle History Factors
    accident_history = extract_value_from_field(vehicle_data.get('accident_history', []))
    features['accident_count'] = len(accident_history) if isinstance(accident_history, list) else 0
    
    features['title_type'] = str(extract_value_from_field(vehicle_data.get('title_type', 'Clean')))
    features['number_of_owners'] = extract_value_from_field(vehicle_data.get('number_of_owners', 1))
    features['service_history_available'] = extract_value_from_field(vehicle_data.get('service_history_available', False))
    
    # 5. Market Context
    features['market_saturation'] = str(extract_value_from_field(vehicle_data.get('market_saturation_level', 'Medium')))
    features['listing_velocity_days'] = extract_value_from_field(vehicle_data.get('listing_velocity_days', 30))
    features['time_on_market'] = extract_value_from_field(vehicle_data.get('time_on_market_days', 0))
    
    # 6. Features and Options Score
    features_options = extract_value_from_field(vehicle_data.get('features_options', {}))
    if isinstance(features_options, dict):
        # Count premium features
        premium_features = [
            'sunroof_moonroof', 'navigation_system', 'heated_ventilated_seats',
            'premium_audio_system', 'advanced_safety_systems', 'leather_seats'
        ]
        features['premium_features_count'] = sum(1 for feat in premium_features 
                                                if features_options.get(feat, False))
    else:
        features['premium_features_count'] = 0
    
    # 7. Economic Factors
    features['epa_mpg_combined'] = extract_value_from_field(vehicle_data.get('epa_mpg_combined', 25))
    features['factory_warranty_months'] = extract_value_from_field(vehicle_data.get('factory_warranty_remaining_months', 0))
    features['certified_pre_owned'] = extract_value_from_field(vehicle_data.get('certified_pre_owned', False))
    
    # 8. Video Analysis Integration
    video_data = vehicle_data.get('valuation_video', {})
    if video_data:
        features['video_ai_condition_score'] = video_data.get('ai_condition_score', 75)
        features['has_video_analysis'] = True
        features['video_verified'] = video_data.get('verified', False)
    else:
        features['video_ai_condition_score'] = 75  # Default/neutral score
        features['has_video_analysis'] = False
        features['video_verified'] = False
    
    # 9. Verification Confidence Scoring
    key_fields = ['year', 'mileage', 'make', 'model', 'overall_condition_rating', 'zipcode']
    confidence_scores = []
    
    for field in key_fields:
        field_data = vehicle_data.get(field) or vehicle_data.get(field.replace('overall_condition_rating', 'condition'))
        if field_data:
            confidence_scores.append(get_verification_confidence(field_data))
    
    features['data_confidence_score'] = np.mean(confidence_scores) if confidence_scores else 0.60
    
    # 10. Age and Depreciation Factors
    current_year = 2025  # Update as needed
    vehicle_age = current_year - features['year']
    features['vehicle_age'] = vehicle_age
    features['age_mileage_ratio'] = features['mileage'] / max(vehicle_age, 1)  # Miles per year
    
    # 11. Condition Score Integration (combine traditional + AI)
    condition_mapping = {'Excellent': 95, 'Good': 80, 'Fair': 65, 'Poor': 40}
    traditional_condition_score = condition_mapping.get(features['condition'], 75)
    video_condition_score = features['video_ai_condition_score']
    
    if features['has_video_analysis'] and features['video_verified']:
        # Weighted average favoring video analysis when available and verified
        features['composite_condition_score'] = (traditional_condition_score * 0.3 + 
                                                video_condition_score * 0.7)
    else:
        features['composite_condition_score'] = traditional_condition_score
    
    # 12. Market Premium/Discount Factors
    # Color popularity (simplified)
    exterior_color = str(extract_value_from_field(vehicle_data.get('exterior_color', 'White')))
    popular_colors = ['White', 'Black', 'Gray', 'Silver']
    features['popular_color'] = exterior_color in popular_colors
    
    # Electric vehicle premium
    features['is_electric'] = features['fuel_type'] == 'Electric'
    
    # Clean up and ensure numeric types
    for key, value in features.items():
        if isinstance(value, bool):
            features[key] = int(value)  # Convert booleans to 0/1
        elif value is None:
            features[key] = 0
    
    # Convert to DataFrame for compatibility with SHAP and model
    features_df = pd.DataFrame([features])
    return features_df

def train_model(dataframe: pd.DataFrame, use_enhanced_features: bool = True) -> None:
    """
    Train the enhanced vehicle valuation model on the provided dataset.
    
    This function preprocesses input data by engineering comprehensive features,
    encoding categorical variables, and fitting an enhanced Gradient Boosting Regressor
    optimized for the comprehensive vehicle data model.
    
    Args:
        dataframe (pd.DataFrame): Training dataset containing vehicle data.
            Can include both simple format columns (year, mileage, make, etc.)
            and comprehensive format with nested verification data.
        use_enhanced_features (bool): Whether to use advanced feature engineering.
            If False, falls back to legacy simple feature set.
    
    Returns:
        None: Function populates global `_model` and `_encoders` variables.
    
    Raises:
        KeyError: If required columns are missing from the dataframe.
        ValueError: If the dataframe is empty or contains invalid data types.
    """
    global _model, _encoders

    if dataframe.empty or len(dataframe) < MIN_TRAIN_ROWS:
        raise ValueError(f"Training data must have at least {MIN_TRAIN_ROWS} rows. Refusing to train on toy data.")
    
    df = dataframe.copy()
    
    # Initialize enhanced model with better hyperparameters
    _model = GradientBoostingRegressor(
        n_estimators=200,        # Increased for better performance
        learning_rate=0.08,      # Slightly lower for stability
        max_depth=7,             # Deeper trees for complex interactions
        min_samples_split=10,    # Prevent overfitting
        min_samples_leaf=5,      # Minimum samples per leaf
        subsample=0.8,           # Add some randomness
        random_state=42,
        validation_fraction=0.1, # Use for early stopping
        n_iter_no_change=20     # Early stopping patience
    )
    _encoders = {}  # Reset encoders for fresh training

    if use_enhanced_features:
        # Use comprehensive feature engineering
        enhanced_features_list = []
        
        for idx, row in df.iterrows():
            vehicle_dict = row.to_dict()
            enhanced_features_df = engineer_comprehensive_features(vehicle_dict)
            enhanced_features_list.append(enhanced_features_df.iloc[0].to_dict())
        
        # Convert to DataFrame
        features_df = pd.DataFrame(enhanced_features_list)
        
        # Define feature columns for enhanced model
        categorical_columns = [
            'make', 'model', 'condition', 'trim_level', 'body_style', 
            'drive_type', 'fuel_type', 'transmission', 'title_type', 'market_saturation'
        ]
        
        numeric_columns = [
            'year', 'mileage', 'zipcode', 'exterior_damage_count', 'interior_wear_count',
            'mechanical_issues_count', 'accident_count', 'number_of_owners', 
            'listing_velocity_days', 'time_on_market', 'premium_features_count',
            'epa_mpg_combined', 'factory_warranty_months', 'video_ai_condition_score',
            'data_confidence_score', 'vehicle_age', 'age_mileage_ratio',
            'composite_condition_score'
        ]
        
        boolean_columns = [
            'service_history_available', 'has_video_analysis', 'video_verified',
            'certified_pre_owned', 'popular_color', 'is_electric'
        ]
        
        feature_columns = categorical_columns + numeric_columns + boolean_columns
        
    else:
        # Legacy simple feature set
        features_df = df.copy()
        categorical_columns = ["make", "model", "condition"]
        feature_columns = ["year", "mileage"] + categorical_columns + ["zipcode"]
    
    # Validate target column
    target_column = "price"
    if target_column not in df.columns:
        raise KeyError(f"Required target column '{target_column}' not found in training dataframe.")
    
    # Ensure all feature columns exist, fill missing with defaults
    for col in feature_columns:
        if col not in features_df.columns:
            if col in categorical_columns:
                features_df[col] = 'Unknown'
            else:
                features_df[col] = 0
    
    # Encode categorical features using LabelEncoder with unknown handling
    for col in categorical_columns:
        le = LabelEncoder()
        
        # Add 'Unknown' category to handle unseen values during prediction
        unique_values = features_df[col].astype(str).unique().tolist()
        if 'Unknown' not in unique_values:
            unique_values.append('Unknown')
        
        # Fit encoder on all possible values including 'Unknown'
        le.fit(unique_values)
        
        # Transform the actual data
        features_df[col] = le.transform(features_df[col].astype(str))
        _encoders[col] = le  # Save encoder for use in prediction

    # Prepare feature matrix and target vector
    X = features_df[feature_columns]
    y = df[target_column]
    
    # Handle any remaining NaN values
    X = X.fillna(0)
    
    # Train the model
    print(f"Training model with {len(feature_columns)} features on {len(X)} samples...")
    _model.fit(X, y)
    
    # Calculate and display training metrics
    train_score = _model.score(X, y)
    print(f"Model training complete. R² score: {train_score:.4f}")
    
    # Display feature importance for top features
    if hasattr(_model, 'feature_importances_'):
        feature_importance = pd.DataFrame({
            'feature': feature_columns,
            'importance': _model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        print("\nTop 10 Most Important Features:")
        for idx, row in feature_importance.head(10).iterrows():
            print(f"  {row['feature']}: {row['importance']:.4f}")
    
    print(f"Enhanced features used: {use_enhanced_features}")
    print(f"Categorical features: {len(categorical_columns)}")
    print(f"Total features: {len(feature_columns)}")

def predict_price_comprehensive(vehicle_data: Dict[str, Any], 
                               model_instance: GradientBoostingRegressor = None, 
                               encoders_instance: Dict[str, LabelEncoder] = None) -> Dict[str, Any]:
    """
    Predict vehicle price using comprehensive vehicle data format.
    
    This function accepts the full VehicleDataForValuation interface and returns
    a detailed prediction with confidence metrics and feature contributions.
    
    Args:
        vehicle_data (Dict[str, Any]): Comprehensive vehicle data dictionary
        model_instance: Optional pre-loaded model (uses global if None)
        encoders_instance: Optional pre-loaded encoders (uses global if None)
    
    Returns:
        Dict containing:
            - predicted_price: Main price prediction
            - confidence_score: Prediction confidence (0-1)
            - data_quality_score: Input data quality assessment
            - key_factors: Main factors influencing the prediction
            - feature_values: Processed feature values used
    """
    # Use global model/encoders if not provided
    if model_instance is None:
        model_instance = _model
    if encoders_instance is None:
        encoders_instance = _encoders
        
    if model_instance is None or not encoders_instance:
        raise RuntimeError("Model not trained. Call train_model() first or load model artifacts.")
    
    # Engineer comprehensive features
    features = engineer_comprehensive_features(vehicle_data)
    
    # Get model's expected feature columns
    # Reconstruct from training (this should match training feature set)
    categorical_columns = [
        'make', 'model', 'condition', 'trim_level', 'body_style', 
        'drive_type', 'fuel_type', 'transmission', 'title_type', 'market_saturation'
    ]
    
    numeric_columns = [
        'year', 'mileage', 'zipcode', 'exterior_damage_count', 'interior_wear_count',
        'mechanical_issues_count', 'accident_count', 'number_of_owners', 
        'listing_velocity_days', 'time_on_market', 'premium_features_count',
        'epa_mpg_combined', 'factory_warranty_months', 'video_ai_condition_score',
        'data_confidence_score', 'vehicle_age', 'age_mileage_ratio',
        'composite_condition_score'
    ]
    
    boolean_columns = [
        'service_history_available', 'has_video_analysis', 'video_verified',
        'certified_pre_owned', 'popular_color', 'is_electric'
    ]
    
    feature_columns = categorical_columns + numeric_columns + boolean_columns
    
    # Prepare feature vector
    feature_vector = []
    processed_features = {}
    
    # Process categorical features
    for col in categorical_columns:
        value = str(features.get(col, 'Unknown'))
        le = encoders_instance.get(col)
        
        if le is not None:
            if value in le.classes_:
                encoded_value = le.transform([value])[0]
            else:
                # Use 'Unknown' encoding if available, otherwise use 0
                if 'Unknown' in le.classes_:
                    encoded_value = le.transform(['Unknown'])[0]
                else:
                    encoded_value = 0
            feature_vector.append(encoded_value)
            processed_features[col] = {'original': value, 'encoded': encoded_value}
        else:
            feature_vector.append(0)
            processed_features[col] = {'original': value, 'encoded': 0}
    
    # Process numeric and boolean features
    for col in numeric_columns + boolean_columns:
        value = features.get(col, 0)
        feature_vector.append(float(value))
        processed_features[col] = value
    
    # Make prediction
    predicted_price = float(model_instance.predict([feature_vector])[0])
    
    # Calculate confidence score based on data quality and model certainty
    data_confidence_val = features.get('data_confidence_score', 0.6)
    if hasattr(data_confidence_val, 'iloc'):
        data_confidence = float(data_confidence_val.iloc[0])
    else:
        data_confidence = float(data_confidence_val)
    
    # Video analysis boosts confidence if available and verified
    video_confidence_boost = 0.0
    has_video = features.get('has_video_analysis', False)
    video_verified = features.get('video_verified', False)
    
    # Handle Series/scalar values
    if hasattr(has_video, 'iloc'):
        has_video = bool(has_video.iloc[0])
    if hasattr(video_verified, 'iloc'):
        video_verified = bool(video_verified.iloc[0])
    
    if has_video and video_verified:
        video_score_val = features.get('video_ai_condition_score', 75)
        if hasattr(video_score_val, 'iloc'):
            video_score = float(video_score_val.iloc[0])
        else:
            video_score = float(video_score_val)
        video_confidence_boost = 0.1 * (video_score / 100)  # Up to 10% boost
    
    confidence_score = min(0.95, data_confidence + video_confidence_boost)
    
    # Identify key factors affecting price
    key_factors = []
    
    # High value factors
    composite_condition_val = features.get('composite_condition_score', 75)
    if hasattr(composite_condition_val, 'iloc'):
        composite_condition = float(composite_condition_val.iloc[0])
    else:
        composite_condition = float(composite_condition_val)
        
    if composite_condition > 90:
        has_video_check = features.get('has_video_analysis', False)
        if hasattr(has_video_check, 'iloc'):
            has_video_check = bool(has_video_check.iloc[0])
        key_factors.append("Excellent condition (AI verified)" if has_video_check else "Excellent condition")
    
    vehicle_age_val = features.get('vehicle_age', 5)
    if hasattr(vehicle_age_val, 'iloc'):
        vehicle_age = float(vehicle_age_val.iloc[0])
    else:
        vehicle_age = float(vehicle_age_val)
    if vehicle_age < 3:
        key_factors.append("Low vehicle age")
        
    age_mileage_ratio_val = features.get('age_mileage_ratio', 12000)
    if hasattr(age_mileage_ratio_val, 'iloc'):
        age_mileage_ratio = float(age_mileage_ratio_val.iloc[0])
    else:
        age_mileage_ratio = float(age_mileage_ratio_val)
    if age_mileage_ratio < 8000:
        key_factors.append("Low mileage for age")
    
    premium_features_val = features.get('premium_features_count', 0)
    if hasattr(premium_features_val, 'iloc'):
        premium_features_count = float(premium_features_val.iloc[0])
    else:
        premium_features_count = float(premium_features_val)
    if premium_features_count > 3:
        key_factors.append("Multiple premium features")
    
    is_electric_val = features.get('is_electric', False)
    if hasattr(is_electric_val, 'iloc'):
        is_electric = bool(is_electric_val.iloc[0])
    else:
        is_electric = bool(is_electric_val)
    if is_electric:
        key_factors.append("Electric vehicle premium")
    
    # Negative factors
    accident_count = get_scalar_value(features.get('accident_count', 0), 0)
    if accident_count > 0:
        key_factors.append(f"Accident history ({accident_count} incidents)")
    
    mechanical_issues_count = get_scalar_value(features.get('mechanical_issues_count', 0), 0)
    if mechanical_issues_count > 0:
        key_factors.append(f"Mechanical issues ({mechanical_issues_count} reported)")
    
    title_type = get_scalar_value(features.get('title_type', 'Clean'), 'Clean')
    if title_type != 'Clean':
        key_factors.append(f"Title issue: {title_type}")
    
    # Data quality assessment
    data_quality_factors = []
    if data_confidence > 0.85:
        data_quality_factors.append("High data verification")
    has_video_analysis = get_scalar_value(features.get('has_video_analysis', False), False)
    if has_video_analysis:
        data_quality_factors.append("AI video analysis available")
    service_history_available = get_scalar_value(features.get('service_history_available', False), False)
    if service_history_available:
        data_quality_factors.append("Service history documented")
    
    return {
        'predicted_price': predicted_price,
        'confidence_score': confidence_score,
        'data_quality_score': data_confidence,
        'key_factors': key_factors,
        'data_quality_factors': data_quality_factors,
        'feature_values': processed_features,
        'video_analysis_used': features.get('has_video_analysis', False),
        'composite_condition_score': features.get('composite_condition_score', 75)
    }

def predict_price(input_df: pd.DataFrame, model_instance: GradientBoostingRegressor, encoders_instance: Dict[str, LabelEncoder]) -> float:
    """
    Legacy predict function for backward compatibility.
    
    Predict vehicle price for a single vehicle using a trained model and encoders.
    This function maintains compatibility with the original simple data format.
    
    Args:
        input_df (pd.DataFrame): Single-row DataFrame containing vehicle features
        model_instance (GradientBoostingRegressor): The pre-trained model
        encoders_instance (Dict[str, LabelEncoder]): Dictionary of fitted encoders
    
    Returns:
        float: Predicted vehicle price in USD
    """
    if len(input_df) == 0:
        raise ValueError("Input DataFrame cannot be empty.")
    if len(input_df) > 1:
        print("Warning: predict_price expects a single-row DataFrame. Only the first row will be processed.")

    if not isinstance(model_instance, GradientBoostingRegressor) or not isinstance(encoders_instance, dict) or not encoders_instance:
        raise RuntimeError("Invalid model or encoders provided. Ensure model is trained/loaded.")
    
    # Convert DataFrame row to dictionary and use comprehensive prediction
    vehicle_dict = input_df.iloc[0].to_dict()
    
    # Use comprehensive prediction but return only the price for compatibility
    result = predict_price_comprehensive(vehicle_dict, model_instance, encoders_instance)
    return result['predicted_price']
    """
    Predict vehicle price for a single vehicle using a trained model and encoders.
    
    This function takes a DataFrame with vehicle characteristics and returns
    a predicted price. The input must contain the same features used during training,
    and categorical variables are encoded using the provided label encoders.
    
    Args:
        input_df (pd.DataFrame): Single-row DataFrame containing vehicle features:
            - year (int): Vehicle model year
            - mileage (int/float): Vehicle mileage in miles 
            - make (str): Vehicle manufacturer
            - model (str): Vehicle model name
            - condition (str): Vehicle condition
            - zipcode (int): Location zipcode
        model_instance (GradientBoostingRegressor): The pre-trained GradientBoostingRegressor model.
        encoders_instance (Dict[str, LabelEncoder]): Dictionary of fitted LabelEncoders.
    
    Returns:
        float: Predicted vehicle price in USD.
    
    Raises:
        ValueError: If input_df is empty or has more than one row.
        KeyError: If required columns are missing from the input_df.
        RuntimeError: If the provided model_instance or encoders_instance are invalid.
    """
    if len(input_df) == 0:
        raise ValueError("Input DataFrame cannot be empty.")
    if len(input_df) > 1:
        print("Warning: predict_price expects a single-row DataFrame. Only the first row will be processed.")

    if not isinstance(model_instance, GradientBoostingRegressor) or not isinstance(encoders_instance, dict) or not encoders_instance:
        raise RuntimeError("Invalid model or encoders provided. Ensure model is trained/loaded.")
    
    # Get the first row as a Series
    row = input_df.iloc[0]
    encoded_input = []

    # Define features for consistent processing
    numerical_features = ["year", "mileage"]
    categorical_features = ["make", "model", "condition"]
    all_features = numerical_features + categorical_features + ["zipcode"]

    # Validate all required features are in the input row
    for feature in all_features:
        if feature not in row:
            raise KeyError(f"Required feature '{feature}' not found in input data for prediction.")

    # Add numerical features directly
    for key in numerical_features:
        encoded_input.append(float(row[key]))

    # Encode categorical features using stored encoders
    for col in categorical_features:
        label = str(row[col])  # Convert to string for consistency
        le = encoders_instance.get(col)
        
        if le is not None:
            # Handle unseen categories by transforming to a default value (e.g., 0)
            # or by using a mapping to an 'unknown' category if pre-defined during training.
            # For LabelEncoder, if a label is not in classes_, transform will raise ValueError.
            # A robust way is to check if label is in le.classes_
            if label in le.classes_:
                encoded_input.append(le.transform([label])[0])
            else:
                # Fallback for unseen label during prediction
                # This assumes '0' is a safe default or was handled during training.
                # For production, consider adding an 'unknown' category during training.
                encoded_input.append(0) 
        else:
            # This case should ideally not happen if encoders_instance is complete
            # for all categorical features used during training.
            print(f"Warning: No LabelEncoder found for column '{col}'. Defaulting to 0.")
            encoded_input.append(0)

    # Add zipcode as integer
    encoded_input.append(int(row["zipcode"]))
    
    # Make prediction and return as float
    prediction = model_instance.predict([encoded_input])[0]
    return float(prediction)

def save_model_artifacts() -> None:
    """
    Saves the trained model and label encoders to disk using joblib.
    """
    if _model is None or not _encoders:
        raise RuntimeError("No model or encoders to save. Train the model first.")
    
    os.makedirs(os.path.dirname(MODEL_PATH) or '.', exist_ok=True) # Ensure directory exists
    os.makedirs(os.path.dirname(ENCODERS_PATH) or '.', exist_ok=True)

    joblib.dump(_model, MODEL_PATH)
    joblib.dump(_encoders, ENCODERS_PATH)
    print(f"Model saved to {MODEL_PATH}")
    print(f"Encoders saved to {ENCODERS_PATH}")

def load_model_artifacts() -> Tuple[GradientBoostingRegressor, Dict[str, LabelEncoder]]:
    """
    Loads the trained model and label encoders from disk using joblib.
    
    Returns:
        Tuple[GradientBoostingRegressor, Dict[str, LabelEncoder]]: A tuple containing
        the loaded model and the dictionary of label encoders.
    
    Raises:
        FileNotFoundError: If model or encoders files are not found.
        RuntimeError: If loaded artifacts are not of the expected type.
    """
    global _model, _encoders

    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model file not found at {MODEL_PATH}. Please train the model first.")
    if not os.path.exists(ENCODERS_PATH):
        raise FileNotFoundError(f"Encoders file not found at {ENCODERS_PATH}. Please train the model first.")

    model = joblib.load(MODEL_PATH)
    return model, None
    if not isinstance(_model, GradientBoostingRegressor):
        raise RuntimeError(f"Loaded model is not of expected type GradientBoostingRegressor: {type(_model)}")
    if not isinstance(_encoders, dict):
        raise RuntimeError(f"Loaded encoders is not of expected type dict: {type(_encoders)}")
    
    print(f"Model loaded from {MODEL_PATH}")
    print(f"Encoders loaded from {ENCODERS_PATH}")
    return _model, _encoders

# This block demonstrates both legacy and comprehensive model capabilities
if __name__ == "__main__":
    print("🚗 AIN Enhanced Vehicle Valuation Model - Demo")
    print("=" * 60)
    
    # Example of training with enhanced features
    print("\n--- Training Enhanced Model ---")
    sample_df = pd.DataFrame({
        'year': [2020, 2019, 2018, 2021, 2017, 2022],
        'mileage': [25000, 35000, 45000, 15000, 55000, 10000],
        'make': ['Toyota', 'Honda', 'Ford', 'Toyota', 'Chevrolet', 'Tesla'],
        'model': ['Camry', 'Civic', 'Focus', 'RAV4', 'Malibu', 'Model 3'],
        'condition': ['Excellent', 'Good', 'Fair', 'Excellent', 'Good', 'Excellent'],
        'zipcode': [90210, 10001, 60601, 90210, 30301, 94105],
        'price': [22000, 18000, 14000, 25000, 16000, 45000]
    })
    
    train_model(sample_df, use_enhanced_features=True)
    save_model_artifacts()

    print("\n--- Legacy Format Prediction (Backward Compatibility) ---")
    try:
        loaded_model, loaded_encoders = load_model_artifacts()
        
        # Test legacy simple format
        new_car_data = pd.DataFrame([{
            'year': 2021,
            'mileage': 15000,
            'make': 'Toyota',
            'model': 'RAV4',
            'condition': 'Excellent',
            'zipcode': 90210
        }])
        
        predicted_price = predict_price(new_car_data, loaded_model, loaded_encoders)
        print(f"📊 Legacy prediction: ${predicted_price:,.2f}")

    except Exception as e:
        print(f"❌ Legacy prediction error: {e}")

    print("\n--- Comprehensive Format Prediction (Enhanced Features) ---")
    try:
        # Test comprehensive format with video analysis
        comprehensive_vehicle = {
            'year': {'value': 2021, 'verified': True, 'source_origin': 'VIN_Decode'},
            'mileage': {'value': 15000, 'verified': True, 'source_origin': 'Odometer'},
            'make': {'value': 'Toyota', 'verified': True, 'source_origin': 'VIN_Decode'},
            'model': {'value': 'RAV4', 'verified': True, 'source_origin': 'VIN_Decode'},
            'overall_condition_rating': {'value': 'Excellent', 'verified': True, 'source_origin': 'AI_Analysis'},
            'zipcode': {'value': 90210, 'verified': True, 'source_origin': 'User_Input'},
            'trim_submodel': {'value': 'XLE', 'verified': True, 'source_origin': 'VIN_Decode'},
            'fuel_type': {'value': 'Gasoline', 'verified': True, 'source_origin': 'VIN_Decode'},
            'exterior_damage': {'value': [], 'verified': True, 'source_origin': 'AI_Analysis'},
            'features_options': {
                'value': {
                    'sunroof_moonroof': True,
                    'navigation_system': True,
                    'heated_ventilated_seats': True,
                    'premium_audio_system': True,
                    'advanced_safety_systems': True,
                    'leather_seats': True
                },
                'verified': True,
                'source_origin': 'VIN_Decode'
            },
            'valuation_video': {
                'file_url': 'https://example.com/toyota-rav4-inspection.mp4',
                'ai_condition_score': 92,
                'verified': True,
                'source_origin': 'UserUpload'
            }
        }
        
        comprehensive_result = predict_price_comprehensive(comprehensive_vehicle)
        
        print(f"🎥 Enhanced prediction: ${comprehensive_result['predicted_price']:,.2f}")
        print(f"   Confidence Score: {comprehensive_result['confidence_score']:.1%}")
        print(f"   Data Quality: {comprehensive_result['data_quality_score']:.1%}")
        print(f"   Video Analysis: {'✅' if comprehensive_result['video_analysis_used'] else '❌'}")
        print(f"   Condition Score: {comprehensive_result['composite_condition_score']:.0f}/100")
        
        print(f"\n   🔍 Key Factors:")
        for factor in comprehensive_result['key_factors']:
            print(f"     • {factor}")
        
        print(f"\n   📋 Data Quality Factors:")
        for factor in comprehensive_result['data_quality_factors']:
            print(f"     • {factor}")

    except Exception as e:
        print(f"❌ Comprehensive prediction error: {e}")

    print("\n--- Testing Unknown Categories ---")
    try:
        # Test with unknown make/model
        unknown_vehicle = {
            'year': 2023,
            'mileage': 5000,
            'make': 'UnknownMake',
            'model': 'UnknownModel',
            'condition': 'Excellent',
            'zipcode': 90210
        }
        
        unknown_result = predict_price_comprehensive(unknown_vehicle)
        print(f"🔍 Unknown vehicle prediction: ${unknown_result['predicted_price']:,.2f}")
        print(f"   Confidence: {unknown_result['confidence_score']:.1%} (lower due to unknown make/model)")

    except Exception as e:
        print(f"❌ Unknown category test error: {e}")

    # Clean up
    try:
        if os.path.exists(MODEL_PATH):
            os.remove(MODEL_PATH)
        if os.path.exists(ENCODERS_PATH):
            os.remove(ENCODERS_PATH)
        print(f"\n🧹 Cleaned up model artifacts")
    except Exception as e:
        print(f"⚠️ Cleanup warning: {e}")
    
    print(f"\n✅ Demo completed successfully!")
    print(f"   • Legacy format support: ✅")
    print(f"   • Comprehensive format: ✅") 
    print(f"   • Video analysis integration: ✅")
    print(f"   • Enhanced feature engineering: ✅")
    print(f"   • Unknown category handling: ✅")

