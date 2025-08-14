"""
Enhanced SHAP Explainer for Comprehensive Vehicle Valuation Model

This module provides model explainability functionality using SHAP values to understand
how different features contribute to individual price predictions. Enhanced to support
the comprehensive VehicleDataForValuation schema with nested verification data.

SHAP values provide a unified framework for interpreting model predictions by:
- Quantifying the contribution of each feature to a prediction
- Providing both positive and negative feature impacts
- Ensuring contributions sum to the difference between prediction and expected value
- Supporting both legacy simple format and comprehensive nested format

Enhanced Features:
- Comprehensive data format support (JSON Schema compliant)
- Verification status integration in explanations
- Advanced feature importance analysis
- Data quality impact on explanation confidence
- Video analysis feature contributions

Dependencies:
    - shap: Model explainability library
    - model: Enhanced model module with comprehensive feature engineering

Example:
    >>> from model import train_model
    >>> from shap_explainer import set_explainer, explain_prediction_comprehensive
    >>> 
    >>> # After training enhanced model
    >>> train_model(training_data, use_enhanced_features=True)
    >>> set_explainer(model)
    >>> 
    >>> # Explain comprehensive format prediction
    >>> comprehensive_vehicle = {
    ...     'year': {'value': 2020, 'verified': True, 'source_origin': 'VIN_Decode'},
    ...     'make': {'value': 'Toyota', 'verified': True, 'source_origin': 'VIN_Decode'},
    ...     'model': {'value': 'Camry', 'verified': True, 'source_origin': 'VIN_Decode'},
    ...     'overall_condition_rating': {'value': 'Good', 'verified': True, 'source_origin': 'AI_Analysis'},
    ...     'zipcode': {'value': 90210, 'verified': True, 'source_origin': 'User_Input'}
    ... }
    >>> explanation = explain_prediction_comprehensive(comprehensive_vehicle)
    >>> print("Feature contributions with confidence:", explanation)
"""

import shap
import pandas as pd
import numpy as np
from typing import Optional, Any, Dict, Union, List, Tuple
from .model import _encoders, _model, extract_value_from_field, engineer_comprehensive_features

# Global SHAP explainer instance
explainer: Optional[shap.TreeExplainer] = None

def set_explainer(trained_model: Any) -> None:
    """
    Initialize the SHAP TreeExplainer with a trained model.
    
    This function must be called after model training to enable prediction
    explanations. It creates a TreeExplainer specifically designed for
    tree-based models like GradientBoostingRegressor.
    
    Args:
        trained_model: A trained scikit-learn tree-based model 
                      (e.g., GradientBoostingRegressor, RandomForestRegressor)
    
    Returns:
        None: Sets the global explainer variable
    
    Raises:
        ValueError: If the model is not compatible with TreeExplainer
        AttributeError: If the model hasn't been fitted
    
    Example:
        >>> from sklearn.ensemble import GradientBoostingRegressor
        >>> from model import train_model
        >>> 
        >>> # After training your model
        >>> train_model(data)
        >>> set_explainer(model)
        >>> print("SHAP explainer initialized successfully")
    
    Note:
        - Should be called once after model training
        - TreeExplainer is optimized for tree-based models
        - The explainer will be used for all subsequent explanation requests
    """
    global explainer
    
    if not hasattr(trained_model, 'predict'):
        raise AttributeError("Model must be fitted before setting explainer")
    
    try:
        explainer = shap.TreeExplainer(trained_model)
    except Exception as e:
        raise ValueError(f"Failed to create TreeExplainer: {e}")

