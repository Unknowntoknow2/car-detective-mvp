"""
Example Usage and Testing Scripts for Video-Enhanced Vehicle Valuation

This module demonstrates how to use the AIN Valuation Engine with video analysis
capabilities. It includes examples for different integration scenarios and
comprehensive testing of the video analysis features.

Use Cases Demonstrated:
1. Traditional valuation without video
2. Video-enhanced valuation with AI analysis
3. Batch processing with mixed video/non-video requests
4. Error handling and fallback scenarios
5. API integration examples

Author: AIN Engineering Team
Date: 2025-08-05
Version: 1.0
"""

import requests
import json
import time
from typing import Dict, List, Any
import asyncio

# API Configuration
API_BASE_URL = "http://localhost:5000/api/v1"

def example_traditional_valuation():
    """Example: Traditional valuation without video analysis"""
    print("🚗 Example 1: Traditional Vehicle Valuation")
    print("=" * 50)
    
    vehicle_data = {
        "year": 2020,
        "make": "Toyota",
        "model": "Camry",
        "mileage": 45000,
        "condition": "Good",
        "zipcode": 94103,
        "enable_video_analysis": False  # Explicitly disable video
    }
    
    try:
        response = requests.post(f"{API_BASE_URL}/valuations", json=vehicle_data)
        result = response.json()
        
        if response.status_code == 200:
            print(f"✅ Valuation successful!")
            print(f"   Vehicle: {vehicle_data['year']} {vehicle_data['make']} {vehicle_data['model']}")
            print(f"   Estimated Value: ${result['estimated_value']:,.2f}")
            print(f"   Base Value: ${result['base_value']:,.2f}")
            print(f"   Confidence: {result['value_confidence']:.1%}")
            print(f"   Video Analysis: {result['analysis_metadata']['has_video_analysis']}")
            print(f"   Summary: {result['summary'][:100]}...")
        else:
            print(f"❌ Error: {result}")
            
    except Exception as e:
        print(f"❌ Exception: {e}")
    
    print("\n")

def example_video_enhanced_valuation():
    """Example: Video-enhanced valuation with AI analysis"""
    print("🎥 Example 2: Video-Enhanced Vehicle Valuation")
    print("=" * 50)
    
    vehicle_data = {
        "year": 2019,
        "make": "Honda",
        "model": "Civic",
        "mileage": 32000,
        "condition": "Excellent",
        "zipcode": 10001,
        "video_analysis": {
            "video_url": "https://example.com/vehicle-inspection-video.mp4",
            "focus_areas": ["Exterior", "Interior", "Engine"],
            "analysis_priority": "Standard"
        }
    }
    
    try:
        # Use the dedicated video endpoint
        response = requests.post(f"{API_BASE_URL}/valuations/video", json=vehicle_data)
        result = response.json()
        
        if response.status_code == 200:
            print(f"✅ Video valuation successful!")
            print(f"   Vehicle: {vehicle_data['year']} {vehicle_data['make']} {vehicle_data['model']}")
            print(f"   Base Value: ${result['base_value']:,.2f}")
            print(f"   Final Value: ${result['estimated_value']:,.2f}")
            print(f"   Value Adjustment: ${result['estimated_value'] - result['base_value']:+,.2f}")
            print(f"   Overall Confidence: {result['value_confidence']:.1%}")
            
            # Video analysis details
            if result.get('video_analysis'):
                video = result['video_analysis']
                if video['status'] == 'Success':
                    ai_insights = video['ai_insights']
                    print(f"\n   🔍 Video Analysis Results:")
                    print(f"     - Overall Condition: {ai_insights['overall_condition_score']}/100")
                    print(f"     - AI Confidence: {ai_insights['confidence_score']:.1%}")
                    print(f"     - Issues Detected: {len(ai_insights['detected_issues'])}")
                    
                    if ai_insights['detected_issues']:
                        print(f"     - Issues: {', '.join(ai_insights['detected_issues'][:3])}")
                    
                    detailed = video['detailed_analysis']
                    print(f"     - Exterior Score: {detailed['exterior']['condition_score']}/100")
                    print(f"     - Interior Score: {detailed['interior']['condition_score']}/100")
                    print(f"     - Mechanical Score: {detailed['mechanical']['condition_score']}/100")
                else:
                    print(f"   ⚠️ Video Analysis Failed: {video.get('error', 'Unknown error')}")
            
            print(f"\n   📝 Summary: {result['summary'][:150]}...")
        else:
            print(f"❌ Error: {result}")
            
    except Exception as e:
        print(f"❌ Exception: {e}")
    
    print("\n")

