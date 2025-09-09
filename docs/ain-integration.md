# AIN API Integration

## Overview

This document describes the integration with the AIN (Automotive Intelligence Network) API for vehicle valuations. The integration is designed to be non-destructive and flag-gated, allowing for seamless switching between local and external API-based valuations.

## Architecture

### Components

1. **Thin Client** (`src/integrations/valuationClient.ts`)
   - Handles HTTP communication with AIN API
   - Includes timeout and CORS configuration
   - Type-safe interface definitions

2. **Switch Function** (`src/services/valuation/computeValuation.ts`)
   - Routes requests to AIN or local engine based on feature flag
   - Handles input/output format adaptation
   - Provides per-request fallback to local engine

3. **Modified Call Sites** (4 locations)
   - `src/contexts/ValuationContext.tsx`
   - `src/components/test/ValuationEngineTestComponent.tsx`
   - `src/hooks/useCorrectedValuation.ts`
   - `src/hooks/useFollowUpForm.ts`

## Configuration

### Environment Variables

```bash
USE_AIN_VALUATION=false          # Feature flag (default: false)
VITE_AIN_VALUATION_URL=https://api.ain.ai  # AIN API base URL
VITE_AIN_API_KEY=***            # AIN API authentication key
VITE_AIN_TIMEOUT_MS=30000       # Request timeout (default: 30s)
```

### Feature Flag Behavior

- `false` (default): Uses local valuation engine
- `true`: Uses AIN API with fallback to local engine on failure

## API Contract

### Input Format (AIN)
```typescript
interface AINValuationInput {
  vin?: string;
  make?: string; 
  model?: string; 
  year?: number;
  mileage: number; 
  condition: "poor"|"fair"|"good"|"very_good"|"excellent";
  zip?: string; 
  trim?: string;
}
```

### Output Format (AIN)
```typescript
interface AINValuationResult {
  estimated_value: number; 
  confidence_score: number; 
  basis?: unknown;
}
```

## Error Handling

1. **Timeout**: Requests abort after configured timeout (default: 30s)
2. **HTTP Errors**: 4xx/5xx responses throw descriptive errors
3. **Network Issues**: Automatic fallback to local engine
4. **CORS Issues**: Proper CORS mode and headers configured

## Monitoring & Observability

### Performance Telemetry
Every valuation call logs timing information:
```javascript
console.info("ain.val.ms", duration_ms, { via: USE_AIN_VALUATION });
```

### Error Tracking
- API errors are logged with context
- Fallback usage is tracked
- Network timeouts are captured

## Testing

### Contract Test
`src/__tests__/ain.contract.test.ts` validates:
- Expected response format
- Error handling
- Timeout behavior

### Running Tests
```bash
npm test ain.contract.test.ts
```

## Rollout Strategy

### Stage 1: Staging Validation
1. Deploy with `USE_AIN_VALUATION=false`
2. Verify all existing flows work
3. Set `USE_AIN_VALUATION=true` in staging
4. Validate AIN API integration

### Stage 2: Canary Release
1. Enable for small percentage of production traffic
2. Monitor performance metrics and error rates
3. Validate CORS configuration with production domain

### Stage 3: Full Rollout
1. Gradually increase percentage
2. Monitor `ain.val.ms` timing metrics
3. Watch for increased error rates

### Rollback Plan
- Set `USE_AIN_VALUATION=false`
- No code deployment required
- Immediate fallback to local engine

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure AIN API allowlists your domain
   - Verify preflight OPTIONS requests succeed

2. **Timeout Issues**
   - Check network connectivity
   - Adjust `VITE_AIN_TIMEOUT_MS` if needed
   - Monitor for slow API responses

3. **Authentication Errors**
   - Verify `VITE_AIN_API_KEY` is correct
   - Check API key permissions and rate limits

4. **Format Mismatches**
   - Adapter functions handle most differences
   - Check console for conversion warnings

### Debug Mode
Set browser console to verbose to see:
- Input/output format conversions
- API timing information
- Fallback usage patterns

## Security Considerations

- API key is stored as environment variable
- No sensitive data logged in production
- Request/response bodies excluded from logs
- CORS properly configured for authorized domains

## Future Enhancements

1. **Advanced Retry Logic**: Exponential backoff for transient failures
2. **Circuit Breaker**: Automatic local fallback on repeated failures  
3. **A/B Testing**: Split traffic for performance comparison
4. **Enhanced Metrics**: Detailed performance and accuracy tracking
5. **Caching**: Response caching for identical requests