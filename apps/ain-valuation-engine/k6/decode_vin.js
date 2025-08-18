// ===============================================
// k6 Load Test: VIN Decode Performance
// Target: p95 < 400ms, 99% success rate
// ===============================================
// Usage: k6 run --env BASE_URL=https://api.example.com k6/decode_vin.js

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const cacheHitRate = new Rate('cache_hit_rate');
const vinValidationFailures = new Rate('vin_validation_failures');
const apiLatency = new Trend('api_latency_ms');

// Test configuration
export const options = {
  // Load test scenarios
  scenarios: {
    // Ramp up test
    ramp_up: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '30s', target: 10 },
        { duration: '1m', target: 50 },
        { duration: '2m', target: 100 },
        { duration: '30s', target: 0 },
      ],
    },
    // Sustained load test  
    sustained_load: {
      executor: 'constant-vus',
      vus: 50,
      duration: '5m',
      startTime: '4m',
    },
    // Spike test
    spike_test: {
      executor: 'ramping-vus',
      startVUs: 50,
      stages: [
        { duration: '10s', target: 200 },
        { duration: '30s', target: 200 },
        { duration: '10s', target: 50 },
      ],
      startTime: '10m',
    },
  },

  // Performance thresholds
  thresholds: {
    // Main performance target
    http_req_duration: ['p(95)<400'],
    
    // Success rate targets
    'checks{endpoint:decode}': ['rate>0.99'],
    'checks{endpoint:profile}': ['rate>0.98'],
    
    // Error rate limits
    http_req_failed: ['rate<0.02'],
    
    // Cache performance
    cache_hit_rate: ['rate>0.5'],
    
    // Validation failure rate
    vin_validation_failures: ['rate<0.01'],
  },
};

// Configuration
const BASE = __ENV.BASE_URL || 'https://api.example.com/v1';
const API_KEY = __ENV.API_KEY || 'test-key';

// Test VINs with known good check digits
const VALID_VINS = [
  '1HGCM82633A004352', // Honda Accord 2003
  '1G1BE5SM7H7114533', // Chevrolet Cruze
  '3VW2K7AJ5EM000001', // Volkswagen Jetta
  '5YFB4MDE8SP33B447', // Toyota Camry
  '1FTFW1ET5DFC12345', // Ford F-150
  '1C4RJFAG0FC123456', // Jeep Grand Cherokee
  '2T1BURHE8FC123456', // Toyota Corolla
  '1N4AL3AP0FC123456', // Nissan Altima
];

// Invalid VINs for error testing
const INVALID_VINS = [
  '123',                // Too short
  '1HGCM82633A004353', // Wrong check digit
  '1HGCM82633A00435O', // Contains invalid character O
  '',                  // Empty
];

// Request headers
const headers = {
  'Content-Type': 'application/json',
  'X-API-Key': API_KEY,
  'Accept': 'application/json',
};

// Generate unique request ID
function generateRequestId() {
  return `k6-${__ITER}-${__VU}-${Date.now()}`;
}

// Test VIN decoding endpoint
function testDecodeVin() {
  const vin = VALID_VINS[Math.floor(Math.random() * VALID_VINS.length)];
  const requestId = generateRequestId();
  
  const payload = JSON.stringify({
    vin: vin,
    options: {
      timeout: 5000,
      forceRefresh: Math.random() < 0.1, // 10% force refresh
    }
  });

  const requestHeaders = {
    ...headers,
    'X-Request-Id': requestId,
    'Idempotency-Key': `decode-${vin}-${__ITER}`,
  };

  const response = http.post(`${BASE}/decode-vin`, payload, {
    headers: requestHeaders,
    timeout: '10s',
  });

  // Record custom metrics
  apiLatency.add(response.timings.duration);
  
  // Check response
  const success = check(response, {
    'status is 200/422/400/429': (r) => [200, 400, 422, 429].includes(r.status),
    'response time < 5s': (r) => r.timings.duration < 5000,
    'has request ID header': (r) => r.headers['X-Request-Id'] !== undefined,
  }, { endpoint: 'decode' });

  // Parse response for additional checks
  if (response.status === 200) {
    try {
      const data = JSON.parse(response.body);
      
      check(data, {
        'has vin field': (d) => d.vin !== undefined,
        'has decoded data': (d) => d.data !== undefined,
        'has metadata': (d) => d.metadata !== undefined,
        'vin matches request': (d) => d.vin === vin,
      }, { endpoint: 'decode' });

      // Track cache hits
      if (data.metadata && data.metadata.cacheHit !== undefined) {
        cacheHitRate.add(data.metadata.cacheHit);
      }
      
    } catch (e) {
      console.error(`Failed to parse response: ${e.message}`);
    }
  }

  return success;
}

