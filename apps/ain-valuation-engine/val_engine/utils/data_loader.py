import pandas as pd
import os
import json
from datetime import datetime
from typing import Dict, List, Optional, Union

def load_training_data():
    base_dir = os.path.dirname(__file__)
    path = os.path.join(base_dir, '..', 'training_data.csv')
    return pd.read_csv(os.path.abspath(path))

def preprocess_input(vehicle: Dict) -> pd.DataFrame:
    """
    Enhanced preprocessing with comprehensive data format support.

    Args:
        vehicle: Dictionary containing vehicle data (supports legacy, video-enhanced, and comprehensive formats)

    Returns:
        DataFrame ready for model prediction with enhanced features
    """

    # Helper function to extract value from comprehensive format
    def extract_value(field_data, default=None):
        if isinstance(field_data, dict) and 'value' in field_data:
            return field_data['value']
        return field_data if field_data is not None else default

    # Extract core fields (comprehensive format compatible)
    base_data = {
        "year": int(extract_value(vehicle.get("year"), 2020)),
        "mileage": int(extract_value(vehicle.get("mileage"), 0)),
        "make": str(extract_value(vehicle.get("make"), "Unknown")),
        "model": str(extract_value(vehicle.get("model"), "Unknown")),
        "zipcode": int(extract_value(vehicle.get("zipcode"), 0)),
        "condition": str(extract_value(vehicle.get("condition") or vehicle.get("overall_condition_rating"), "Good"))
    }

    # 🎥 VIDEO ANALYSIS INTEGRATION
    # PATCH: Accept both "valuation_video" and "video_analysis" keys for compatibility
    video_data = None
    if "valuation_video" in vehicle and vehicle["valuation_video"]:
        video_data = vehicle["valuation_video"]
    elif "video_analysis" in vehicle and vehicle["video_analysis"]:
        video_data = vehicle["video_analysis"]
    if video_data:
        # Add video-derived condition score (overrides basic condition)
        if "ai_condition_score" in video_data and video_data["ai_condition_score"] is not None:
            base_data["ai_condition_score"] = float(video_data["ai_condition_score"])

            # Convert AI score to categorical condition for legacy model compatibility
            ai_score = video_data["ai_condition_score"]
            if ai_score >= 90:
                base_data["condition"] = "Excellent"
            elif ai_score >= 75:
                base_data["condition"] = "Good"
            elif ai_score >= 60:
                base_data["condition"] = "Fair"
            else:
                base_data["condition"] = "Poor"

        # Add video quality confidence factor
        if "video_confidence_factor" in video_data and video_data["video_confidence_factor"] is not None:
            base_data["video_confidence_factor"] = float(video_data["video_confidence_factor"])
        elif "video_quality" in video_data and video_data["video_quality"]:
            quality = video_data["video_quality"]
            coverage = quality.get("coverage_completeness", 50)
            stability = quality.get("stability_score", 50)
            base_data["video_confidence_factor"] = (coverage + stability) / 200  # 0-1 scale
        else:
            base_data["video_confidence_factor"] = None

        # Add detected issue count as negative factor
        if "detected_issues" in video_data and video_data["detected_issues"]:
            # If detected_issues is a list
            if isinstance(video_data["detected_issues"], list):
                base_data["detected_issue_count"] = len(video_data["detected_issues"])
            # If detected_issues is a dict (legacy)
            elif isinstance(video_data["detected_issues"], dict):
                issues = video_data["detected_issues"]
                total_issues = (
                    len(issues.get("exterior_damage", [])) +
                    len(issues.get("interior_condition", [])) +
                    len(issues.get("mechanical_sounds", []))
                )
                base_data["detected_issue_count"] = total_issues
            else:
                base_data["detected_issue_count"] = 0
        elif "ai_detected_issues" in video_data and video_data["ai_detected_issues"]:
            issues = video_data["ai_detected_issues"]
            total_issues = (
                len(issues.get("exterior_damage", [])) +
                len(issues.get("interior_condition", [])) +
                len(issues.get("mechanical_sounds", []))
            )
            base_data["detected_issue_count"] = total_issues
            base_data["cleanliness_score"] = issues.get("cleanliness_score", 50)
        else:
            base_data["detected_issue_count"] = 0

        # Pass-through additional fields if present
        for key in [
            "exterior_score",
            "interior_score",
            "mechanical_score",
            "verification_status",
        ]:
            if key in video_data:
                base_data[key] = video_data[key]
    else:
        # Default values for non-video valuations
        base_data["ai_condition_score"] = None
        base_data["video_confidence_factor"] = None
        base_data["detected_issue_count"] = 0
        base_data["cleanliness_score"] = 50

    # Add enhanced features if available
    if "overall_condition_rating" in vehicle:
        base_data["overall_condition_rating"] = str(vehicle["overall_condition_rating"])

    if "mileage" in vehicle:
        # Extract verified mileage value if using new schema
        if isinstance(vehicle["mileage"], dict) and "value" in vehicle["mileage"]:
            base_data["mileage"] = int(vehicle["mileage"]["value"])
            base_data["mileage_verified"] = vehicle["mileage"].get("verified", False)
        else:
            base_data["mileage_verified"] = False

    return pd.DataFrame([base_data])

