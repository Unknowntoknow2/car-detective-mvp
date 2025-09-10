# Unified VIN Decoder Service

A comprehensive, unified VIN decoding service that consolidates all VIN decoding logic with robust fallback handling and comprehensive error management.

## 🎯 Overview

This service replaces multiple fragmented VIN decoder implementations with a single, reliable service that:
- **Primary**: Uses Supabase edge function for fast, cached responses
- **Fallback**: Direct NHTSA VPIC API calls when edge function fails
- **Validation**: Built-in VIN format and checksum validation
- **Categorization**: Organizes decoded data into logical categories
- **TypeScript**: Full type support with comprehensive interfaces

## 🚀 Quick Start

```typescript
import { decodeVin, validateVIN } from './services/unifiedVinDecoder';

// Basic usage
const vin = '1HGBH41JXMN109186';
const validation = validateVIN(vin);

if (validation.valid) {
  const result = await decodeVin(vin);
  console.log(result.categories.identity.make); // "HONDA"
  console.log(result.categories.identity.model); // "Accord"
}
```

## 📋 Core Features

### 🔍 VIN Validation
```typescript
import { validateVIN, isValidVinFormat } from './services/vinValidation';

// Comprehensive validation with checksum
const validation = validateVIN('1HGBH41JXMN109186');
// Returns: { valid: true, details: { format: true, checksum: true, ... } }

// Quick format check
const isValid = isValidVinFormat('1HGBH41JXMN109186'); // true
```

### 🔄 Unified Decoding
```typescript
import { decodeVin, VINDecodeError } from './services/unifiedVinDecoder';

try {
  const result = await decodeVin(vin, {
    timeout: 15000,      // 15 second timeout
    retries: 3,          // Retry on failure
    forceDirectAPI: false // Try edge function first
  });
  
  // Access categorized data
  const identity = result.categories.identity;
  const powertrain = result.categories.powertrain;
  const manufacturing = result.categories.manufacturing;
  
} catch (error) {
  if (error instanceof VINDecodeError) {
    console.error(`${error.code}: ${error.message}`);
  }
}
```

### 📊 Response Structure

```typescript
interface DecodedVinData {
  raw: Record<string, string>;           // All raw NHTSA fields
  categories: {
    identity: {                          // Vehicle identification
      make: string;
      model: string;
      modelYear: string;
      trim: string;
      bodyClass: string;
      // ...
    };
    powertrain: {                        // Engine & drivetrain
      engineCylinders: string;
      fuelTypePrimary: string;
      driveType: string;
      transmissionStyle: string;
      // ...
    };
    manufacturing: {                     // Manufacturing details
      manufacturer: string;
      plantCountry: string;
      plantCity: string;
      // ...
    };
    safety: {                           // Safety features
      abs: string;
      esc: string;
      tpms: string;
      // ...
    };
    specifications: {                    // Technical specs
      doors: string;
      seats: string;
      gvwr: string;
      // ...
    };
  };
  metadata: {
    source: 'SUPABASE_EDGE' | 'NHTSA_DIRECT';
    timestamp: string;
    success: boolean;
    errorCode?: string;
    errorText?: string;
  };
}
```

## 🔄 Migration from Legacy Code

### Backwards Compatibility
```typescript
import { legacyDecodeVin } from './services/vinMigration';

// Drop-in replacement for old vinDecoder.js
const legacyResult = await legacyDecodeVin(vin);
// Returns: { make, model, modelYear, trim, ... } - same as before
```

### Enhanced Usage
```typescript
import { enhancedDecodeVin } from './services/vinMigration';

const result = await enhancedDecodeVin(vin);
if (result.success) {
  // Full categorized data
  const fullData = result.data;
  // Legacy format for compatibility
  const legacyData = result.legacy;
}
```

## 🧪 Testing & Examples

```typescript
import { VinExamples } from './services/vinExamples';

// Run all examples
await VinExamples.basic();           // Basic decoding
await VinExamples.advanced();        // Advanced options
await VinExamples.fallback();        // Test fallback behavior
await VinExamples.batch();           // Batch processing
await VinExamples.errorHandling();   // Error scenarios
```

## 🛠️ Error Handling

```typescript
import { VINDecodeError } from './services/unifiedVinDecoder';

try {
  const result = await decodeVin(vin);
} catch (error) {
  if (error instanceof VINDecodeError) {
    switch (error.code) {
      case 'VALIDATION_ERROR':
        // Invalid VIN format
        break;
      case 'TIMEOUT_ERROR':
        // Request timed out
        break;
      case 'ALL_ENDPOINTS_FAILED':
        // Both edge function and direct API failed
        break;
      case 'NETWORK_ERROR':
        // Network connectivity issues
        break;
    }
  }
}
```

## ⚙️ Configuration

### Environment Variables
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
```

### Default Options
```typescript
const defaultOptions = {
  timeout: 10000,        // 10 second timeout
  retries: 2,            // Retry twice on failure
  forceDirectAPI: false  // Try edge function first
};
```

## 🔗 API Endpoints

### Primary: Supabase Edge Function
- **URL**: `${SUPABASE_URL}/functions/v1/decode-vin`
- **Method**: POST
- **Auth**: None required (public function)
- **Benefits**: Faster, cached responses

### Fallback: Direct NHTSA API
- **URL**: `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/{vin}?format=json`
- **Method**: GET
- **Auth**: None required
- **Benefits**: Always available, authoritative source

## 📁 File Structure

```
src/services/
├── unifiedVinDecoder.ts    # Main unified decoder service
├── vinValidation.ts        # VIN format & checksum validation
├── vinMigration.ts         # Migration helpers & compatibility
├── vinExamples.ts          # Usage examples & testing
└── index.ts               # Unified exports
```

## 🚀 Migration Checklist

- [ ] Remove old VIN decoder files
- [ ] Update imports to use unified service
- [ ] Test with sample VINs
- [ ] Update error handling
- [ ] Verify environment variables
- [ ] Test fallback behavior
- [ ] Update documentation

## 🔧 Troubleshooting

### Common Issues

1. **Import errors**: Ensure TypeScript can resolve modules
2. **Timeout errors**: Increase timeout for slow networks
3. **Auth errors**: Verify Supabase edge function is public
4. **Validation errors**: Check VIN format (17 chars, no I/O/Q)

### Debug Mode
```typescript
// Enable debug logging
const result = await decodeVin(vin);
console.log('Source:', result.metadata.source);
console.log('Timestamp:', result.metadata.timestamp);
```

## 📈 Performance

- **Edge function**: ~200-500ms (cached responses)
- **Direct NHTSA**: ~1-3 seconds (depending on network)
- **Validation**: <1ms (local computation)
- **Fallback**: Automatic on any edge function failure

## 🛡️ Security

- No sensitive data logged
- VIN validation prevents injection attacks
- Public APIs only (no API keys required)
- Timeout protection against hanging requests
