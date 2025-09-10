#!/usr/bin/env python3
"""
Comprehensive test data generator for VehicleDataForValuation format.
Creates realistic test data matching the TypeScript interface structure.
"""

from typing import Dict, Any, List, Optional
import random
from datetime import datetime, timedelta

def create_comprehensive_vehicle_data(
    make: str = "Toyota",
    model: str = "Camry", 
    year: int = 2019,
    mileage: int = 45000,
    condition: str = "Good"
) -> Dict[str, Any]:
    """
    Create comprehensive test vehicle data matching VehicleDataForValuation schema.
    
    Args:
        make: Vehicle manufacturer
        model: Vehicle model
        year: Vehicle year
        mileage: Vehicle mileage
        condition: Overall condition rating
        
    Returns:
        Dictionary matching comprehensive VehicleDataForValuation format
    """
    
    # Generate verification patterns
    def create_verified_field(value: Any, source: str = "OEM", verified: bool = True, confidence: float = 0.95):
        return {
            "value": value,
            "verified": verified,
            "source_origin": source,
            "confidence_score": confidence,
            "last_updated": datetime.now().isoformat()
        }
    
    def create_unverified_field(value: Any, confidence: float = 0.7):
        return {
            "value": value,
            "verified": False,
            "source_origin": "User_Input",
            "confidence_score": confidence,
            "last_updated": datetime.now().isoformat()
        }
    
    # Create comprehensive vehicle data
    vehicle_data = {
        # Basic Vehicle Information
        "make": create_verified_field(make, "OEM", True, 1.0),
        "model": create_verified_field(model, "OEM", True, 1.0),
        "year": create_verified_field(year, "OEM", True, 1.0),
        "mileage": create_verified_field(mileage, "Carfax", True, 0.95),
        "trim_level": create_verified_field("LE", "OEM", True, 0.98),
        "body_style": create_verified_field("Sedan", "OEM", True, 1.0),
        "drivetrain": create_verified_field("FWD", "OEM", True, 1.0),
        "fuel_type": create_verified_field("Gasoline", "OEM", True, 1.0),
        "transmission": create_verified_field("Automatic", "OEM", True, 1.0),
        "engine_size": create_verified_field("2.5L I4", "OEM", True, 1.0),
        "exterior_color": create_unverified_field("Silver", 0.8),
        "interior_color": create_unverified_field("Black", 0.8),
        
        # Condition Assessment
        "overall_condition_rating": create_unverified_field(condition, 0.75),
        "exterior_condition": create_unverified_field("Good", 0.75),
        "interior_condition": create_unverified_field("Very Good", 0.75),
        "mechanical_condition": create_unverified_field("Excellent", 0.8),
        "tire_condition": create_unverified_field("Good", 0.7),
        
        # AI-Powered Assessments
        "photo_ai_score": create_verified_field(82.5, "AI_Analysis", True, 0.88),
        "video_ai_condition_score": create_verified_field(85.3, "AI_Analysis", True, 0.91),
        
        # Vehicle History
        "accident_history": create_verified_field([], "Carfax", True, 0.95),
        "service_history": create_verified_field([
            {
                "date": "2023-06-15",
                "type": "Oil Change",
                "mileage": 42000,
                "verified": True
            },
            {
                "date": "2023-03-10", 
                "type": "Brake Inspection",
                "mileage": 40500,
                "verified": True
            }
        ], "Carfax", True, 0.92),
        "title_type": create_verified_field("Clean", "DMV", True, 0.98),
        "number_of_owners": create_verified_field(1, "Carfax", True, 0.95),
        "personal_use_only": create_verified_field(True, "Carfax", True, 0.90),
        
        # Financial Information
        "loan_balance": create_unverified_field(0, 0.9),
        "factory_warranty_remaining_months": create_verified_field(8, "OEM", True, 1.0),
        "extended_warranty": create_unverified_field(False, 0.8),
        
        # Features and Options
        "features_options": create_verified_field({
            "navigation_system": True,
            "backup_camera": True,
            "heated_seats": True,
            "bluetooth_connectivity": True,
            "cruise_control": True,
            "air_conditioning": True,
            "power_windows": True,
            "power_locks": True,
            "keyless_entry": True,
            "sunroof": False,
            "leather_seats": False,
            "premium_sound": True
        }, "OEM", True, 0.95),
        
        # Market Context
        "zipcode": create_unverified_field("90210", 0.9),
        "regional_market_demand": create_verified_field("High", "Market_Analysis", True, 0.85),
        "seasonal_demand_factor": create_verified_field(1.05, "Market_Analysis", True, 0.82),
        "market_saturation_level": create_verified_field("Medium", "Market_Analysis", True, 0.78),
        "time_on_market_days": create_verified_field(28, "Market_Analysis", True, 0.80),
        
        # Comparable Sales
        "comparable_sales": create_verified_field([
            {
                "sale_price": 24500,
                "sale_date": "2024-01-15",
                "mileage": 47000,
                "condition": "Good",
                "days_on_market": 22
            },
            {
                "sale_price": 25800,
                "sale_date": "2024-01-08", 
                "mileage": 43000,
                "condition": "Very Good",
                "days_on_market": 18
            },
            {
                "sale_price": 23200,
                "sale_date": "2023-12-28",
                "mileage": 52000,
                "condition": "Good",
                "days_on_market": 35
            }
        ], "Market_Analysis", True, 0.88),
        
        # Certification and Inspections
        "certification_type": create_unverified_field("None", 0.9),
        "inspection_records": create_verified_field([
            {
                "type": "State Inspection",
                "date": "2023-08-15",
                "result": "Pass",
                "expiration": "2024-08-15"
            }
        ], "DMV", True, 0.95),
        
        # Transportation and Logistics
        "delivery_distance_miles": create_unverified_field(25, 0.8),
        "transportation_cost": create_unverified_field(150, 0.75),
        
        # Seller Information
        "seller_type": create_unverified_field("Individual", 0.9),
        "seller_motivation": create_unverified_field("Upgrading", 0.7),
        "listing_price": create_unverified_field(26500, 0.9),
        "price_flexibility": create_unverified_field("Some", 0.6),
        
        # Additional Market Factors
        "fuel_economy_city": create_verified_field(28, "EPA", True, 1.0),
        "fuel_economy_highway": create_verified_field(39, "EPA", True, 1.0),
        "safety_rating": create_verified_field(5, "NHTSA", True, 1.0),
        "reliability_rating": create_verified_field(4.5, "Consumer_Reports", True, 0.92),
        
        # Metadata
        "valuation_date": datetime.now().isoformat(),
        "data_completeness_score": 0.89,
        "verification_score": 0.87
    }
    
    return vehicle_data

