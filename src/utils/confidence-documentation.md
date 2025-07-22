
# Confidence Scoring System Documentation

This document explains how the confidence scoring system works in the Car Detective valuation engine.

## Overview

The confidence score represents our level of certainty in the vehicle valuation estimate. It ranges from 0-100%, with higher scores indicating greater confidence in the accuracy of the valuation.

## Scoring Factors

The confidence score is calculated based on several key factors:

### 1. VIN Accuracy (30% weight)
- **Valid VIN**: A valid 17-character VIN increases confidence
- **Exact VIN Match**: Finding an exact match for the VIN in market listings provides the highest confidence
- **VIN Decoding**: Successfully decoding make/model/year from VIN increases confidence

### 2. Market Data (40% weight)
- **Listing Count**: More market listings of comparable vehicles increases confidence
- **Price Range Spread**: Tighter price ranges indicate more consistent market data
- **Exact Match**: Finding the exact vehicle (by VIN) in listings provides highest confidence
- **Listing Age**: Recent listings provide better confidence than older ones

### 3. Fuel Economy Data (15% weight)
- **Make/Model Match**: Having the correct make/model improves fuel economy estimates
- **Year Specificity**: Year-specific fuel economy data increases confidence
- **EPA Data**: Direct EPA data provides highest confidence

### 4. MSRP Quality (15% weight)
- **Trim-Specific Data**: Having trim-level MSRP data increases confidence
- **Standard Pricing**: Standard manufacturer pricing provides better confidence
- **Data Source**: Direct manufacturer data provides highest confidence

## Confidence Levels

- **High Confidence (85-100%)**: Comprehensive data with exact matches or multiple high-quality data points
- **Good Confidence (70-84%)**: Reliable data with some strong market indicators
- **Moderate Confidence (50-69%)**: Limited data or mixed quality indicators
- **Low Confidence (0-49%)**: Insufficient data to provide a highly accurate valuation

## Improving Confidence

Users can improve confidence scores by:

1. Providing a valid VIN
2. Entering accurate mileage information
3. Specifying the vehicle's condition
4. Providing ZIP code for regional market data
5. Completing follow-up questions about the vehicle
6. Uploading vehicle photos (premium feature)

## Technical Implementation

The confidence scoring system uses a weighted algorithm that evaluates data quality across multiple dimensions and calculates a normalized score.

The system is designed to be transparent, with detailed breakdowns of confidence factors available to help users understand the valuation process.
