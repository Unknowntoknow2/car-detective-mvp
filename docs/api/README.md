# AIN MVP API Documentation

## Overview
This document provides comprehensive documentation for all Supabase Edge Functions in the AIN MVP platform.

## Base URL
- **Production**: `https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/`
- **Local**: `http://localhost:54321/functions/v1/`

## Authentication
Most endpoints require authentication via Supabase JWT token:
```
Authorization: Bearer <jwt_token>
```

## Edge Functions

### 📧 Email Services

#### `email-valuation-pdf`
Sends valuation PDF reports via email.

**Endpoint**: `POST /email-valuation-pdf`

**Authentication**: None required (public)

**Request Body**:
```json
{
  "valuationId": "uuid",
  "email": "user@example.com",
  "userName": "Optional User Name"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Valuation report sent to user@example.com",
  "emailId": "resend_email_id"
}
```

**Error Responses**:
- `400`: Missing required fields
- `404`: Valuation not found
- `503`: Email service not configured

#### `test-email-integration`
Tests email service configuration.

**Endpoint**: `POST /test-email-integration`

**Authentication**: None required

**Response**:
```json
{
  "success": true,
  "environment_variables": {
    "RESEND_API_KEY": { "configured": true, "value": "re_abc123..." },
    "APP_URL": { "configured": true, "value": "https://..." },
    "EMAIL_DOMAIN": { "configured": true, "value": "example..." }
  },
  "email_service_status": "ready"
}
```

### 📊 PDF Generation

#### `generate-valuation-pdf`
Generates comprehensive PDF valuation reports.

**Endpoint**: `POST /generate-valuation-pdf`

**Authentication**: Required

**Request Body**:
```json
{
  "valuationId": "uuid"
}
```

**Response**:
```json
{
  "success": true,
  "url": "https://storage.url/report.pdf",
  "isPremium": true,
  "fileSize": 245760,
  "fileName": "valuation-uuid-timestamp.pdf"
}
```

### 🔗 Public Sharing

#### `create-public-token`
Creates shareable public tokens for valuations.

**Endpoint**: `POST /create-public-token`

**Authentication**: Required

**Request Body**:
```json
{
  "valuationId": "uuid"
}
```

**Response**:
```json
{
  "token": "generated-uuid-token"
}
```

#### `export-valuation-json`
Exports valuation data as structured JSON.

**Endpoint**: `POST /export-valuation-json`

**Authentication**: None required (uses public token)

**Request Body**:
```json
{
  "token": "public-token-uuid"
}
```

**Response**: JSON file download with complete valuation data

### 💳 Payment Processing

#### `create-checkout`
Creates Stripe checkout sessions for dealer subscriptions.

**Endpoint**: `POST /create-checkout`

**Authentication**: Required

**Request Body**:
```json
{
  "plan": "monthly" | "yearly"
}
```

**Response**:
```json
{
  "url": "https://checkout.stripe.com/session_url"
}
```

#### `create-billing-portal`
Creates Stripe billing portal sessions.

**Endpoint**: `POST /create-billing-portal`

**Authentication**: Required

**Response**:
```json
{
  "url": "https://billing.stripe.com/portal_url"
}
```

### 🚗 Vehicle Data

#### `unified-decode`
Decodes VIN and enriches vehicle data.

**Endpoint**: `POST /unified-decode`

**Authentication**: Required

**Request Body**:
```json
{
  "vin": "17-character-vin"
}
```

**Response**:
```json
{
  "success": true,
  "vehicle": {
    "year": 2020,
    "make": "Toyota",
    "model": "Camry",
    "trim": "LE",
    "engine": "2.5L I4",
    "transmission": "8-Speed Automatic"
  },
  "confidence": 0.95
}
```

#### `analyze-photos`
Analyzes vehicle photos for condition scoring.

**Endpoint**: `POST /analyze-photos`

**Authentication**: Required

**Request Body**: FormData with photo files

**Response**:
```json
{
  "success": true,
  "analysis": {
    "condition_score": 85,
    "damage_detected": [],
    "features_detected": ["led_headlights", "alloy_wheels"],
    "confidence": 0.92
  }
}
```

## Error Handling

All endpoints follow consistent error response format:

```json
{
  "error": "Error message description",
  "code": "ERROR_CODE", // Optional
  "details": {} // Optional additional context
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad Request - Invalid input
- `401`: Unauthorized - Missing/invalid auth
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource doesn't exist
- `429`: Too Many Requests - Rate limited
- `500`: Internal Server Error
- `503`: Service Unavailable

## Rate Limiting

- **Default**: 60 requests per hour per IP
- **Authenticated**: 1000 requests per hour per user
- **Premium**: 5000 requests per hour per user

## Environment Variables

Required secrets configuration in Supabase:

```bash
RESEND_API_KEY=re_xxxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxxx  
STRIPE_SECRET_KEY=sk_xxxxxxxxx
APP_URL=https://your-domain.com
EMAIL_DOMAIN=your-domain.com
```

## SDKs and Libraries

### JavaScript/TypeScript
```javascript
import { supabase } from '@/integrations/supabase/client';

// Call edge function
const { data, error } = await supabase.functions.invoke('function-name', {
  body: { /* request data */ }
});
```

### cURL Examples
```bash
# Email PDF
curl -X POST https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/email-valuation-pdf \
  -H "Content-Type: application/json" \
  -d '{"valuationId":"uuid","email":"test@example.com"}'

# Generate PDF (authenticated)
curl -X POST https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/generate-valuation-pdf \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{"valuationId":"uuid"}'
```

## Support

For API support and issues:
- **Documentation**: This file
- **Logs**: Check Supabase Dashboard → Functions → Logs
- **Monitoring**: Use `test-email-integration` for health checks
- **Issues**: Contact development team