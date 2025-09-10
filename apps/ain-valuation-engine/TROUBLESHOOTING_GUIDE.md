# Troubleshooting Guide - AIN Valuation Engine

## Overview

This guide provides step-by-step troubleshooting procedures for common issues encountered with the AIN Valuation Engine. Issues are categorized by severity and include both technical and user-facing problems.

## Quick Diagnostic Checklist

Before diving into specific troubleshooting, run through this quick checklist:

- [ ] Check browser console for JavaScript errors
- [ ] Verify all environment variables are set
- [ ] Confirm API keys are valid and not expired
- [ ] Test network connectivity to external APIs
- [ ] Check Supabase function deployment status
- [ ] Verify build process completes without errors

## Build and Development Issues

### TypeScript Compilation Errors

#### Issue: Build fails with TypeScript errors
```bash
Error: src/components/Component.tsx:45:20 - error TS2322
Type 'string' is not assignable to type 'number'
```

**Resolution Steps:**
1. **Check Type Definitions**
   ```bash
   # Ensure all types are properly imported
   import { VehicleData, ValuationResult } from '@/types/ValuationTypes';
   ```

2. **Verify Interface Compatibility**
   ```typescript
   // Ensure props match interface definitions
   interface ComponentProps {
     data: VehicleData;  // Must match exactly
     onComplete: (result: ValuationResult) => void;
   }
   ```

3. **Fix Common Type Issues**
   ```typescript
   // Convert string to number properly
   const mileage = parseInt(value) || 0;
   
   // Handle optional properties
   const year = vehicleData.year ?? new Date().getFullYear();
   
   // Proper error typing
   } catch (error: unknown) {
     const message = error instanceof Error ? error.message : 'Unknown error';
   }
   ```

#### Issue: Missing type declarations
```bash
Error: Could not find a declaration file for module 'some-package'
```

**Resolution:**
```bash
# Install type definitions
npm install @types/package-name

# Or create custom type declaration
echo "declare module 'package-name';" > src/types/custom.d.ts
```

### Dependency Issues

#### Issue: Package installation failures
```bash
npm ERR! peer dep missing: react@"^18.0.0"
```

**Resolution Steps:**
1. **Clear npm cache**
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Fix peer dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Update conflicting packages**
   ```bash
   npm update
   ```

### Vite Build Issues

#### Issue: Build process hangs or fails
```bash
Error: Could not resolve "./non-existent-file"
```

**Resolution:**
1. **Check import paths**
   ```typescript
   // Use correct path aliases
   import { Component } from '@/components/Component';  // ✓
   import { Component } from '../components/Component'; // ✗
   ```

2. **Verify vite.config.ts**
   ```typescript
   export default defineConfig({
     plugins: [react()],
     resolve: {
       alias: {
         '@': path.resolve(__dirname, './src')
       }
     }
   });
   ```

## API Integration Issues

### VIN Decoding Problems

#### Issue: VIN decode API returns 500 error
```json
{"error": "VIN decode failed", "message": "Network error"}
```

**Diagnostic Steps:**
1. **Test NHTSA API directly**
   ```bash
   curl "https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/1FTEW1CG6HKD46234?format=json"
   ```

2. **Check Supabase function logs**
   ```bash
   supabase functions logs decode-vin
   ```

3. **Verify VIN format**
   ```typescript
   // VIN must be exactly 17 characters
   const isValidVin = /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin);
   ```

**Resolution:**
1. **Redeploy Supabase function**
   ```bash
   supabase functions deploy decode-vin --no-verify-jwt
   ```

2. **Update function code** (if needed)
   ```typescript
   // Add better error handling
   try {
     const response = await fetch(nhtsaUrl, { signal: AbortSignal.timeout(10000) });
     if (!response.ok) {
       throw new Error(`NHTSA API error: ${response.status}`);
     }
   } catch (error) {
     console.error('VIN decode error:', error);
     return new Response(JSON.stringify({ 
       error: 'VIN decode failed', 
       details: error.message 
     }), { status: 500 });
   }
   ```

### Market Data API Issues

