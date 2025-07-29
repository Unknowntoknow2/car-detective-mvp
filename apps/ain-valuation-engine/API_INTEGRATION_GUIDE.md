# API Integration Guide

## Overview

This guide provides detailed information about integrating with the AIN Valuation Engine's APIs and external data sources. The system is designed to work with multiple automotive data providers while providing robust fallback mechanisms.

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Frontend App   │───▶│  API Gateway    │───▶│ External APIs   │
│                 │    │ (Error Handling │    │ • NHTSA         │
│                 │    │  Rate Limiting  │    │ • Autotrader    │
│                 │    │  Caching)       │    │ • Cars.com      │
│                 │    │                 │    │ • CarGurus      │
│                 │    │                 │    │ • Carfax        │
│                 │    │                 │    │ • Autocheck     │
│                 │    │                 │    │ • OpenAI        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Core Services

### 1. API Client Service (`apiClient.ts`)

The central HTTP client with built-in error handling, retries, and rate limiting.

#### Features
- **Automatic Retries**: Exponential backoff for failed requests
- **Rate Limiting**: Automatic detection and handling
- **Timeout Management**: Configurable timeouts per request
- **Error Standardization**: Consistent error response format

#### Usage Example
```typescript
import { apiClient } from '@/services/apiClient';

// GET request with automatic retry
const response = await apiClient.get<DataType>(
  'https://api.example.com/data',
  { 'X-API-Key': 'your-key' }
);

// POST request with error handling
const result = await apiClient.post<ResponseType>(
  'https://api.example.com/submit',
  { data: 'payload' },
  { 'Authorization': 'Bearer token' }
);
```

#### Configuration
```typescript
// Default configuration
const config = {
  baseTimeout: 10000,      // 10 seconds
  maxRetries: 3,           // 3 retry attempts
  retryDelay: 1000,        // 1 second base delay
  exponentialBackoff: true // Exponential delay increase
};
```

### 2. VIN Decoding Service

#### Endpoint
```
POST /functions/v1/decode-vin
```

#### Implementation
The VIN decoding is handled by a Supabase Edge Function that calls the NHTSA VPIC API.

#### Supabase Function (`decode-vin/index.ts`)
```typescript
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
      }
    });
  }

  try {
    const { vin } = await req.json();
    const data = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${vin}?format=json`
    );
    const json = await data.json();

    return new Response(JSON.stringify({ decodedData: json.Results }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ 
      error: 'VIN decode failed', 
      message: err.message 
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
});
```

#### Client Integration
```typescript
import { decodeVin } from '@/api/decodeVin';

const result = await decodeVin('1FTEW1CG6HKD46234');
if (result.decodedData) {
  // Process decoded vehicle data
  const vehicleData = convertToVariableValueArray(result.decodedData[0]);
}
```

### 3. Market Listings Service (`marketListingsService.ts`)

Aggregates vehicle listings from multiple automotive marketplaces.

#### Supported Providers
- **Autotrader**: Primary marketplace data
- **Cars.com**: Secondary marketplace data  
- **CarGurus**: Price analysis and market insights

#### Configuration
```typescript
// Environment variables
VITE_AUTOTRADER_API_KEY=your-autotrader-key
VITE_CARSCOM_API_KEY=your-carscom-key
VITE_CARGURUS_API_KEY=your-cargurus-key
```

#### Usage
```typescript
import { marketListingsService } from '@/services/marketListingsService';

const vehicleData = {
  make: 'Honda',
  model: 'Civic',
  year: 2020,
  zipCode: '90210'
};

const listings = await marketListingsService.getMarketListings(
  vehicleData,
  100, // radius in miles
  150  // max results
);

if (listings.success) {
  console.log(`Found ${listings.data.length} comparable vehicles`);
}
```

#### API Response Format
```typescript
interface MarketListing {
  id: string;
  price: number;
  mileage: number;
  year: number;
  make: string;
  model: string;
  trim?: string;
  condition: VehicleCondition;
  location: string;
  source: string;
  listingDate: Date;
  url?: string;
  dealer: boolean;
  certification?: string;
}
```

### 4. Vehicle History Service (`vehicleHistoryService.ts`)

Provides comprehensive vehicle history from multiple sources.

#### Supported Providers
- **Carfax**: Comprehensive vehicle history reports
- **Autocheck**: Alternative history data source
- **NHTSA**: Official recall information

#### Data Types Collected
- **Accident History**: Severity, dates, damage estimates
- **Service Records**: Maintenance history and dealer services
- **Ownership History**: Number of previous owners
- **Title History**: Title status changes over time
- **Recall Information**: Open and completed recalls

#### Usage
```typescript
import { vehicleHistoryService } from '@/services/vehicleHistoryService';