def process_video_analysis_response(video_response: Dict) -> Dict:
    """
    Process video analysis response and format for model input.

    Args:
        video_response: Response from video analysis API

    Returns:
        Formatted video data for inclusion in vehicle data
    """
    if video_response["status"] != "Success":
        return None

    insights = video_response["ai_insights"]
    value_impact = video_response["estimated_value_impact"]

    return {
        "ai_condition_score": insights["overall_condition_score"],
        "ai_analysis_summary": insights["summary"],
        "ai_detected_issues": {
            "total_count": len(insights["detected_issues"]),
            "issues": insights["detected_issues"]
        },
        "confidence_score": insights["confidence_score"],
        "value_adjustment_percentage": value_impact["estimated_adjustment_percentage"],
        "processing_time": video_response["processing_time_seconds"]
    }

def extract_verified_fields(vehicle_data: Dict) -> Dict:
    """
    Extract only verified fields from the enhanced vehicle data schema.

    Args:
        vehicle_data: Vehicle data with verification metadata

    Returns:
        Dictionary with only verified data points
    """
    verified_data = {}

    for key, value in vehicle_data.items():
        if isinstance(value, dict) and "verified" in value and "value" in value:
            if value["verified"]:
                verified_data[key] = value["value"]
                verified_data[f"{key}_source"] = value["source_origin"]
        else:
            # Handle non-structured fields
            verified_data[key] = value

    return verified_data

def calculate_data_confidence_score(vehicle_data: Dict) -> float:
    """
    Calculate overall confidence score based on data verification and completeness.

    Args:
        vehicle_data: Vehicle data with verification metadata

    Returns:
        Confidence score from 0.0 to 1.0
    """
    verified_count = 0
    total_count = 0

    for key, value in vehicle_data.items():
        if isinstance(value, dict) and "verified" in value:
            total_count += 1
            if value["verified"]:
                verified_count += 1

    # Base confidence from verified data ratio
    verification_ratio = verified_count / total_count if total_count > 0 else 0

    # Bonus for video analysis
    video_bonus = 0
    if "valuation_video" in vehicle_data and vehicle_data["valuation_video"]:
        video_data = vehicle_data["valuation_video"]
        if video_data.get("processing_status") == "Complete":
            video_bonus = 0.15  # 15% bonus for video analysis

            # Additional bonus for high-quality video
            if "video_quality" in video_data:
                quality = video_data["video_quality"]
                avg_quality = (
                    quality.get("stability_score", 50) +
                    quality.get("coverage_completeness", 50)
                ) / 200
                video_bonus *= avg_quality

    return min(1.0, verification_ratio + video_bonus)