#### Issue: Market listings service returns empty results
```json
{"success": true, "data": [], "metadata": {"source": "multiple_sources"}}
```

**Diagnostic Steps:**
1. **Check API keys**
   ```bash
   echo $VITE_AUTOTRADER_API_KEY
   echo $VITE_CARSCOM_API_KEY
   echo $VITE_CARGURUS_API_KEY
   ```

2. **Test individual APIs**
   ```typescript
   // Enable debug logging
   localStorage.setItem('debug', 'true');
   
   // Check browser network tab for failed requests
   ```

3. **Verify mock data fallback**
   ```typescript
   // Should see "mock" in source metadata when APIs fail
   console.log('Market data source:', response.metadata?.source);
   ```

**Resolution:**
1. **Use mock data for development**
   ```typescript
   // Remove API keys to force mock mode
   delete process.env.VITE_AUTOTRADER_API_KEY;
   ```

2. **Fix API authentication**
   ```typescript
   // Check header format for each API
   const headers = {
     'X-API-Key': apiKey,           // Autotrader format
     'Authorization': `Bearer ${apiKey}`, // Cars.com format
   };
   ```

### OpenAI Integration Issues

#### Issue: AI explanations not generating
```javascript
Error: OpenAI API call failed with status 401
```

**Diagnostic Steps:**
1. **Verify API key**
   ```bash
   curl https://api.openai.com/v1/models \
     -H "Authorization: Bearer $VITE_OPENAI_API_KEY"
   ```

2. **Check quota and billing**
   - Log into OpenAI dashboard
   - Verify account has available credits
   - Check rate limits

**Resolution:**
1. **Update API key**
   ```bash
   # Generate new key from OpenAI dashboard
   VITE_OPENAI_API_KEY=sk-proj-new-key
   ```

2. **Implement fallback explanations**
   ```typescript
   private generateFallbackExplanation(finalValue: number): string {
     return `This valuation of $${Math.round(finalValue).toLocaleString()} is based on comprehensive market analysis...`;
   }
   ```

## Runtime Errors

### Component Rendering Issues

#### Issue: "Cannot read property of undefined"
```javascript
TypeError: Cannot read property 'make' of undefined
```

**Resolution:**
1. **Add null checks**
   ```typescript
   // Safe property access
   const make = vehicleData?.make || 'Unknown';
   
   // Conditional rendering
   {vehicleData && (
     <div>{vehicleData.make} {vehicleData.model}</div>
   )}
   ```

2. **Use default values**
   ```typescript
   // Provide defaults in props
   const { data = {}, onComplete = () => {} } = props;
   ```

### State Management Issues

#### Issue: Component state not updating
```javascript
// State seems stuck on old values
```

**Resolution:**
1. **Check useEffect dependencies**
   ```typescript
   useEffect(() => {
     // Function body
   }, [dependency1, dependency2]); // Ensure all dependencies listed
   ```

2. **Verify state updates**
   ```typescript
   // Use functional updates for complex state
   setVehicleData(prev => ({ ...prev, [field]: value }));
   ```

3. **Add debug logging**
   ```typescript
   useEffect(() => {
     console.log('State updated:', vehicleData);
   }, [vehicleData]);
   ```

### Network and CORS Issues