const history = await vehicleHistoryService.getVehicleHistory('VIN123456789');

if (history.success) {
  const vehicleHistory = history.data;
  console.log(`Found ${vehicleHistory.accidentHistory.length} accidents`);
  console.log(`Found ${vehicleHistory.serviceRecords.length} service records`);
  console.log(`Found ${vehicleHistory.recallsHistory.length} recalls`);
}
```

### 5. Valuation Engine (`valuationEngine.ts`)

The core valuation logic that combines all data sources.

#### Valuation Process
1. **Data Gathering**: Parallel API calls to all services
2. **Comparable Analysis**: Find and score similar vehicles
3. **Base Value Calculation**: Weighted average of comparables
4. **Adjustments**: Apply condition, mileage, history factors
5. **Market Factors**: Seasonal, economic, supply/demand
6. **AI Explanation**: Generate human-readable explanation
7. **Accuracy Metrics**: Calculate confidence and data quality

#### Usage
```typescript
import { valuationEngine } from '@/services/valuationEngine';

const vehicleData: VehicleData = {
  vin: '1FTEW1CG6HKD46234',
  make: 'Honda',
  model: 'Civic',
  year: 2020,
  mileage: 35000,
  condition: VehicleCondition.GOOD,
  zipCode: '90210',
  titleStatus: TitleStatus.CLEAN
};

const valuation = await valuationEngine.generateValuation(vehicleData);

if (valuation.success) {
  const result = valuation.data;
  console.log(`Estimated value: $${result.estimatedValue}`);
  console.log(`Confidence: ${result.confidence}%`);
  console.log(`Based on ${result.comparables.length} comparables`);
}
```

## External API Integration Details

### NHTSA VPIC API

#### Base URL
```
https://vpic.nhtsa.dot.gov/api/vehicles/
```

#### VIN Decode Endpoint
```
GET /decodevinvalues/{vin}?format=json
```

#### Example Request
```bash
curl "https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/1FTEW1CG6HKD46234?format=json"
```

#### Response Format
```json
{
  "Count": 1,
  "Message": "Results returned successfully",
  "Results": [{
    "Make": "HONDA",
    "Model": "Civic",
    "ModelYear": "2020",
    "VIN": "1FTEW1CG6HKD46234",
    "BodyClass": "Sedan",
    "DriveType": "Front-Wheel Drive",
    "EngineNumberOfCylinders": "4",
    "FuelTypePrimary": "Gasoline",
    "TransmissionStyle": "Automatic"
  }]
}
```

### Autotrader API (Example)

#### Authentication
```javascript
headers: {
  'X-API-Key': process.env.VITE_AUTOTRADER_API_KEY
}
```

#### Search Endpoint
```
GET /v2/listings?make={make}&model={model}&year={year}&zip={zip}&radius={radius}
```

#### Example Response
```json
{
  "listings": [{
    "id": "12345",
    "price": 18500,
    "mileage": 35000,
    "year": 2020,
    "make": "Honda",
    "model": "Civic",
    "trim": "LX",
    "condition": "good",
    "city": "Los Angeles",
    "state": "CA",
    "isDealer": true,
    "listingDate": "2024-01-15T10:30:00Z",
    "url": "https://autotrader.com/listing/12345"
  }],
  "total": 150,
  "page": 1
}
```

### OpenAI API Integration

#### Model Configuration
```typescript
const response = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo',
  messages: [{ role: 'user', content: prompt }],
  max_tokens: 300,
  temperature: 0.3,
});
```

#### Prompt Template
```typescript
const prompt = `Generate a clear, professional explanation for a vehicle valuation:

Vehicle: ${vehicleData.year} ${vehicleData.make} ${vehicleData.model}
VIN: ${vehicleData.vin}
Estimated Value: $${Math.round(finalValue).toLocaleString()}

Adjustments Applied:
${adjustments.map(adj => `- ${adj.factor}: ${adj.percentage > 0 ? '+' : ''}${adj.percentage.toFixed(1)}% (${adj.explanation})`).join('\n')}

Market Factors:
${marketFactors.map(factor => `- ${factor.factor}: ${factor.impact > 0 ? '+' : ''}${(factor.impact * 100).toFixed(1)}% (${factor.description})`).join('\n')}

Please provide a concise explanation of how this valuation was calculated and what factors influenced the final price. Keep it under 200 words and make it understandable to consumers.`;
```

## Error Handling and Fallbacks

### Fallback Strategy
```typescript
// 1. Try primary API
const primaryResult = await primaryAPI.getData();

// 2. If failed, try secondary API
if (!primaryResult.success) {
  const secondaryResult = await secondaryAPI.getData();
}