def encode_input(input_df: pd.DataFrame) -> pd.DataFrame:
    """
    Encode categorical variables in input DataFrame using stored label encoders.
    
    This function applies the same categorical encoding transformations used
    during model training to ensure consistency between training and explanation.
    Unknown categories are mapped to 0 (fallback encoding).
    
    Args:
        input_df (pd.DataFrame): Raw input DataFrame with categorical features
                                Contains: make, model, condition (as strings)
    
    Returns:
        pd.DataFrame: DataFrame with categorical features encoded as integers
    
    Raises:
        KeyError: If required categorical columns are missing
        RuntimeError: If encoders haven't been initialized (model not trained)
    
    Example:
        >>> raw_data = pd.DataFrame({
        ...     'year': [2020], 'mileage': [30000],
        ...     'make': ['Toyota'], 'model': ['Camry'], 
        ...     'condition': ['Good'], 'zipcode': [90210]
        ... })
        >>> encoded_data = encode_input(raw_data)
        >>> print("Encoded features:", encoded_data)
    
    Note:
        - Uses the same encoders from model training for consistency
        - Unknown categorical values default to 0
        - Only modifies categorical columns: make, model, condition
    """
    # Check if encoders are available
    if not _encoders or len(_encoders) == 0:
        raise ValueError("Label encoders not available. Train the model first.")
    
    df = input_df.copy()
    categorical_columns = ["make", "model", "condition"]
    
    for col in categorical_columns:
        if col not in df.columns:
            raise KeyError(f"Required column '{col}' not found in input DataFrame")
        
        le = _encoders.get(col)
        if le is not None:
            # Get the value as string for consistency
            value = str(df[col].iloc[0])
            if value in le.classes_:
                df[col] = le.transform([value])
            else:
                # Unknown category - use fallback
                df[col] = 0
        else:
            # No encoder available - use fallback
            df[col] = 0
    
    return df

def explain_prediction_comprehensive(vehicle_data: Dict) -> Dict[str, Any]:
    """
    Generate SHAP values and explanations for comprehensive vehicle data format.
    
    This function computes SHAP values for the new comprehensive vehicle data format,
    showing how each engineered feature contributes to the final price prediction.
    It also provides verification confidence metrics and data quality insights.
    
    Args:
        vehicle_data (Dict): Comprehensive vehicle data following the JSON schema:
            - Each field has 'value', 'verified', and 'source_origin' properties
            - Supports all 46+ fields from the comprehensive schema
            - Required fields: vin, make, model, year, overall_condition_rating, zipcode
    
    Returns:
        Dict[str, Any]: Comprehensive explanation including:
            - shap_values: Feature contribution values
            - feature_names: Names of engineered features
            - verification_confidence: Overall data verification score
            - data_quality_impact: How data quality affects prediction confidence
            - feature_explanations: Human-readable feature impact descriptions
            - prediction_confidence: Model confidence based on data quality
    
    Raises:
        RuntimeError: If SHAP explainer hasn't been initialized
        ValueError: If vehicle_data format is invalid or missing required fields
        KeyError: If required comprehensive data fields are missing
    
    Example:
        >>> comprehensive_data = {
        ...     'year': {'value': 2020, 'verified': True, 'source_origin': 'VIN_Decode'},
        ...     'make': {'value': 'Toyota', 'verified': True, 'source_origin': 'VIN_Decode'},
        ...     'model': {'value': 'Camry', 'verified': True, 'source_origin': 'VIN_Decode'},
        ...     'overall_condition_rating': {'value': 'Good', 'verified': True, 'source_origin': 'AI_Video'},
        ...     'zipcode': {'value': 90210, 'verified': True, 'source_origin': 'User_Input'},
        ...     'photo_ai_score': {'value': 85, 'verified': True, 'source_origin': 'AI_Analysis'}
        ... }
        >>> explanation = explain_prediction_comprehensive(comprehensive_data)
        >>> print(f"Verification confidence: {explanation['verification_confidence']:.2f}")
        >>> for feature, contribution in zip(explanation['feature_names'], explanation['shap_values'][0]):
        ...     print(f"{feature}: ${contribution:+.2f}")
    """
    if explainer is None:
        raise RuntimeError("SHAP explainer not initialized. Call set_explainer(model) after training.")
    
    if not isinstance(vehicle_data, dict):
        raise ValueError("vehicle_data must be a dictionary")
    
    # Validate required fields
    required_fields = ['vin', 'make', 'model', 'year', 'overall_condition_rating', 'zipcode']
    missing_fields = [field for field in required_fields if field not in vehicle_data]
    if missing_fields:
        raise KeyError(f"Missing required fields: {missing_fields}")
    
    try:
        # Engineer comprehensive features using the same logic as the model
        features_df = engineer_comprehensive_features(vehicle_data)
        
        # Apply the same categorical encoding as used in training
        categorical_columns = [
            'make', 'model', 'condition', 'trim_level', 'body_style', 
            'drive_type', 'fuel_type', 'transmission', 'title_type', 'market_saturation'
        ]
        
        # Encode categorical features using the same encoders from training
        processed_features = features_df.copy()
        for col in categorical_columns:
            if col in processed_features.columns and col in _encoders:
                encoder = _encoders[col]
                try:
                    # Convert to string and encode
                    value = str(processed_features[col].iloc[0])
                    if value in encoder.classes_:
                        processed_features[col] = encoder.transform([value])[0]
                    else:
                        # Unknown category - encode as 'Unknown' if available, else use 0
                        if 'Unknown' in encoder.classes_:
                            processed_features[col] = encoder.transform(['Unknown'])[0]
                        else:
                            processed_features[col] = 0
                except (ValueError, AttributeError) as e:
                    # Fallback to 0 for encoding issues
                    processed_features[col] = 0
            elif col in processed_features.columns:
                # No encoder available, set to 0
                processed_features[col] = 0
        
        # Generate SHAP values for processed features
        shap_values = explainer.shap_values(processed_features)
        
        # Calculate verification confidence score
        verification_confidence = calculate_verification_confidence(vehicle_data)
        
        # Calculate data quality impact on prediction confidence
        data_quality_impact = calculate_data_quality_impact(vehicle_data, shap_values[0])
        
        # Generate feature explanations
        feature_explanations = generate_feature_explanations(
            processed_features.columns.tolist(), 
            shap_values[0],
            vehicle_data
        )
        
        # Calculate prediction confidence based on data verification
        prediction_confidence = calculate_prediction_confidence(verification_confidence, data_quality_impact)
        
        return {
            'shap_values': shap_values,
            'feature_names': processed_features.columns.tolist(),
            'verification_confidence': verification_confidence,
            'data_quality_impact': data_quality_impact,
            'feature_explanations': feature_explanations,
            'prediction_confidence': prediction_confidence,
            'base_value': explainer.expected_value,
            'prediction_value': float(shap_values[0].sum() + explainer.expected_value)
        }
        
    except Exception as e:
        raise ValueError(f"Failed to generate comprehensive SHAP explanation: {e}")