def example_batch_processing():
    """Example: Batch processing with mixed video/non-video requests"""
    print("📦 Example 3: Batch Processing")
    print("=" * 50)
    
    vehicles = [
        {
            "year": 2021,
            "make": "Tesla",
            "model": "Model 3",
            "mileage": 15000,
            "condition": "Excellent",
            "zipcode": 90210
        },
        {
            "year": 2018,
            "make": "BMW",
            "model": "330i",
            "mileage": 55000,
            "condition": "Good",
            "zipcode": 60601,
            "video_analysis": {
                "video_url": "https://example.com/bmw-inspection.mp4"
            },
            "enable_video_analysis": True
        },
        {
            "year": 2020,
            "make": "Ford",
            "model": "F-150",
            "mileage": 40000,
            "condition": "Fair",
            "zipcode": 30309
        }
    ]
    
    try:
        response = requests.post(f"{API_BASE_URL}/valuations/batch", json={"vehicles": vehicles})
        result = response.json()
        
        if response.status_code == 200:
            print(f"✅ Batch processing completed!")
            print(f"   Total Vehicles: {result['total_vehicles']}")
            print(f"   Successful: {result['successful_valuations']}")
            print(f"   Failed: {result['failed_valuations']}")
            
            print(f"\n   📊 Results:")
            for i, valuation in enumerate(result['results']):
                if 'error' not in valuation:
                    vehicle = vehicles[i]
                    has_video = valuation['analysis_metadata']['has_video_analysis']
                    video_icon = "🎥" if has_video else "📊"
                    print(f"     {video_icon} {vehicle['year']} {vehicle['make']} {vehicle['model']}: ${valuation['estimated_value']:,.2f}")
                else:
                    print(f"     ❌ Vehicle {i+1}: {valuation['error']}")
        else:
            print(f"❌ Batch Error: {result}")
            
    except Exception as e:
        print(f"❌ Exception: {e}")
    
    print("\n")

def example_comprehensive_video_data():
    """Example: Comprehensive video data structure"""
    print("🎬 Example 4: Comprehensive Video Data Structure")
    print("=" * 50)
    
    comprehensive_vehicle = {
        "year": 2022,
        "make": "Audi",
        "model": "A4",
        "mileage": 8000,
        "condition": "Excellent",
        "zipcode": 02101,
        "video_analysis": {
            "video_url": "https://s3.amazonaws.com/ain-videos/audi-a4-inspection-2024.mp4",
            "upload_timestamp": "2024-01-15T10:30:00Z",
            "analysis_priority": "High",
            "focus_areas": ["Exterior", "Interior", "Engine", "Undercarriage"],
            "user_notes": "Vehicle has been garage-kept, recent maintenance completed",
            "video_metadata": {
                "duration_seconds": 180,
                "file_size_mb": 85,
                "resolution": "1920x1080",
                "format": "mp4"
            },
            "quality_requirements": {
                "min_resolution": "720p",
                "required_areas": ["front", "rear", "sides", "interior", "engine_bay"],
                "lighting_check": True
            }
        },
        "additional_data": {
            "service_records": "Available",
            "accident_history": "Clean",
            "previous_owners": 1,
            "location_history": ["California"]
        }
    }
    
    try:
        response = requests.post(f"{API_BASE_URL}/valuations/video", json=comprehensive_vehicle)
        result = response.json()
        
        if response.status_code == 200:
            print(f"✅ Comprehensive valuation successful!")
            print(f"   Vehicle: {comprehensive_vehicle['year']} {comprehensive_vehicle['make']} {comprehensive_vehicle['model']}")
            print(f"   Final Valuation: ${result['estimated_value']:,.2f}")
            
            # Show the power of video integration
            if result.get('video_analysis') and result['video_analysis']['status'] == 'Success':
                video = result['video_analysis']
                print(f"\n   🎯 Video Analysis Highlights:")
                print(f"     - Processing Time: {video.get('processing_time_seconds', 'N/A')} seconds")
                print(f"     - Analysis ID: {video['analysis_id']}")
                
                value_impact = video['estimated_value_impact']
                print(f"\n   💰 Value Impact Analysis:")
                print(f"     - Adjustment: {value_impact['estimated_adjustment_percentage']:+.1f}%")
                
                if value_impact['positive_factors']:
                    print(f"     - Positive Factors: {', '.join(value_impact['positive_factors'])}")
                if value_impact['negative_factors']:
                    print(f"     - Concerns: {', '.join(value_impact['negative_factors'])}")
        else:
            print(f"❌ Error: {result}")
            
    except Exception as e:
        print(f"❌ Exception: {e}")
    
    print("\n")

def test_api_health():
    """Test API health and capabilities"""
    print("🏥 API Health Check")
    print("=" * 30)
    
    try:
        response = requests.get(f"{API_BASE_URL}/health")
        health = response.json()
        
        if response.status_code == 200:
            print(f"✅ API Status: {health['status']}")
            print(f"   Version: {health['version']}")
            print(f"   Timestamp: {health['timestamp']}")
            print(f"   Features:")
            for feature, enabled in health['features'].items():
                status = "✅" if enabled else "❌"
                print(f"     {status} {feature.replace('_', ' ').title()}")
        else:
            print(f"❌ Health check failed: {health}")
            
    except Exception as e:
        print(f"❌ Exception: {e}")
    
    print("\n")

def run_all_examples():
    """Run all examples in sequence"""
    print("🚀 AIN Video-Enhanced Valuation Engine - Examples")
    print("=" * 60)
    print("Testing video analysis integration and API capabilities\n")
    
    # Check API health first
    test_api_health()
    
    # Run examples
    example_traditional_valuation()
    example_video_enhanced_valuation()
    example_batch_processing()
    example_comprehensive_video_data()
    
    print("🎉 All examples completed!")
    print("Ready for production integration!")

if __name__ == "__main__":
    # Check if API server is running
    try:
        response = requests.get(f"{API_BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            run_all_examples()
        else:
            print("❌ API server not responding correctly")
            print("   Please start the server with: python src/api/enhanced_valuation_api.py")
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to API server")
        print("   Please start the server with: python src/api/enhanced_valuation_api.py")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
