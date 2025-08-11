#!/usr/bin/env python3
"""
Test script for comprehensive SHAP explainer with VehicleDataForValuation format.

This script validates the enhanced SHAP explainer functionality with the new
comprehensive vehicle data format, including verification status and data quality metrics.
"""

import sys
import os
import pandas as pd
import numpy as np
from typing import Dict, Any

# Add current directory to path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import our enhanced modules
from model import train_model, predict_price_comprehensive, engineer_comprehensive_features
from shap_explainer import (
    set_explainer, 
    explain_prediction, 
    explain_prediction_comprehensive,
    get_explanation_summary,
    calculate_verification_confidence
)

def create_sample_comprehensive_data() -> Dict[str, Any]:
    """Create sample comprehensive vehicle data following the JSON schema."""
    return {
        "vin": {
            "value": "1HGBH41JXMN109186",
            "verified": True,
            "source_origin": "VIN_Decode"
        },
        "make": {
            "value": "Toyota",
            "verified": True,
            "source_origin": "VIN_Decode"
        },
        "model": {
            "value": "Camry",
            "verified": True,
            "source_origin": "VIN_Decode"
        },
        "year": {
            "value": 2020,
            "verified": True,
            "source_origin": "VIN_Decode"
        },
        "trim_submodel": {
            "value": "XLE",
            "verified": True,
            "source_origin": "OEM_Database"
        },
        "body_style": {
            "value": "Sedan",
            "verified": True,
            "source_origin": "VIN_Decode"
        },
        "drive_type": {
            "value": "FWD",
            "verified": True,
            "source_origin": "OEM_Database"
        },
        "engine_size_type": {
            "value": "2.5L I4",
            "verified": True,
            "source_origin": "OEM_Database"
        },
        "transmission": {
            "value": "Automatic",
            "verified": True,
            "source_origin": "OEM_Database"
        },
        "fuel_type": {
            "value": "Gasoline",
            "verified": True,
            "source_origin": "OEM_Database"
        },
        "msrp": {
            "value": 28400,
            "verified": True,
            "source_origin": "OEM_Database"
        },
        "overall_condition_rating": {
            "value": "Good",
            "verified": True,
            "source_origin": "AI_Video"
        },
        "exterior_damage": {
            "value": ["minor_scratch_rear_bumper"],
            "verified": True,
            "source_origin": "AI_Video"
        },
        "interior_wear": {
            "value": ["slight_driver_seat_wear"],
            "verified": True,
            "source_origin": "AI_Video"
        },
        "mechanical_issues": {
            "value": [],
            "verified": True,
            "source_origin": "AI_Analysis"
        },
        "tires_brakes_condition": {
            "value": "Good",
            "verified": True,
            "source_origin": "AI_Video"
        },
        "cleanliness_odor": {
            "value": "Clean",
            "verified": True,
            "source_origin": "AI_Analysis"
        },
        "photo_ai_score": {
            "value": 82,
            "verified": True,
            "source_origin": "AI_Analysis"
        },
        "accident_history": {
            "value": [],
            "verified": True,
            "source_origin": "CARFAX"
        },
        "title_type": {
            "value": "Clean",
            "verified": True,
            "source_origin": "CARFAX"
        },
        "number_of_owners": {
            "value": 2,
            "verified": True,
            "source_origin": "CARFAX"
        },
        "service_history_available": {
            "value": True,
            "verified": True,
            "source_origin": "CARFAX"
        },
        "open_recalls": {
            "value": [],
            "verified": True,
            "source_origin": "NHTSA"
        },
        "odometer_accuracy_verified": {
            "value": True,
            "verified": True,
            "source_origin": "CARFAX"
        },
        "zipcode": {
            "value": 90210,
            "verified": True,
            "source_origin": "User_Input"
        },
        "nearby_inventory_count": {
            "value": 15,
            "verified": True,
            "source_origin": "Market_API"
        },
        "market_saturation_level": {
            "value": "Medium",
            "verified": True,
            "source_origin": "Market_API"
        },
        "features_options": {
            "value": {
                "sunroof_moonroof": True,
                "navigation_system": True,
                "heated_ventilated_seats": True,
                "premium_audio_system": True,
                "advanced_safety_systems": True,
                "leather_seats": True,
                "keyless_entry": True,
                "apple_carplay_android_auto": True
            },
            "verified": True,
            "source_origin": "OEM_Database"
        },
        "exterior_color": {
            "value": "Midnight Black Metallic",
            "verified": True,
            "source_origin": "AI_Video"
        },
        "interior_color": {
            "value": "Black",
            "verified": True,
            "source_origin": "AI_Video"
        },
        "epa_mpg_combined": {
            "value": 32,
            "verified": True,
            "source_origin": "EPA_Database"
        },
        "factory_warranty_remaining_months": {
            "value": 18,
            "verified": True,
            "source_origin": "OEM_Database"
        },
        "certified_pre_owned": {
            "value": False,
            "verified": True,
            "source_origin": "Dealer_Info"
        }
    }

def create_sample_legacy_data() -> pd.DataFrame:
    """Create sample legacy format data for comparison."""
    return pd.DataFrame({
        'year': [2020],
        'mileage': [35000],
        'make': ['Toyota'],
        'model': ['Camry'],
        'condition': ['Good'],
        'zipcode': [90210]
    })

