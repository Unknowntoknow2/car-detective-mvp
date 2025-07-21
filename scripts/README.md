# Valuation Pipeline CLI Test Runner

This CLI script allows engineers to test the valuation pipeline manually and debug integration issues.

## Installation

First, install the required dependency:
```bash
npm install tsx --save-dev
```

## Usage

### Basic Usage
```bash
npx tsx scripts/valuationTestRunner.ts <VIN> <ZIP>
```

### Advanced Usage
```bash
npx tsx scripts/valuationTestRunner.ts <VIN> <ZIP> [options]
```

## Options

- `--mileage=<number>` - Vehicle mileage (default: 75000)
- `--condition=<string>` - Vehicle condition: excellent|good|fair|poor (default: good)
- `--user-id=<string>` - User ID for premium features
- `--premium` - Enable premium features
- `--verbose` - Enable verbose logging and show detailed market listings
- `--force-new` - Force new valuation (skip cache)

## Examples

### Test 2021 Toyota Highlander
```bash
npx tsx scripts/valuationTestRunner.ts JTDKARFP5M3042123 90210
```

### Test with specific conditions
```bash
npx tsx scripts/valuationTestRunner.ts JTDKARFP5M3042123 90210 --condition=excellent --mileage=45000
```

### Test with premium features and verbose output
```bash
npx tsx scripts/valuationTestRunner.ts JTDKARFP5M3042123 90210 --premium --verbose
```

### Test with user ID
```bash
npx tsx scripts/valuationTestRunner.ts JTDKARFP5M3042123 90210 --user-id=123e4567-e89b-12d3-a456-426614174000
```

## Output Sections

### Test Inputs
Shows the VIN, ZIP, mileage, condition, and other test parameters.

### Valuation Results
- **Final Value**: The computed market value
- **Confidence**: Confidence percentage (25-98%)
- **Base Value**: Starting MSRP value
- **Market Status**: success/fallback/error
- **Listing Count**: Number of market listings found

### Vehicle Details
Decoded vehicle information including year, make, model, trim, fuel type, and MSRP.

### Value Adjustments
Breakdown of all adjustments applied:
- Depreciation
- Mileage adjustment
- Condition adjustment
- Fuel type impact
- Package adjustments
- Market anchoring (if applicable)

### Market Analysis
If market listings are found:
- Price range of comparable listings
- Market spread and volatility
- Source quality assessment

### Data Sources
List of data sources used in the valuation.

### Diagnostic Information
- Data quality assessment
- Real vs synthetic listings count
- MSRP source (database vs estimated)
- Confidence factors analysis

## Debugging Integration Issues

This script is specifically designed to help debug the integration issues identified in the valuation pipeline:

### MSRP Integration
Look for:
- `[MSRP DEBUG]` logs showing database lookup results
- Base Value source (msrp_db_lookup vs estimated_msrp)
- Whether MSRP > $30,000 (indicates successful database lookup)

### Market Search Integration
Look for:
- `[MARKET_SEARCH DEBUG]` logs showing edge function calls
- Market listings count (should be > 0 for success)
- Real vs synthetic listings breakdown
- Market search status (success vs fallback)

### Confidence Calculation
Look for:
- `[CONFIDENCE DEBUG]` logs showing input parameters
- Confidence caps based on data quality
- Real listings count impact on confidence

## Expected vs Actual Results

For a **2021 Toyota Highlander** test:

**Expected (working):**
- MSRP: ~$46,910 (from database)
- Market Listings: 3-5 real listings
- Confidence: 75-85%
- Final Value: $35,000-$36,000

**Current (broken):**
- MSRP: $30,800 (estimated fallback)
- Market Listings: 0 real listings
- Confidence: 40% (capped due to limited data)
- Final Value: $22,920

## Troubleshooting

If you see consistent failures:

1. **Database Connection Issues**: Check Supabase credentials
2. **Edge Function Failures**: Check `openai-web-search` function logs
3. **VIN Decode Failures**: Check VIN format and decode service
4. **Low Confidence**: Usually indicates missing market data

Run with `--verbose` flag to see detailed debugging information.