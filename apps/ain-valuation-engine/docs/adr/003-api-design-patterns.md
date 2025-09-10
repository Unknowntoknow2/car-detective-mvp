# ADR-003: API Design Patterns and Integration Strategy

## Status
Accepted

## Context

The AIN Valuation Engine serves multiple client types and integrates with numerous external services. The API layer must provide:

- RESTful endpoints for web applications
- Real-time updates for dynamic pricing
- Bulk operations for enterprise clients
- Integration with external automotive APIs
- Robust error handling and rate limiting
- Comprehensive audit logging

Key considerations:
- Frontend needs real-time valuation updates
- External partners require bulk data access
- Mobile apps need lightweight responses
- Enterprise clients need detailed audit trails
- Rate limiting for cost control and abuse prevention

## Decision

We have implemented a **REST-first API architecture** with the following design patterns:

### Core API Design:
- **RESTful Endpoints**: Standard HTTP methods and status codes
- **JSON Communication**: Consistent request/response format
- **Versioning Strategy**: URL-based versioning (`/api/v1/`)
- **Real-time Updates**: WebSocket subscriptions for live data
- **Batch Operations**: Dedicated endpoints for bulk processing

### Primary Endpoints:
```
POST   /api/v1/valuations           # Single vehicle valuation
POST   /api/v1/valuations/batch     # Bulk valuations
GET    /api/v1/valuations/{id}      # Retrieve valuation result
POST   /api/v1/vin/decode           # VIN decoding service
GET    /api/v1/market/trends        # Market trend data
POST   /api/v1/reports/generate     # PDF report generation
```

### Integration Patterns:
- **External API Wrapper**: Standardized interface for automotive APIs
- **Circuit Breaker**: Resilience for external service failures
- **Retry Logic**: Exponential backoff for transient failures
- **Cache Layer**: Redis for frequently accessed data
- **Rate Limiting**: Token bucket algorithm per API key

### Authentication & Authorization:
- **API Keys**: For programmatic access
- **JWT Tokens**: For user-based authentication
- **Role-Based Access**: Different permissions for user types
- **Audit Logging**: Complete request/response logging

## Consequences

### Positive:
- **Flexibility**: REST supports diverse client types
- **Caching**: Standard HTTP caching improves performance
- **Tooling**: Rich ecosystem of REST tools and libraries
- **Simplicity**: Easy to understand and implement
- **Monitoring**: Standard HTTP metrics and logging
- **Progressive Enhancement**: Can add GraphQL later if needed

### Negative:
- **Over-fetching**: Clients may receive more data than needed
- **Multiple Requests**: Complex operations may require multiple calls
- **Version Management**: URL versioning can complicate routing
- **Real-time Complexity**: WebSocket management adds complexity

## Alternatives Considered

### 1. GraphQL
- **Pros**: Flexible queries, single endpoint, strong typing
- **Cons**: Complexity, caching challenges, learning curve
- **Decision**: Consider for v2 if client needs become more complex

### 2. gRPC
- **Pros**: High performance, strong typing, streaming support
- **Cons**: Limited browser support, complexity, tooling maturity
- **Decision**: Consider for internal service communication

### 3. Event-Driven Architecture
- **Pros**: Decoupling, scalability, real-time processing
- **Cons**: Complexity, eventual consistency, debugging difficulty
- **Decision**: Use for internal processing, not primary API

## Implementation Strategy

### Phase 1: Core REST API
```javascript
// Express.js with TypeScript
app.post('/api/v1/valuations', validateRequest, async (req, res) => {
  try {
    const valuation = await valuationService.process(req.body);
    res.json({ success: true, data: valuation });
  } catch (error) {
    logger.error('Valuation failed', { error, request: req.body });
    res.status(500).json({ success: false, error: error.message });
  }
});
```

### Phase 2: Enhanced Features
- Rate limiting with express-rate-limit
- API key management system
- Request/response caching
- Comprehensive monitoring

### Phase 3: Enterprise Features
- Batch processing endpoints
- Advanced audit logging
- SLA monitoring and alerting
- API documentation portal

## API Standards

### Request Format:
```json
{
  "vin": "1HGCM82633A123456",
  "mileage": 45000,
  "condition": "good",
  "location": "94105",
  "options": {
    "mode": "seller",
    "include_comparables": true
  }
}
```

### Response Format:
```json
{
  "success": true,
  "data": {
    "valuation_id": "val_123456",
    "estimated_value": 18500,
    "confidence_score": 0.92,
    "market_analysis": { ... },
    "comparables": [ ... ]
  },
  "metadata": {
    "request_id": "req_789012",
    "timestamp": "2025-01-08T10:30:00Z",
    "processing_time_ms": 1250
  }
}
```

### Error Handling:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_VIN",
    "message": "The provided VIN is not valid",
    "details": {
      "vin": "1INVALID123456",
      "validation_errors": ["Invalid check digit"]
    }
  },
  "metadata": {
    "request_id": "req_789013",
    "timestamp": "2025-01-08T10:31:00Z"
  }
}
```

## Rate Limiting Strategy

- **Free Tier**: 100 requests/hour
- **Basic Plan**: 1,000 requests/hour
- **Enterprise**: Custom limits based on SLA
- **Burst Allowance**: 2x limit for short periods
- **Rate Limit Headers**: Inform clients of limits and remaining quota

## Review Date
2025-07-08 (6 months from acceptance)