def calculate_verification_confidence(vehicle_data: Dict) -> float:
    """
    Calculate overall verification confidence score based on data source reliability.
    
    Args:
        vehicle_data (Dict): Comprehensive vehicle data with verification status
    
    Returns:
        float: Verification confidence score (0.0 to 1.0)
    """
    total_fields = 0
    verified_fields = 0
    source_weights = {
        'VIN_Decode': 1.0,
        'OEM_Database': 1.0,
        'NHTSA': 1.0,
        'AI_Video': 0.9,
        'AI_Analysis': 0.9,
        'Third_Party_API': 0.8,
        'User_Input': 0.6,
        'Manual_Entry': 0.5,
        'Estimated': 0.3
    }
    
    confidence_sum = 0.0
    
    for field_name, field_data in vehicle_data.items():
        if isinstance(field_data, dict) and 'verified' in field_data and 'source_origin' in field_data:
            total_fields += 1
            verified = field_data.get('verified', False)
            source = field_data.get('source_origin', 'Unknown')
            
            if verified:
                verified_fields += 1
                confidence_sum += source_weights.get(source, 0.5)
            else:
                confidence_sum += source_weights.get(source, 0.5) * 0.5  # Partial credit for unverified
    
    if total_fields == 0:
        return 0.0
    
    return confidence_sum / total_fields

def calculate_data_quality_impact(vehicle_data: Dict, shap_values: np.ndarray) -> Dict[str, float]:
    """
    Calculate how data quality affects prediction confidence.
    
    Args:
        vehicle_data (Dict): Comprehensive vehicle data
        shap_values (np.ndarray): SHAP values for features
    
    Returns:
        Dict[str, float]: Data quality impact metrics
    """
    # High-impact features (typically contribute most to price)
    high_impact_features = ['year', 'make', 'model', 'overall_condition_rating', 'photo_ai_score']
    
    high_impact_verified = 0
    high_impact_total = 0
    
    for feature in high_impact_features:
        if feature in vehicle_data:
            high_impact_total += 1
            if vehicle_data[feature].get('verified', False):
                high_impact_verified += 1
    
    high_impact_ratio = high_impact_verified / high_impact_total if high_impact_total > 0 else 0
    
    # Calculate overall data completeness
    total_possible_fields = 46  # From comprehensive schema
    provided_fields = len(vehicle_data)
    completeness_ratio = min(provided_fields / total_possible_fields, 1.0)
    
    # Calculate feature importance variance (higher variance = less confident)
    feature_variance = float(np.var(shap_values))
    
    return {
        'high_impact_verification_ratio': high_impact_ratio,
        'data_completeness_ratio': completeness_ratio,
        'feature_importance_variance': feature_variance,
        'overall_quality_score': (high_impact_ratio * 0.5 + completeness_ratio * 0.3 + (1.0 / (1.0 + feature_variance)) * 0.2)
    }

