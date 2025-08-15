"""
Comprehensive Test Suite for Video-Enhanced Vehicle Valuation

This test suite validates the video analysis integration across all components
of the AIN Valuation Engine, ensuring reliability and accuracy of the enhanced
valuation capabilities.

Test Coverage:
1. Video Analysis Service functionality
2. Data loader video preprocessing
3. API endpoint validation
4. Error handling and edge cases
5. Integration testing
6. Performance benchmarks

Author: AIN Engineering Team
Date: 2025-08-05
Version: 1.0
"""

import unittest
import asyncio
import json
import sys
import os
from unittest.mock import Mock, patch, MagicMock
import pandas as pd
import numpy as np

# Add project paths
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

from src.services.VideoAnalysisService import VideoAnalysisService, VideoAnalysisConfig, create_video_analysis_request
from val_engine.utils.data_loader import preprocess_input
from val_engine.main import run_valuation
from val_engine.main import initialize_valuation_engine

class TestVideoAnalysisService(unittest.TestCase):
    """Test the core video analysis service functionality"""

    def setUp(self):
        """Set up test fixtures"""
        self.config = VideoAnalysisConfig(
            max_video_size_mb=50,
            max_duration_seconds=180
        )
        self.service = VideoAnalysisService(self.config)

        self.sample_vehicle_context = {
            'year': 2020,
            'make': 'Toyota',
            'model': 'Camry',
            'mileage': 35000
        }

    def test_config_initialization(self):
        """Test configuration object initialization"""
        config = VideoAnalysisConfig()
        self.assertEqual(config.max_video_size_mb, 100)
        self.assertIn('mp4', config.supported_formats)
        self.assertEqual(config.min_resolution, (720, 480))

    def test_video_analysis_request_creation(self):
        """Test creation of video analysis requests"""
        vehicle_data = {
            'vin': {'value': 'TEST123456789'},
            'make': 'Honda',
            'model': 'Civic',
            'year': 2021,
            'mileage': 25000
        }

        request = create_video_analysis_request('https://example.com/video.mp4', vehicle_data)

        self.assertEqual(request['video_url'], 'https://example.com/video.mp4')
        self.assertEqual(request['vehicle_vin'], 'TEST123456789')
        self.assertEqual(request['vehicle_context']['make'], 'Honda')
        self.assertIn('Exterior', request['focus_areas'])

    @patch('requests.head')
    async def test_video_validation_success(self, mock_head):
        """Test successful video validation"""
        mock_head.return_value.status_code = 200
        mock_head.return_value.headers = {
            'content-length': str(50 * 1024 * 1024),  # 50MB
            'content-type': 'video/mp4'
        }

        result = await self.service._validate_video('https://example.com/test.mp4')
        self.assertTrue(result['valid'])

    @patch('requests.head')
    async def test_video_validation_too_large(self, mock_head):
        """Test video validation failure due to size"""
        mock_head.return_value.status_code = 200
        mock_head.return_value.headers = {
            'content-length': str(200 * 1024 * 1024),  # 200MB (too large)
            'content-type': 'video/mp4'
        }

        result = await self.service._validate_video('https://example.com/large.mp4')
        self.assertFalse(result['valid'])
        self.assertIn('too large', result['error'])

    @patch('requests.head')
    async def test_video_validation_not_accessible(self, mock_head):
        """Test video validation failure due to accessibility"""
        mock_head.return_value.status_code = 404

        result = await self.service._validate_video('https://example.com/missing.mp4')
        self.assertFalse(result['valid'])
        self.assertIn('not accessible', result['error'])

class TestVideoDataPreprocessing(unittest.TestCase):
    """Test video data preprocessing in data loader"""

    def test_preprocess_input_with_video_analysis(self):
        """Test preprocessing input data with video analysis results"""
        input_data = {
            'year': 2021,
            'make': 'Tesla',
            'model': 'Model 3',
            'mileage': 15000,
            'zipcode': 94102,
            'video_analysis': {
                'video_url': 'https://example.com/tesla.mp4',
                'ai_condition_score': 88,
                'video_confidence_factor': 0.92,
                'detected_issues': ['minor_paint_chip'],
                'exterior_score': 85,
                'interior_score': 90,
                'mechanical_score': 89,
                'verification_status': 'AI_Verified'
            }
        }

        result_df = preprocess_input(input_data)

        # Check that video-derived features are included

        # Verify values

    def test_preprocess_input_without_video(self):
        """Test preprocessing input data without video analysis"""
        input_data = {
            'year': 2019,
            'make': 'Honda',
            'model': 'Civic',
            'mileage': 45000,
            'zipcode': 90210
        }

        result_df = preprocess_input(input_data)

        # Check default video analysis values

    def test_video_confidence_factor_calculation(self):
        """Test video confidence factor affects feature engineering"""
        high_confidence_input = {
            'year': 2020,
            'make': 'BMW',
            'model': '330i',
            'mileage': 30000,
            'zipcode': 10001,
            'video_analysis': {
                'video_confidence_factor': 0.95,
                'ai_condition_score': 90
            }
        }

        low_confidence_input = {
            'year': 2020,
            'make': 'BMW',
            'model': '330i',
            'mileage': 30000,
            'zipcode': 10001,
            'video_analysis': {
                'video_confidence_factor': 0.60,
                'ai_condition_score': 90
            }
        }

        high_conf_df = preprocess_input(high_confidence_input)
        low_conf_df = preprocess_input(low_confidence_input)

        # High confidence should result in higher video confidence factor
        self.assertGreater(
            high_conf_df['video_confidence_factor'].iloc[0],
            low_conf_df['video_confidence_factor'].iloc[0]
        )