def create_luxury_vehicle_data() -> Dict[str, Any]:
    """Create test data for a luxury vehicle with different characteristics."""
    return create_comprehensive_vehicle_data(
        make="BMW",
        model="X5",
        year=2020,
        mileage=35000,
        condition="Excellent"
    )

def create_high_mileage_vehicle_data() -> Dict[str, Any]:
    """Create test data for a high-mileage vehicle."""
    return create_comprehensive_vehicle_data(
        make="Honda",
        model="Civic",
        year=2016,
        mileage=125000,
        condition="Fair"
    )

def create_low_verification_vehicle_data() -> Dict[str, Any]:
    """Create test data with low verification scores."""
    data = create_comprehensive_vehicle_data()
    
    # Make most fields unverified
    for key, value in data.items():
        if isinstance(value, dict) and 'verified' in value:
            value['verified'] = False
            value['source_origin'] = 'User_Input'
            value['confidence_score'] = random.uniform(0.4, 0.7)
    
    # Keep only critical fields verified
    data['make']['verified'] = True
    data['model']['verified'] = True
    data['year']['verified'] = True
    
    return data

# For testing different scenarios
TEST_SCENARIOS = {
    "standard": create_comprehensive_vehicle_data,
    "luxury": create_luxury_vehicle_data,
    "high_mileage": create_high_mileage_vehicle_data,
    "low_verification": create_low_verification_vehicle_data
}