def calculate_prediction_confidence(verification_confidence: float, data_quality_impact: Dict[str, float]) -> float:
    """
    Calculate overall prediction confidence based on data quality metrics.
    
    Args:
        verification_confidence (float): Overall verification confidence score
        data_quality_impact (Dict): Data quality impact metrics
    
    Returns:
        float: Prediction confidence score (0.0 to 1.0)
    """
    quality_score = data_quality_impact.get('overall_quality_score', 0.5)
    
    # Weighted combination of verification confidence and data quality
    prediction_confidence = (verification_confidence * 0.6 + quality_score * 0.4)
    
    return min(max(prediction_confidence, 0.0), 1.0)

def generate_feature_explanations(feature_names: List[str], shap_values: np.ndarray, vehicle_data: Dict) -> List[Dict[str, Any]]:
    """
    Generate human-readable explanations for feature contributions.
    
    Args:
        feature_names (List[str]): Names of engineered features
        shap_values (np.ndarray): SHAP values for features
        vehicle_data (Dict): Original vehicle data for context
    
    Returns:
        List[Dict[str, Any]]: Feature explanations with impact descriptions
    """
    explanations = []
    
    for i, (feature_name, contribution) in enumerate(zip(feature_names, shap_values)):
        impact = "increases" if contribution > 0 else "decreases"
        magnitude = abs(contribution)
        
        if magnitude > 1000:
            magnitude_desc = "significantly"
        elif magnitude > 500:
            magnitude_desc = "moderately"
        elif magnitude > 100:
            magnitude_desc = "slightly"
        else:
            magnitude_desc = "minimally"
        
        # Try to find verification status for this feature
        verified_status = "unknown"
        for field_name, field_data in vehicle_data.items():
            if isinstance(field_data, dict) and field_name.lower() in feature_name.lower():
                verified_status = "verified" if field_data.get('verified', False) else "unverified"
                break
        
        explanation = {
            'feature': feature_name,
            'contribution': float(contribution),
            'impact_direction': impact,
            'magnitude_description': magnitude_desc,
            'verification_status': verified_status,
            'readable_explanation': f"{feature_name} {magnitude_desc} {impact} the price by ${abs(contribution):.2f} ({verified_status})"
        }
        
        explanations.append(explanation)
    
    # Sort by absolute contribution value (most important first)
    explanations.sort(key=lambda x: abs(x['contribution']), reverse=True)
    
    return explanations
    
def explain_prediction_legacy(input_df: pd.DataFrame) -> Any:
    """
    Generate SHAP values for legacy simple DataFrame format (backward compatibility).
    
    This function maintains compatibility with the original simple format while
    the system transitions to the comprehensive data model.
    
    Args:
        input_df (pd.DataFrame): Single-row DataFrame with basic vehicle features:
            - year (int): Vehicle model year
            - mileage (int/float): Vehicle mileage (optional, defaults to 50000)
            - make (str): Vehicle manufacturer
            - model (str): Vehicle model name  
            - condition (str): Vehicle condition
            - zipcode (int): Location zipcode
    
    Returns:
        numpy.ndarray: SHAP values array showing feature contributions
    
    Example:
        >>> vehicle = pd.DataFrame({
        ...     'year': [2020], 'mileage': [25000], 'make': ['Toyota'],
        ...     'model': ['Camry'], 'condition': ['Excellent'], 'zipcode': [90210]
        ... })
        >>> contributions = explain_prediction_legacy(vehicle)
        >>> print("Legacy format contributions:", contributions)
    """
    if explainer is None:
        raise RuntimeError("SHAP explainer not initialized. Call set_explainer(model) after training.")
    
    if len(input_df) == 0:
        raise ValueError("Input DataFrame cannot be empty")
    
    try:
        # Encode categorical variables consistently with training
        encoded_df = encode_input(input_df)
        
        # Ensure we have the correct feature order for legacy format
        feature_columns = ["year", "mileage", "make", "model", "condition", "zipcode"]
        
        # Add mileage if missing (backward compatibility)
        if 'mileage' not in encoded_df.columns:
            encoded_df['mileage'] = 50000  # Default mileage
        
        encoded_df = encoded_df[feature_columns]
        
        # Generate SHAP values
        shap_values = explainer.shap_values(encoded_df)
        
        return shap_values
        
    except Exception as e:
        raise ValueError(f"Failed to generate legacy SHAP explanation: {e}")