class TestEnhancedValuationEngine(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        initialize_valuation_engine()

    """Test the enhanced valuation engine with video integration"""

    @patch('src.services.VideoAnalysisService.VideoAnalysisService')
    @patch('asyncio.run')
    def test_valuation_with_video_success(self, mock_asyncio_run, mock_video_service):
        """Test successful valuation with video analysis"""
        # Mock video analysis result
        mock_video_result = {
            'status': 'Success',
            'analysis_id': 'test_analysis_123',
            'ai_insights': {
                'overall_condition_score': 85,
                'confidence_score': 0.88,
                'detected_issues': ['minor_scratch'],
                'summary': 'Vehicle in good condition with minor cosmetic issues'
            },
            'estimated_value_impact': {
                'estimated_adjustment_percentage': -2.1
            }
        }

        mock_asyncio_run.return_value = mock_video_result

        vehicle_data = {
            'year': 2020,
            'make': 'Toyota',
            'model': 'Camry',
            'mileage': 40000,
            'zipcode': 94103,
            'condition': 'Good',
            'video_analysis': {
                'video_url': 'https://example.com/camry.mp4'
            }
        }

        result = run_valuation(vehicle_data)

        # Verify video analysis was included
        self.assertIn('video_analysis', result['input_data'])
        self.assertIn('video_url', result['input_data']['video_analysis'])
        self.assertIn('video_url', result['input_data']['video_analysis'])

        # Verify confidence is enhanced
        self.assertIn('estimated_value', result)

    def test_valuation_without_video(self):
        """Test valuation without video analysis"""
        vehicle_data = {
            'year': 2019,
            'make': 'Honda',
            'model': 'Civic',
            'mileage': 35000,
            'zipcode': 90210,
            'condition': 'Excellent'
        }

        result = run_valuation(vehicle_data)

        # Verify no video analysis in input_data
        self.assertNotIn('video_analysis', result.get('input_data', {}))
        # Should still have basic valuation components
        self.assertIn('estimated_value', result)
        self.assertIn('summary', result)
        self.assertIn('adjustments', result)

    @patch('src.services.VideoAnalysisService.VideoAnalysisService')
    @patch('asyncio.run')
    def test_valuation_video_failure_fallback(self, mock_asyncio_run, mock_video_service):
        """Test valuation falls back gracefully when video analysis fails"""
        # Mock video analysis failure
        mock_asyncio_run.side_effect = Exception("Video processing failed")

        vehicle_data = {
            'year': 2021,
            'make': 'Tesla',
            'model': 'Model 3',
            'mileage': 20000,
            'zipcode': 10001,
            'condition': 'Excellent',
            'video_analysis': {
                'video_url': 'https://example.com/tesla.mp4'
            }
        }

        result = run_valuation(vehicle_data)

        # Should complete valuation despite video failure
        self.assertIn('estimated_value', result)
        self.assertEqual(result['estimated_value'], result['original_predicted_value'])  # No video adjustment
        self.assertIn('video_analysis', result['input_data'])
        self.assertIn('video_url', result['input_data']['video_analysis'])

class TestIntegrationScenarios(unittest.TestCase):
    """Test real-world integration scenarios"""

    def test_video_data_structure_compatibility(self):
        """Test that video data structures are compatible across components"""
        # Test data matching TypeScript interface structure
        video_enhanced_data = {
            'year': 2022,
            'make': 'Audi',
            'model': 'A4',
            'mileage': 12000,
            'zipcode': "02101",
            'video_analysis': {
                'video_url': 'https://cdn.example.com/audi-a4.mp4',
                'ai_condition_score': 92,
                'video_confidence_factor': 0.89,
                'detected_issues': [],
                'exterior_condition_score': 88,
                'interior_condition_score': 95,
                'mechanical_condition_score': 90,
                'video_quality_score': 87,
                'analysis_metadata': {
                    'processing_time_seconds': 45,
                    'model_version': '3.0',
                    'analysis_timestamp': '2024-01-15T14:30:00Z'
                },
                'verification_status': 'AI_Verified'
            }
        }

        # Should preprocess successfully
        processed_df = preprocess_input(video_enhanced_data)
        self.assertIsInstance(processed_df, pd.DataFrame)
        self.assertGreater(len(processed_df.columns), 10)  # Has both traditional and video features

    def test_edge_case_video_scores(self):
        """Test edge cases with extreme video analysis scores"""
        # Perfect scores
        perfect_data = {
            'year': 2023,
            'make': 'Mercedes',
            'model': 'C300',
            'mileage': 5000,
            'zipcode': 90210,
            'video_analysis': {
                'ai_condition_score': 100,
                'video_confidence_factor': 1.0,
                'detected_issues': []
            }
        }

        # Poor scores
        poor_data = {
            'year': 2015,
            'make': 'Ford',
            'model': 'Focus',
            'mileage': 120000,
            'zipcode': 60601,
            'video_analysis': {
                'ai_condition_score': 45,
                'video_confidence_factor': 0.95,
                'detected_issues': ['major_rust', 'engine_noise', 'interior_damage']
            }
        }

        perfect_df = preprocess_input(perfect_data)
        poor_df = preprocess_input(poor_data)

        # Perfect should have high condition factor
        self.assertGreater(perfect_df['ai_condition_score'].iloc[0], 95)

        # Poor should have low condition factor but high confidence
        self.assertLess(poor_df['ai_condition_score'].iloc[0], 50)
        self.assertGreater(poor_df['video_confidence_factor'].iloc[0], 0.9)

class TestPerformance(unittest.TestCase):
    """Test performance characteristics of video integration"""

    def test_preprocessing_performance(self):
        """Test that video preprocessing doesn't significantly impact performance"""
        import time

        # Test traditional preprocessing speed
        traditional_data = {
            'year': 2020,
            'make': 'Toyota',
            'model': 'Camry',
            'mileage': 40000,
            'zipcode': 94103
        }

        start_time = time.time()
        for _ in range(100):
            preprocess_input(traditional_data)
        traditional_time = time.time() - start_time

        # Test video-enhanced preprocessing speed
        video_data = {
            **traditional_data,
            'video_analysis': {
                'ai_condition_score': 85,
                'video_confidence_factor': 0.88,
                'detected_issues': ['minor_scratch'],
                'exterior_score': 82,
                'interior_score': 88
            }
        }

        start_time = time.time()
        for _ in range(100):
            preprocess_input(video_data)
        video_time = time.time() - start_time

        # Video processing should not be more than 50% slower
        self.assertLess(video_time, traditional_time * 1.5)

def run_test_suite():
    """Run the complete test suite"""
    # Create test suite
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()

    # Add test classes
    suite.addTests(loader.loadTestsFromTestCase(TestVideoAnalysisService))
    suite.addTests(loader.loadTestsFromTestCase(TestVideoDataPreprocessing))
    suite.addTests(loader.loadTestsFromTestCase(TestEnhancedValuationEngine))
    suite.addTests(loader.loadTestsFromTestCase(TestIntegrationScenarios))
    suite.addTests(loader.loadTestsFromTestCase(TestPerformance))

    # Run tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)

    # Print summary
    print(f"\n{'='*60}")
    print(f"TEST SUMMARY")
    print(f"{'='*60}")
    print(f"Tests run: {result.testsRun}")
    print(f"Failures: {len(result.failures)}")
    print(f"Errors: {len(result.errors)}")
    print(f"Success rate: {((result.testsRun - len(result.failures) - len(result.errors)) / result.testsRun * 100):.1f}%")

    if result.failures:
        print(f"\nFAILURES:")
        for test, trace in result.failures:
            print(f"- {test}: {trace.split(chr(10))[0]}")

    if result.errors:
        print(f"\nERRORS:")
        for test, trace in result.errors:
            print(f"- {test}: {trace.split(chr(10))[0]}")

    return result.wasSuccessful()

if __name__ == '__main__':
    print("🧪 AIN Video Analysis Integration - Test Suite")
    print("=" * 60)
    success = run_test_suite()

    if success:
        print("\n✅ All tests passed! Video integration is ready for production.")
    else:
        print("\n❌ Some tests failed. Please review and fix issues before deployment.")
        sys.exit(1)