#### Issue: CORS policy blocking API calls
```javascript
Access to fetch at 'https://api.example.com' from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Resolution:**
1. **Use Supabase Edge Functions as proxy**
   ```typescript
   // Instead of direct API call
   const response = await fetch('https://api.external.com/data');
   
   // Use Supabase function proxy
   const response = await fetch('/functions/v1/proxy-api', {
     method: 'POST',
     body: JSON.stringify({ endpoint: 'data', params: {...} })
   });
   ```

2. **Configure development proxy**
   ```typescript
   // vite.config.ts
   export default defineConfig({
     server: {
       proxy: {
         '/api': {
           target: 'https://external-api.com',
           changeOrigin: true,
           rewrite: (path) => path.replace(/^\/api/, '')
         }
       }
     }
   });
   ```

## Performance Issues

### Slow Valuation Generation

#### Issue: Valuation takes too long to complete
```javascript
// User sees loading spinner for 30+ seconds
```

**Diagnostic Steps:**
1. **Check API response times**
   ```typescript
   // Add timing logs
   const startTime = performance.now();
   const result = await apiCall();
   console.log(`API took ${performance.now() - startTime}ms`);
   ```

2. **Monitor parallel requests**
   ```typescript
   // Ensure requests are parallel, not sequential
   const [market, history, pricing] = await Promise.allSettled([
     getMarketData(),
     getHistoryData(),
     getPricingData()
   ]);
   ```

**Resolution:**
1. **Implement progressive loading**
   ```typescript
   // Show partial results as they become available
   const [marketData, setMarketData] = useState(null);
   const [historyData, setHistoryData] = useState(null);
   
   useEffect(() => {
     getMarketData().then(setMarketData);
     getHistoryData().then(setHistoryData);
   }, []);
   ```

2. **Add timeout controls**
   ```typescript
   // Set reasonable timeouts
   const timeoutPromise = new Promise((_, reject) =>
     setTimeout(() => reject(new Error('Timeout')), 15000)
   );
   
   const result = await Promise.race([apiCall(), timeoutPromise]);
   ```

### Memory Leaks

#### Issue: Browser becomes slow after multiple valuations
```javascript
// Memory usage keeps increasing
```

**Resolution:**
1. **Clean up event listeners**
   ```typescript
   useEffect(() => {
     const handler = () => { /* handler logic */ };
     window.addEventListener('resize', handler);
     
     return () => window.removeEventListener('resize', handler);
   }, []);
   ```

2. **Cancel pending requests**
   ```typescript
   useEffect(() => {
     const abortController = new AbortController();
     
     fetch(url, { signal: abortController.signal })
       .then(response => { /* handle response */ });
     
     return () => abortController.abort();
   }, []);
   ```

## User Experience Issues

### Form Validation Problems

#### Issue: Form accepts invalid input
```javascript
// User can submit form with invalid data
```

**Resolution:**
1. **Add comprehensive validation**
   ```typescript
   const validateMileage = (value: string) => {
     const num = parseInt(value);
     if (isNaN(num)) return 'Mileage must be a number';
     if (num < 0) return 'Mileage cannot be negative';
     if (num > 999999) return 'Mileage seems unusually high';
     return '';
   };
   ```

2. **Implement real-time validation**
   ```typescript
   const [errors, setErrors] = useState<Record<string, string>>({});
   
   const handleInputChange = (field: string, value: string) => {
     setVehicleData(prev => ({ ...prev, [field]: value }));
     
     // Clear error when user starts typing
     if (errors[field]) {
       setErrors(prev => ({ ...prev, [field]: '' }));
     }
   };
   ```

### Mobile Responsiveness

#### Issue: Interface not working properly on mobile devices
```css
/* Layout breaks on small screens */
```

**Resolution:**
1. **Add responsive breakpoints**
   ```typescript
   // Use responsive classes
   <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
   ```

2. **Test on different screen sizes**
   ```bash
   # Use browser dev tools
   # Test common breakpoints: 320px, 768px, 1024px, 1440px
   ```

## Data Quality Issues

### Inaccurate Valuations

#### Issue: Valuations seem unrealistic
```javascript
// $5,000 for a brand new luxury car
```

**Diagnostic Steps:**
1. **Check comparable data quality**
   ```typescript
   console.log('Comparables found:', comparables.length);
   console.log('Price range:', Math.min(...prices), Math.max(...prices));
   console.log('Average price:', prices.reduce((a,b) => a+b) / prices.length);
   ```

2. **Verify adjustment calculations**
   ```typescript
   console.log('Base value:', baseValue);
   adjustments.forEach(adj => 
     console.log(`${adj.factor}: ${adj.percentage}%`)
   );
   ```

**Resolution:**
1. **Improve data filtering**
   ```typescript
   // Filter out obvious outliers
   const validComparables = comparables.filter(comp => 
     comp.price > 1000 && 
     comp.price < 200000 && 
     comp.mileage < 300000
   );
   ```

2. **Add sanity checks**
   ```typescript
   // Ensure final value is reasonable
   if (finalValue < 500 || finalValue > 500000) {
     console.warn('Unusual valuation detected:', finalValue);
     // Use fallback calculation or flag for review
   }
   ```

## Environment and Deployment Issues

### Production Build Problems

#### Issue: App works in development but fails in production
```javascript
// Works with `npm run dev` but not `npm run build`
```

**Resolution:**
1. **Check environment variables**
   ```bash
   # Ensure production environment has all required variables
   printenv | grep VITE_
   ```

2. **Test production build locally**
   ```bash
   npm run build
   npm run preview
   ```

3. **Fix hardcoded development URLs**
   ```typescript
   // Use environment-based URLs
   const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5173';
   ```

### Supabase Configuration Issues

#### Issue: Supabase functions not accessible
```javascript
Error: Function not found or access denied
```

**Resolution:**
1. **Verify function deployment**
   ```bash
   supabase functions list
   supabase functions logs decode-vin
   ```

2. **Check permissions**
   ```sql
   -- In Supabase SQL editor
   SELECT * FROM auth.users;
   -- Verify RLS policies if applicable
   ```

3. **Update function configuration**
   ```bash
   supabase functions deploy decode-vin --no-verify-jwt
   ```

## Debug Mode and Logging

### Enable Debug Mode
```javascript
// In browser console
localStorage.setItem('debug', 'true');