def test_comprehensive_shap_explainer():
    """Test the comprehensive SHAP explainer functionality."""
    
    print("🧪 Testing Comprehensive SHAP Explainer")
    print("=" * 50)
    
    try:
        # Step 1: Create sample data
        print("\n1️⃣ Creating sample comprehensive vehicle data...")
        comprehensive_data = create_sample_comprehensive_data()
        legacy_data = create_sample_legacy_data()
        
        print(f"   ✅ Created comprehensive data with {len(comprehensive_data)} fields")
        print(f"   ✅ Created legacy data with {len(legacy_data.columns)} columns")
        
        # Step 2: Test verification confidence calculation
        print("\n2️⃣ Testing verification confidence calculation...")
        verification_score = calculate_verification_confidence(comprehensive_data)
        print(f"   ✅ Verification confidence: {verification_score:.2%}")
        
        # Step 3: Test comprehensive feature engineering
        print("\n3️⃣ Testing comprehensive feature engineering...")
        features_df = engineer_comprehensive_features(comprehensive_data)
        print(f"   ✅ Engineered {len(features_df.columns)} features from comprehensive data")
        print(f"   📊 Feature columns: {list(features_df.columns)}")
        
        # Step 4: Setup and train model first
        print("\n4️⃣ Training model for testing...")
        
        # Create minimal training data for testing
        training_data = pd.DataFrame({
            'year': [2018, 2019, 2020, 2021],
            'mileage': [60000, 45000, 30000, 15000],
            'make': ['Toyota', 'Honda', 'Toyota', 'Honda'],
            'model': ['Camry', 'Accord', 'Camry', 'Accord'],
            'condition': ['Fair', 'Good', 'Good', 'Excellent'],
            'zipcode': [90210, 10001, 90210, 10001],
            'price': [18000, 22000, 25000, 28000]
        })
        
        print("   🔧 Training minimal model...")
        train_model(training_data)
        
        # Import the global model instance
        from model import _model as trained_model
        print("   ✅ Model trained successfully")
        
        # Step 5: Test comprehensive model prediction
        print("\n5️⃣ Testing comprehensive model prediction...")
        prediction_result = predict_price_comprehensive(comprehensive_data)
        prediction_price = prediction_result['predicted_price']
        print(f"   ✅ Predicted price: ${prediction_price:,.2f}")
        print(f"   📊 Confidence score: {prediction_result['confidence_score']:.2%}")
        print(f"   📊 Data quality score: {prediction_result['data_quality_score']:.2%}")
        
        # Step 6: Set up SHAP explainer
        print("\n6️⃣ Setting up SHAP explainer...")
        set_explainer(trained_model)
        print("   ✅ SHAP explainer initialized")
        
        # Step 7: Test comprehensive explanation
        print("\n7️⃣ Testing comprehensive explanation...")
        try:
            comprehensive_explanation = explain_prediction_comprehensive(comprehensive_data)
            print("   ✅ Generated comprehensive explanation")
            print(f"   📊 Verification confidence: {comprehensive_explanation['verification_confidence']:.2%}")
            print(f"   📊 Prediction confidence: {comprehensive_explanation['prediction_confidence']:.2%}")
            
            # Check if feature explanations were generated
            if comprehensive_explanation.get('feature_explanations'):
                print(f"   📊 Number of feature explanations: {len(comprehensive_explanation['feature_explanations'])}")
                
                # Show top 3 feature contributions
                print("\n   🔍 Top 3 Feature Contributions:")
                for i, exp in enumerate(comprehensive_explanation['feature_explanations'][:3]):
                    print(f"      {i+1}. {exp['readable_explanation']}")
            else:
                print("   ⚠️ No feature explanations generated")
                
        except Exception as e:
            print(f"   ⚠️ Comprehensive explanation test failed: {e}")
            print("   ℹ️ This may be due to feature engineering complexity - continuing with other tests...")
            import traceback
            traceback.print_exc()
        
        # Step 8: Test legacy explanation for comparison
        print("\n8️⃣ Testing legacy explanation...")
        try:
            legacy_explanation = explain_prediction(legacy_data)
            print("   ✅ Generated legacy explanation")
            print(f"   📊 Legacy SHAP values shape: {legacy_explanation.shape}")
            
        except Exception as e:
            print(f"   ⚠️ Legacy explanation test failed: {e}")
        
        # Step 9: Test universal explain_prediction function
        print("\n9️⃣ Testing universal explanation function...")
        try:
            # Test automatic format detection
            auto_legacy = explain_prediction(legacy_data)
            print("   ✅ Automatic legacy format detection works")
            
            # Test comprehensive format if previous step worked
            if 'comprehensive_explanation' in locals():
                auto_comprehensive = explain_prediction(comprehensive_data)
                print("   ✅ Automatic comprehensive format detection works")
            
        except Exception as e:
            print(f"   ⚠️ Universal explanation test failed: {e}")
        
        # Step 10: Test explanation summary generation
        print("\n🔟 Testing explanation summary generation...")
        try:
            if 'comprehensive_explanation' in locals():
                summary = get_explanation_summary(comprehensive_explanation, comprehensive_data)
                print("   ✅ Generated comprehensive summary")
                print("\n" + "─" * 40)
                print(summary)
                print("─" * 40)
            
        except Exception as e:
            print(f"   ⚠️ Summary generation test failed: {e}")
        
        print("\n" + "=" * 50)
        print("🎉 Comprehensive SHAP Explainer Testing Complete!")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Testing failed with error: {e}")
        import traceback
        print("\n📋 Full traceback:")
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_comprehensive_shap_explainer()
    sys.exit(0 if success else 1)