// 3. If all APIs fail, use mock/cached data
if (!secondaryResult.success) {
  const fallbackData = generateMockData();
}
```

### Mock Data Generation
When APIs are unavailable, the system generates realistic mock data:

```typescript
private getMockListings(vehicle: Partial<VehicleData>, source: string, count: number) {
  const basePrice = this.estimateBasePrice(vehicle);
  const listings: MarketListing[] = [];

  for (let i = 0; i < count; i++) {
    const priceVariation = (Math.random() - 0.5) * 0.4; // ±20% variation
    const mileageVariation = Math.random() * 50000 + 10000; // 10k-60k miles

    listings.push({
      id: `${source}-${i}-${Date.now()}`,
      price: Math.round(basePrice * (1 + priceVariation)),
      mileage: Math.round(mileageVariation),
      year: vehicle.year || 2020,
      make: vehicle.make || 'Honda',
      model: vehicle.model || 'Civic',
      condition: this.randomCondition(),
      location: this.randomLocation(),
      source,
      listingDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      dealer: Math.random() > 0.3
    });
  }

  return Promise.resolve({
    success: true,
    data: listings,
    metadata: { source: `${source}_mock`, timestamp: new Date() }
  });
}
```

## Rate Limiting and Performance

### Rate Limit Handling
```typescript
private extractRateLimit(headers: any): RateLimit | undefined {
  const remaining = headers['x-ratelimit-remaining'];
  const reset = headers['x-ratelimit-reset'];
  const limit = headers['x-ratelimit-limit'];

  if (remaining && reset && limit) {
    return {
      remaining: parseInt(remaining),
      resetTime: new Date(parseInt(reset) * 1000),
      limit: parseInt(limit)
    };
  }

  return undefined;
}
```

### Parallel Processing
```typescript
// Parallel requests to multiple sources
const [autotraderResults, carsComResults, carGurusResults] = await Promise.allSettled([
  this.getAutotraderListings(vehicle, radiusMiles, maxResults / 3),
  this.getCarsComListings(vehicle, radiusMiles, maxResults / 3),
  this.getCarGurusListings(vehicle, radiusMiles, maxResults / 3),
]);
```

### Caching Strategy
```typescript
// Response caching for repeated requests
const cacheKey = `${make}-${model}-${year}-${zipCode}`;
const cachedData = this.cache.get(cacheKey);

if (cachedData && !this.isCacheExpired(cachedData.timestamp)) {
  return cachedData;
}

// Fetch fresh data and cache it
const freshData = await this.fetchData();
this.cache.set(cacheKey, { ...freshData, timestamp: Date.now() });
```

## Testing and Development

### Mock Data for Development
```typescript
// Enable mock mode for development
const USE_MOCK_DATA = !import.meta.env.VITE_AUTOTRADER_API_KEY;

if (USE_MOCK_DATA) {
  return this.getMockListings(vehicle, 'autotrader', maxResults);
}
```

### API Testing
```bash
# Test VIN decode
curl -X POST "http://localhost:5173/functions/v1/decode-vin" \
  -H "Content-Type: application/json" \
  -d '{"vin":"1FTEW1CG6HKD46234"}'

# Test full valuation flow
npm run dev
# Navigate to http://localhost:5173
# Enter VIN: 1FTEW1CG6HKD46234
```

### Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Add your API keys
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_OPENAI_API_KEY=sk-proj-your-openai-key

# Optional API keys (will use mock data if not provided)
VITE_AUTOTRADER_API_KEY=your-autotrader-key
VITE_CARSCOM_API_KEY=your-carscom-key
VITE_CARGURUS_API_KEY=your-cargurus-key
VITE_CARFAX_API_KEY=your-carfax-key
VITE_AUTOCHECK_API_KEY=your-autocheck-key
```

## Deployment Considerations

### Supabase Function Deployment
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Deploy function
supabase functions deploy decode-vin
```

### Environment Variable Management
```javascript
// Production environment check
const isProduction = import.meta.env.MODE === 'production';

// API endpoint selection
const apiEndpoint = isProduction 
  ? 'https://your-production-api.com'
  : 'http://localhost:5173';
```

### Performance Monitoring
```typescript
// API response time tracking
const startTime = performance.now();
const response = await apiClient.get(url);
const endTime = performance.now();

console.log(`API call took ${endTime - startTime} milliseconds`);

// Error rate monitoring
const errorRate = (failedRequests / totalRequests) * 100;
if (errorRate > 5) {
  console.warn(`High error rate: ${errorRate}%`);
}
```

This integration guide provides comprehensive information for developers working with the AIN Valuation Engine's API infrastructure. The system is designed to be robust, scalable, and maintainable while providing excellent fallback mechanisms for reliability.