def explain_prediction(input_data: Union[pd.DataFrame, Dict]) -> Union[np.ndarray, Dict[str, Any]]:
    """
    Universal prediction explanation function that automatically detects format.
    
    This function serves as the main entry point for explanations, automatically
    detecting whether the input is in legacy DataFrame format or comprehensive
    dictionary format and routing to the appropriate explanation function.
    
    Args:
        input_data: Either:
            - pd.DataFrame: Legacy format with basic features
            - Dict: Comprehensive format following JSON schema
    
    Returns:
        Union[np.ndarray, Dict]: 
            - For legacy format: numpy array of SHAP values
            - For comprehensive format: detailed explanation dictionary
    
    Example:
        >>> # Legacy format
        >>> legacy_vehicle = pd.DataFrame({'year': [2020], 'make': ['Toyota'], ...})
        >>> legacy_explanation = explain_prediction(legacy_vehicle)
        >>> 
        >>> # Comprehensive format
        >>> comprehensive_vehicle = {'year': {'value': 2020, 'verified': True, ...}, ...}
        >>> comprehensive_explanation = explain_prediction(comprehensive_vehicle)
    """
    if isinstance(input_data, pd.DataFrame):
        return explain_prediction_legacy(input_data)
    elif isinstance(input_data, dict):
        return explain_prediction_comprehensive(input_data)
    else:
        raise ValueError("Input must be either pandas DataFrame (legacy) or dictionary (comprehensive)")

def get_explanation_summary(explanation_result: Union[np.ndarray, Dict[str, Any]], 
                          input_data: Union[pd.DataFrame, Dict]) -> str:
    """
    Generate a human-readable summary of the explanation results.
    
    Args:
        explanation_result: Result from explain_prediction function
        input_data: Original input data
    
    Returns:
        str: Human-readable explanation summary
    """
    if isinstance(explanation_result, dict):
        # Comprehensive format summary
        confidence = explanation_result.get('prediction_confidence', 0.0)
        verification = explanation_result.get('verification_confidence', 0.0)
        predicted_price = explanation_result.get('prediction_value', 0.0)
        
        summary = f"""
🚗 Vehicle Valuation Explanation Summary

💰 Predicted Price: ${predicted_price:,.2f}
📊 Prediction Confidence: {confidence:.1%}
✅ Data Verification: {verification:.1%}

🔍 Top Contributing Factors:
"""
        
        explanations = explanation_result.get('feature_explanations', [])
        for i, exp in enumerate(explanations[:5]):  # Top 5 factors
            summary += f"   {i+1}. {exp['readable_explanation']}\n"
        
        data_quality = explanation_result.get('data_quality_impact', {})
        completeness = data_quality.get('data_completeness_ratio', 0.0)
        summary += f"\n📋 Data Completeness: {completeness:.1%}"
        
        return summary
    
    else:
        # Legacy format summary
        if isinstance(input_data, pd.DataFrame):
            features = ["year", "mileage", "make", "model", "condition", "zipcode"]
            summary = "🚗 Legacy Vehicle Valuation Explanation\n\n🔍 Feature Contributions:\n"
            
            for feature, contribution in zip(features, explanation_result[0]):
                impact = "+" if contribution > 0 else ""
                summary += f"   • {feature}: {impact}${contribution:.2f}\n"
            
            return summary
        
        return "Unable to generate summary for this explanation format."

class VehicleValuationExplainer:
    def __init__(self):
        pass

