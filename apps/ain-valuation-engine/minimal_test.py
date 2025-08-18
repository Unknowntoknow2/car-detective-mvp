#!/usr/bin/env python3
"""
Minimal test to check what's working
"""

print("Testing imports...")

try:
    import pandas as pd
    print("✅ pandas")
except Exception as e:
    print(f"❌ pandas: {e}")

try:
    import numpy as np
    print("✅ numpy")
except Exception as e:
    print(f"❌ numpy: {e}")

try:
    from sklearn.ensemble import GradientBoostingRegressor
    print("✅ sklearn")
except Exception as e:
    print(f"❌ sklearn: {e}")

try:
    import sys
    import os
    sys.path.append('/workspaces/ain-valuation-engine')
    from val_engine.model import train_model, predict_price_comprehensive
    print("✅ model module")
except Exception as e:
    print(f"❌ model module: {e}")
    import traceback
    traceback.print_exc()

print("\nTesting model directly...")
try:
    import sys
    import os
    sys.path.append('/workspaces/ain-valuation-engine')
    from val_engine.model import train_model, predict_price_comprehensive, engineer_comprehensive_features
    import pandas as pd
    
    # Create minimal training data
    training_data = pd.DataFrame({
        'year': [2020, 2019, 2021],
        'mileage': [25000, 35000, 15000],
        'make': ['Toyota', 'Honda', 'Tesla'],
        'model': ['Camry', 'Civic', 'Model 3'],
        'condition': ['Good', 'Excellent', 'Excellent'],
        'zipcode': [90210, 10001, 94102],
        'price': [22000, 18000, 45000]
    })
    
    print("Training model...")
    train_model(training_data, use_enhanced_features=True)
    print("✅ Model trained")
    
    # Test comprehensive prediction
    test_vehicle = {
        'year': {'value': 2020, 'verified': True, 'source_origin': 'VIN_Decode'},
        'mileage': {'value': 30000, 'verified': True, 'source_origin': 'Odometer'},
        'make': {'value': 'Toyota', 'verified': True, 'source_origin': 'VIN_Decode'},
        'model': {'value': 'Camry', 'verified': True, 'source_origin': 'VIN_Decode'},
        'overall_condition_rating': {'value': 'Good', 'verified': True, 'source_origin': 'Manual_Entry'},
        'zipcode': {'value': 90210, 'verified': True, 'source_origin': 'User_Input'}
    }
    
    print("Testing prediction...")
    result = predict_price_comprehensive(test_vehicle)
    print(f"✅ Prediction: ${result['predicted_price']:,.2f}")
    print(f"   Confidence: {result['confidence_score']:.1%}")
    
except Exception as e:
    print(f"❌ Model test failed: {e}")
    import traceback
    traceback.print_exc()

print("\n🏁 Test complete")
