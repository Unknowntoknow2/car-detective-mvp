-- Update the valuation with correct JSONB format for valuation_notes
UPDATE valuations 
SET 
  estimated_value = 15400,
  confidence_score = 85,
  price_range_low = 14500,
  price_range_high = 17500,
  valuation_notes = jsonb_build_array(
    '🔍 ## 📊 Valuation Breakdown

- **Base Value:** $28,700 (estimated MSRP)
- **Depreciation:** $-11,760 (2019 model year (6 years old))  
- **Mileage:** $-2,540 (122,615 miles - adjusted based on market data)
- **Condition:** +$0 (good condition)
- **Market Adjustment:** +$1,000 (strong local market demand)

### 🎯 Final Value: **$15,400**

### 🤖 Confidence: 85%

**Reasoning:** High confidence based on 4 comparable market listings in your local area.

---

**Data Sources:**
- VIN Decode (Vehicle Specifications)
- Market Analysis (4 comparable listings)  
- Regional Market Demand
- Condition Assessment',
    'Market data: 4 comparable listings found - average price $16,110 in Sacramento area'
  ),
  data_source = jsonb_build_object(
    'marketListings', 4,
    'calculationMethod', 'market_based_with_adjustments',
    'dataSourcesUsed', ARRAY['market_listings', 'vin_decode', 'regional_analysis'],
    'confidenceBreakdown', ARRAY['Market data: 4 listings (40%)', 'Vehicle specs: VIN decoded (25%)', 'Regional factors (20%)', 'Condition assessment (15%)'],
    'timestamp', extract(epoch from now())
  ),
  adjustments = jsonb_build_array(
    jsonb_build_object('factor', 'Depreciation', 'impact', -11760, 'source', 'unified_engine', 'timestamp', now(), 'description', '2019 model year (6 years old)'),
    jsonb_build_object('factor', 'Mileage', 'impact', -2540, 'source', 'market_adjusted', 'timestamp', now(), 'description', '122,615 miles - adjusted based on market data'),
    jsonb_build_object('factor', 'Condition', 'impact', 0, 'source', 'unified_engine', 'timestamp', now(), 'description', 'good condition'),
    jsonb_build_object('factor', 'Market Adjustment', 'impact', 1000, 'source', 'market_data', 'timestamp', now(), 'description', 'Strong local market demand in Sacramento area')
  )
WHERE id = '5c0cecfd-b51d-4bf9-806e-eb1c645b1a4b';