// Or add to .env for development
VITE_DEBUG=true
```

### Debug Output Examples
```javascript
// API calls
🔍 Raw decode: {Make: "HONDA", Model: "Civic", ...}
📊 Gathering market data...
📈 Found 150 market listings
🎯 Selected 120 comparable vehicles
💰 Base value calculated: $18,500 from 120 comparables
🔧 Applied 3 valuation adjustments
📊 Applied 2 market factors
💰 Final adjusted value: $17,850 (base: $18,500)
✅ Valuation completed: {value: 17850, confidence: 85, comparables: 120}

// Performance metrics
API call took 1,234 milliseconds
Valuation generation completed in 3.2 seconds
```

### Log Analysis
```bash
# Filter specific logs
grep "ERROR" logs/app.log

# Monitor API response times
grep "API took" logs/app.log | awk '{print $4}' | sort -n

# Check error patterns
grep "failed" logs/app.log | cut -d' ' -f1-3 | sort | uniq -c
```

## Emergency Procedures

### Critical System Failure
1. **Immediate Response**
   - Switch to mock data mode
   - Display user-friendly error message
   - Log detailed error information

2. **Fallback Implementation**
   ```typescript
   const EMERGENCY_MODE = true; // Set via environment
   
   if (EMERGENCY_MODE) {
     return generateMockValuation(vehicleData);
   }
   ```

### Data Quality Alert
1. **Automatic Detection**
   ```typescript
   if (valuation.confidence < 50 || valuation.comparables.length < 10) {
     console.warn('Low quality valuation detected');
     // Flag for manual review
   }
   ```

2. **User Communication**
   ```typescript
   <div className="warning-banner">
     This valuation has lower confidence due to limited market data. 
     Please use as a rough estimate only.
   </div>
   ```

## Support Escalation

### Level 1: User Self-Service
- Check this troubleshooting guide
- Clear browser cache and cookies
- Try different browser
- Check internet connection

### Level 2: Technical Support
- Provide console error messages
- Share network tab screenshots
- Describe steps to reproduce
- Include browser and OS information

### Level 3: Development Team
- Full error logs and stack traces
- Database query analysis
- API integration debugging
- Performance profiling

## Monitoring and Alerting

### Key Metrics to Monitor
- API response times (< 5 seconds)
- Error rates (< 5%)
- Valuation completion rate (> 95%)
- User satisfaction (confidence scores)

### Alert Thresholds
- API failures > 10% in 5 minutes
- Average response time > 10 seconds
- Zero successful valuations in 15 minutes
- Memory usage > 80%

This troubleshooting guide should help identify and resolve most issues encountered with the AIN Valuation Engine. For issues not covered here, please escalate to the development team with detailed error information and reproduction steps.