// Test vehicle profile endpoint
function testVehicleProfile() {
  const vin = VALID_VINS[Math.floor(Math.random() * VALID_VINS.length)];
  const requestId = generateRequestId();
  
  const requestHeaders = {
    ...headers,
    'X-Request-Id': requestId,
  };

  const queryParams = [
    `include=specs,recalls,safety`,
    `maxAge=${Math.floor(Math.random() * 3600)}`, // Random max age
  ].join('&');

  const response = http.get(`${BASE}/vehicle-profile/${vin}?${queryParams}`, {
    headers: requestHeaders,
    timeout: '15s',
  });

  const success = check(response, {
    'status is 200/404/400/429': (r) => [200, 404, 400, 429].includes(r.status),
    'response time < 10s': (r) => r.timings.duration < 10000,
  }, { endpoint: 'profile' });

  if (response.status === 200) {
    try {
      const data = JSON.parse(response.body);
      
      check(data, {
        'has vin field': (d) => d.vin !== undefined,
        'has profile': (d) => d.profile !== undefined,
        'vin matches request': (d) => d.vin === vin,
      }, { endpoint: 'profile' });
      
    } catch (e) {
      console.error(`Failed to parse profile response: ${e.message}`);
    }
  }

  return success;
}

// Test invalid VIN handling
function testInvalidVin() {
  const vin = INVALID_VINS[Math.floor(Math.random() * INVALID_VINS.length)];
  const requestId = generateRequestId();
  
  const payload = JSON.stringify({ vin: vin });

  const response = http.post(`${BASE}/decode-vin`, payload, {
    headers: {
      ...headers,
      'X-Request-Id': requestId,
    },
    timeout: '5s',
  });

  const validationFailed = response.status === 400 || response.status === 422;
  vinValidationFailures.add(validationFailed);

  return check(response, {
    'invalid VIN rejected': (r) => [400, 422].includes(r.status),
    'has error response': (r) => r.body.includes('error'),
  }, { endpoint: 'validation' });
}

// Test health endpoint
function testHealth() {
  const response = http.get(`${BASE}/health`, {
    headers: { 'Accept': 'application/json' },
    timeout: '5s',
  });

  return check(response, {
    'health check passes': (r) => r.status === 200,
    'response time < 1s': (r) => r.timings.duration < 1000,
  }, { endpoint: 'health' });
}

// Main test function
export default function () {
  const testType = Math.random();
  
  if (testType < 0.7) {
    // 70% decode VIN tests
    testDecodeVin();
  } else if (testType < 0.9) {
    // 20% vehicle profile tests
    testVehicleProfile();
  } else if (testType < 0.98) {
    // 8% invalid VIN tests
    testInvalidVin();
  } else {
    // 2% health checks
    testHealth();
  }

  // Random sleep to simulate real user behavior
  sleep(Math.random() * 2 + 0.5); // 0.5-2.5 seconds
}

// Setup function
export function setup() {
  console.log(`Starting load test against: ${BASE}`);
  console.log(`Test VINs: ${VALID_VINS.length} valid, ${INVALID_VINS.length} invalid`);
  
  // Warm up the API
  const warmupResponse = http.get(`${BASE}/health`);
  if (warmupResponse.status !== 200) {
    console.warn(`Warning: Health check failed during setup (${warmupResponse.status})`);
  }
  
  return { timestamp: new Date().toISOString() };
}

// Teardown function
export function teardown(data) {
  console.log(`Load test completed at: ${new Date().toISOString()}`);
  console.log(`Test started at: ${data.timestamp}`);
}

// Handle summary data
export function handleSummary(data) {
  return {
    'summary.json': JSON.stringify(data, null, 2),
    'stdout': `
╔══════════════════════════════════════════════╗
║              LOAD TEST SUMMARY               ║
╠══════════════════════════════════════════════╣
║ Total Requests: ${data.metrics.http_reqs.count.toString().padStart(8)} ║
║ Failed Requests: ${(data.metrics.http_req_failed.values.rate * 100).toFixed(2).padStart(6)}%     ║
║ Avg Duration: ${data.metrics.http_req_duration.values.avg.toFixed(2).padStart(8)}ms      ║
║ P95 Duration: ${data.metrics.http_req_duration.values['p(95)'].toFixed(2).padStart(8)}ms      ║
║ P99 Duration: ${data.metrics.http_req_duration.values['p(99)'].toFixed(2).padStart(8)}ms      ║
║ Cache Hit Rate: ${((data.metrics.cache_hit_rate?.values.rate || 0) * 100).toFixed(2).padStart(6)}%    ║
╚══════════════════════════════════════════════╝
    `,
  };
}
