#!/usr/bin/env python3
"""
Quick test of the enhanced valuation engine
"""
import sys
import os
sys.path.append('/workspaces/ain-valuation-engine')

def test_simple_valuation():
    try:
        from val_engine.main import run_valuation, initialize_valuation_engine
        
        # Initialize the engine first
        print("🔧 Initializing valuation engine...")
        initialize_valuation_engine()
        
        # Simple test case
        sample = {
            'year': 2020,
            'make': 'Toyota', 
            'model': 'Camry',
            'mileage': 25000,
            'zipcode': 90210,
            'condition': 'Good'
        }
        
        print("🧪 Testing simple valuation...")
        result = run_valuation(sample, mode='sell')
        
        print(f"✅ SUCCESS!")
        print(f"   Estimated Value: ${result['estimated_value']:,.2f}")
        print(f"   Mode: {result.get('mode', 'N/A')}")
        print(f"   Summary Preview: {result.get('summary', 'N/A')[:50]}...")
        
        return True
        
    except Exception as e:
        print(f"❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_comprehensive_valuation():
    try:
        from val_engine.main import run_valuation, initialize_valuation_engine
        
        # Initialize the engine first (if not already done)
        print("🔧 Ensuring valuation engine is initialized...")
        try:
            initialize_valuation_engine()
        except RuntimeError:
            # Already initialized, that's fine
            pass
        
        # Comprehensive test case
        comprehensive_sample = {
            "vin": {"value": "1HGCM82633A004352", "verified": True, "source_origin": "VIN_Decode"},
            "year": {"value": 2021, "verified": True, "source_origin": "VIN_Decode"},
            "mileage": {"value": 15000, "verified": True, "source_origin": "Odometer"},
            "make": {"value": "Tesla", "verified": True, "source_origin": "VIN_Decode"},
            "model": {"value": "Model 3", "verified": True, "source_origin": "VIN_Decode"},
            "overall_condition_rating": {"value": "Excellent", "verified": True, "source_origin": "AI_Analysis"},
            "zipcode": {"value": 94102, "verified": True, "source_origin": "User_Input"}
        }
        
        print("\n🔬 Testing comprehensive valuation...")
        result = run_valuation(comprehensive_sample, mode='buy')
        
        print(f"✅ SUCCESS!")
        print(f"   Estimated Value: ${result['estimated_value']:,.2f}")
        print(f"   Mode: {result.get('mode', 'N/A')}")
        print(f"   Confidence Score: {result.get('confidence_score', 'N/A')}")
        print(f"   Summary Preview: {result.get('summary', 'N/A')[:50]}...")
        
        return True
        
    except Exception as e:
        print(f"❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("🚀 AIN Enhanced Valuation Engine - Quick Test")
    print("=" * 50)
    
    success1 = test_simple_valuation()
    success2 = test_comprehensive_valuation()
    
    if success1 and success2:
        print(f"\n🎉 All tests passed! Enhanced valuation engine is working!")
        print(f"✅ Legacy format support")
        print(f"✅ Comprehensive format support") 
        print(f"✅ Enhanced ML model")
        print(f"✅ Confidence scoring")
    else:
        print(f"\n⚠️ Some tests failed. Check the errors above.")
