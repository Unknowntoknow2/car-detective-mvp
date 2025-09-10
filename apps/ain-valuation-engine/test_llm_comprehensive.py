#!/usr/bin/env python3
"""
Test the LLM summary generation with comprehensive VehicleDataForValuation format.
This test validates the complete interpretability stack: ML model → SHAP explanations → LLM summaries.
"""

import sys
import os
sys.path.append('/workspaces/ain-valuation-engine')

from val_engine.comprehensive_test_data import create_comprehensive_vehicle_data
from val_engine.model import predict_price_comprehensive
from val_engine.shap_explainer import VehicleValuationExplainer
from val_engine.llm_summary import generate_valuation_summary
import json

def test_llm_comprehensive_integration():
    """Test the complete interpretability pipeline with comprehensive data."""
    print("🔄 Testing LLM Summary Integration with Comprehensive Data")
    print("=" * 70)
    
    # Step 1: Create comprehensive test data
    print("\n1. Creating comprehensive test vehicle data...")
    vehicle_data = create_comprehensive_vehicle_data()
    
    # Display key vehicle info
    make = vehicle_data.get('make', {}).get('value', 'Unknown')
    model = vehicle_data.get('model', {}).get('value', 'Unknown')
    year = vehicle_data.get('year', {}).get('value', 'Unknown')
    mileage = vehicle_data.get('mileage', {}).get('value', 'Unknown')
    condition = vehicle_data.get('overall_condition_rating', {}).get('value', 'Unknown')
    
    print(f"   Vehicle: {year} {make} {model}")
    print(f"   Mileage: {mileage:,} miles")
    print(f"   Condition: {condition}")
    
    # Step 2: Generate ML prediction
    print("\n2. Generating ML prediction...")
    prediction = predict_price_comprehensive(vehicle_data)
    print(f"   Predicted Price: ${prediction:,.2f}")
    
    # Step 3: Generate SHAP explanations
    print("\n3. Generating SHAP explanations...")
    explainer = VehicleValuationExplainer()
    explanation = explainer.explain_prediction_comprehensive(vehicle_data)
    
    shap_values = explanation.get('shap_values')
    expected_value = explanation.get('expected_value')
    feature_names = explanation.get('feature_names')
    verification_confidence = explanation.get('verification_confidence', 0)
    prediction_confidence = explanation.get('prediction_confidence', 0)
    
    print(f"   Verification Confidence: {verification_confidence:.1f}%")
    print(f"   Prediction Confidence: {prediction_confidence:.1f}%")
    print(f"   Top Feature Impact: {abs(shap_values[0][0]):.0f} (${abs(shap_values[0][0]):,.0f})")
    
    # Step 4: Test LLM summary generation - SELL mode
    print("\n4. Generating LLM summary (SELL mode)...")
    try:
        sell_summary = generate_valuation_summary(
            estimated_price=prediction,
            vehicle_data=vehicle_data,
            shap_values=shap_values,
            expected_value=expected_value,
            feature_names=feature_names,
            mode="sell"
        )
        
        print("   ✅ LLM Summary Generated Successfully (SELL)")
        print(f"   Summary Length: {len(sell_summary)} characters")
        print(f"   Summary Preview: {sell_summary[:100]}...")
        
    except Exception as e:
        print(f"   ❌ Error generating SELL summary: {e}")
        sell_summary = None
    
    # Step 5: Test LLM summary generation - BUY mode
    print("\n5. Generating LLM summary (BUY mode)...")
    try:
        buy_summary = generate_valuation_summary(
            estimated_price=prediction,
            vehicle_data=vehicle_data,
            shap_values=shap_values,
            expected_value=expected_value,
            feature_names=feature_names,
            mode="buy"
        )
        
        print("   ✅ LLM Summary Generated Successfully (BUY)")
        print(f"   Summary Length: {len(buy_summary)} characters")
        print(f"   Summary Preview: {buy_summary[:100]}...")
        
    except Exception as e:
        print(f"   ❌ Error generating BUY summary: {e}")
        buy_summary = None
    
    # Step 6: Test error handling with invalid data
    print("\n6. Testing error handling...")
    try:
        # Test with invalid price
        generate_valuation_summary(
            estimated_price=-1000,
            vehicle_data=vehicle_data,
            mode="sell"
        )
        print("   ❌ Should have raised ValueError for negative price")
    except ValueError as e:
        print(f"   ✅ Correctly caught invalid price: {e}")
    except Exception as e:
        print(f"   ⚠️  Unexpected error: {e}")
    
    try:
        # Test with invalid vehicle_data
        generate_valuation_summary(
            estimated_price=25000,
            vehicle_data="invalid_data",
            mode="sell"
        )
        print("   ❌ Should have raised ValueError for invalid vehicle_data")
    except ValueError as e:
        print(f"   ✅ Correctly caught invalid vehicle_data: {e}")
    except Exception as e:
        print(f"   ⚠️  Unexpected error: {e}")
    
    # Step 7: Display complete results
    print("\n" + "=" * 70)
    print("🎯 COMPLETE INTERPRETABILITY PIPELINE RESULTS")
    print("=" * 70)
    
    print(f"\n📊 Vehicle Analysis:")
    print(f"   Vehicle: {year} {make} {model} ({mileage:,} miles)")
    print(f"   Predicted Value: ${prediction:,.2f}")
    print(f"   Model Base Value: ${expected_value:,.2f}")
    print(f"   Verification Confidence: {verification_confidence:.1f}%")
    print(f"   Prediction Confidence: {prediction_confidence:.1f}%")
    
    if sell_summary:
        print(f"\n📝 SELL Mode Summary:")
        print("-" * 50)
        print(sell_summary)
    
    if buy_summary:
        print(f"\n📝 BUY Mode Summary:")
        print("-" * 50) 
        print(buy_summary)
    
    # Step 8: Test with video analysis data
    print(f"\n7. Testing with video analysis data...")
    try:
        # Add mock video analysis to vehicle data
        video_vehicle_data = vehicle_data.copy()
        video_vehicle_data['video_ai_condition_score'] = {
            'value': 87.5,
            'verified': True,
            'source_origin': 'AI_Analysis',
            'confidence_score': 0.92
        }
        
        video_summary = generate_valuation_summary(
            estimated_price=prediction,
            vehicle_data=video_vehicle_data,
            shap_values=shap_values,
            expected_value=expected_value,
            feature_names=feature_names,
            mode="sell"
        )
        
        print("   ✅ Video analysis integration successful")
        print(f"   Video Summary Preview: {video_summary[:100]}...")
        
    except Exception as e:
        print(f"   ❌ Error with video analysis: {e}")
    
    print(f"\n✅ LLM Comprehensive Integration Test Complete!")
    return True

if __name__ == "__main__":
    try:
        test_llm_comprehensive_integration()
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
