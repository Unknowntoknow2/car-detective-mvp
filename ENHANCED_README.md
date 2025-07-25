# Car Detective MVP - Enhanced Vehicle Valuation System

## 🚀 Overview

A comprehensive, enterprise-grade vehicle valuation platform with ML/AI-ready architecture, premium React components, and robust backend services. This system provides accurate vehicle valuations using market data, condition analysis, and sophisticated algorithms.

## ✨ Key Features

### 🧠 Enhanced Modular Valuation Engine
- **ML/AI-Ready Architecture**: Pluggable machine learning models (Default, TensorFlow, Cloud)
- **Sophisticated Analyzers**: Condition, mileage, and market analysis
- **Enterprise Audit Logging**: Comprehensive audit trails with performance metrics
- **Confidence Scoring**: Advanced confidence calculation with detailed breakdowns
- **Price Adjustment Engine**: Intelligent factor-based price adjustments

### 🎨 Premium React Results Page
- **Enterprise-Grade UI**: Professional, audit-ready design
- **Interactive Visualizations**: Dynamic charts and market comparisons
- **Confidence Indicators**: Detailed confidence breakdowns with recommendations
- **Tabbed Interface**: Organized data presentation with smooth animations
- **Export Capabilities**: Multiple export formats for reports

### 🔌 API Connector Templates
- **VIN Decode**: NHTSA, VinAudit, ClearVin with fallback chain
- **Vehicle Listings**: Cars.com, AutoTrader, CarGurus integration
- **Auction Data**: Manheim, ADESA, Copart connectors
- **Incentives**: Manufacturer and regional incentive data
- **Weather Impact**: Climate-based valuation adjustments
- **Insurance Data**: Risk assessment integration (template)

### 🏢 Enterprise Backend
- **Node.js/Express**: Production-ready server with security
- **PostgreSQL Schema**: Comprehensive database design with RLS
- **API Documentation**: Swagger/OpenAPI documentation
- **Rate Limiting**: Configurable rate limiting and authentication
- **Monitoring**: Built-in performance monitoring and logging

## 📁 Project Structure

```
car-detective-mvp/
├── src/
│   ├── valuation/                    # Enhanced valuation engine
│   │   ├── engine/                   # Core valuation engine
│   │   ├── types/                    # TypeScript definitions
│   │   ├── providers/                # Market data providers
│   │   ├── ml/                       # ML model interfaces
│   │   ├── analyzers/                # Condition, mileage, market analyzers
│   │   ├── engines/                  # Price adjustment & confidence engines
│   │   └── utils/                    # Audit logging and utilities
│   ├── api-connectors/               # API integration templates
│   │   ├── vin-decode/               # VIN decoding services
│   │   ├── listings/                 # Vehicle listing platforms
│   │   ├── auctions/                 # Auction data sources
│   │   ├── incentives/               # Manufacturer incentives
│   │   └── weather/                  # Weather impact analysis
│   ├── components/premium/           # Premium React components
│   ├── pages/                        # React pages including premium results
│   └── styles/                       # Enterprise CSS and styling
├── backend/                          # Node.js/Express backend
│   ├── src/
│   │   ├── routes/                   # API route handlers
│   │   ├── controllers/              # Business logic controllers
│   │   ├── middleware/               # Authentication, validation
│   │   ├── models/                   # Data models
│   │   └── services/                 # Business services
├── database/                         # Database schemas and migrations
│   ├── schemas/                      # PostgreSQL schema definitions
│   └── migrations/                   # Database migration scripts
└── docs/                            # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis (optional, for caching)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Unknowntoknow2/car-detective-mvp.git
   cd car-detective-mvp
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   npm install
   
   # Backend
   cd backend
   npm install
   cd ..
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up database**
   ```bash
   # Create database
   createdb car_detective
   
   # Run schema
   psql car_detective < database/schemas/vehicle_valuation_schema.sql
   ```

5. **Start development servers**
   ```bash
   # Frontend (port 3000)
   npm run dev
   
   # Backend (port 3001)
   cd backend
   npm run dev
   ```

## 🧠 Enhanced Valuation Engine Usage

### Basic Usage

```typescript
import { createValuationEngine } from '@/valuation';

const engine = createValuationEngine({
  environment: 'production',
  marketDataProviders: {
    carsComApiKey: 'your-api-key',
    autoTraderApiKey: 'your-api-key'
  },
  mlModel: {
    type: 'cloud',
    config: {
      apiEndpoint: 'https://your-ml-api.com',
      apiKey: 'your-ml-api-key'
    }
  }
});

const result = await engine.calculateValuation({
  vin: '1HGBH41JXMN109186',
  make: 'Honda',
  model: 'Civic',
  year: 2018,
  mileage: 45000,
  condition: 'good',
  zipCode: '90210'
});

console.log('Estimated Value:', result.estimatedValue);
console.log('Confidence Score:', result.confidenceScore);
```

### Advanced Configuration

```typescript
import { ValuationEngineFactory, ConfigPresets } from '@/valuation';

// Use production preset
const engine = ValuationEngineFactory.createProductionEngine({
  ...ConfigPresets.production,
  marketDataProviders: {
    carsComApiKey: process.env.CARS_COM_API_KEY,
    autoTraderApiKey: process.env.AUTOTRADER_API_KEY
  }
});

// Batch processing
const results = await engine.batchValuation([
  { vin: 'VIN1', make: 'Toyota', model: 'Camry', year: 2020, mileage: 30000, condition: 'excellent', zipCode: '90210' },
  { vin: 'VIN2', make: 'Honda', model: 'Accord', year: 2019, mileage: 45000, condition: 'good', zipCode: '90210' }
]);
```

## 🔌 API Connectors

### VIN Decoding

```typescript
import { createVinDecoder } from '@/api-connectors/vin-decode/VinDecodeConnector';

const decoder = createVinDecoder({
  vinAuditApiKey: 'your-api-key',
  clearVinApiKey: 'your-api-key',
  preferredOrder: ['clearvin', 'vinaudit', 'nhtsa']
});

const result = await decoder.decodeVin('1HGBH41JXMN109186');
```

### Vehicle Listings

```typescript
import { createListingConnector } from '@/api-connectors/listings/ListingConnector';

const connector = createListingConnector({
  carsComApiKey: 'your-api-key',
  autoTraderApiKey: 'your-api-key',
  enabledSources: ['cars', 'autotrader']
});

const listings = await connector.searchListings({
  make: 'Toyota',
  model: 'Camry',
  year: 2020,
  zipCode: '90210',
  radius: 50
});
```

## 🎨 Premium React Components

### Premium Results Page

```tsx
import { PremiumValuationResultsPage } from '@/pages/PremiumValuationResultsPage';

// Use in your router
<Route path="/results/:id" element={<PremiumValuationResultsPage />} />
```

### Individual Components

```tsx
import { PremiumValuationChart } from '@/components/premium/PremiumValuationChart';
import { MarketComparison } from '@/components/premium/MarketComparison';
import { ConfidenceIndicator } from '@/components/premium/ConfidenceIndicator';

<PremiumValuationChart valuation={valuationResult} />
<MarketComparison marketInsights={valuationResult.marketInsights} />
<ConfidenceIndicator 
  score={valuationResult.confidenceScore}
  breakdown={valuationResult.confidenceBreakdown}
/>
```

## 🏢 Backend API

### Start the Backend

```bash
cd backend
npm run dev
```

### API Documentation

Visit `http://localhost:3001/api/docs` for interactive API documentation.

### Key Endpoints

- `GET /api/v1/valuations` - List valuations
- `POST /api/v1/valuations` - Create valuation
- `GET /api/v1/valuations/:id` - Get valuation
- `GET /api/v1/vehicles/:vin` - Get vehicle data
- `GET /api/v1/market/listings` - Search market listings

## 🗄️ Database Schema

The PostgreSQL schema includes:

- **Users & Authentication**: User accounts, API keys, permissions
- **Vehicle Data**: VIN decode results, features, specifications
- **Valuations**: Valuation results, adjustments, confidence metrics
- **Market Data**: Listings, auction data, historical prices
- **Audit Trail**: Comprehensive audit logging for compliance
- **Photos & Media**: Vehicle photos with AI analysis results

### Key Features

- **Row Level Security (RLS)**: Data isolation and security
- **Comprehensive Indexing**: Optimized for performance
- **Audit Triggers**: Automatic audit trail generation
- **JSONB Support**: Flexible data storage for dynamic content

## 🔧 Configuration

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/car_detective

# Redis (optional)
REDIS_URL=redis://localhost:6379

# API Keys
CARS_COM_API_KEY=your-key
AUTOTRADER_API_KEY=your-key
EDMUNDS_API_KEY=your-key
OPENWEATHER_API_KEY=your-key

# JWT
JWT_SECRET=your-secret
JWT_EXPIRES_IN=24h

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test suites
npm run test:valuation
npm run test:api
npm run test:components
```

## 🚀 Deployment

### Docker Deployment

```bash
# Build images
docker build -t car-detective-frontend .
docker build -t car-detective-backend ./backend

# Run with docker-compose
docker-compose up -d
```

## 📊 Performance Monitoring

### Built-in Metrics

- Valuation processing times
- API response times
- Database query performance
- Confidence score distributions
- Error rates and types

### Audit Trail

All valuations and data modifications are automatically logged with:
- User identification
- Timestamp and duration
- Input parameters and results
- Data sources used
- Confidence calculations

## 🔒 Security Features

### API Security

- JWT-based authentication
- API key validation
- Rate limiting by IP and user
- Request size limits
- CORS configuration

### Database Security

- Row Level Security (RLS)
- Audit triggers on sensitive tables
- Encrypted sensitive data
- Connection pooling and timeouts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🗺️ Roadmap

### Immediate Priorities
- [ ] Complete insurance connector implementation
- [ ] Add comprehensive test coverage
- [ ] Performance optimization
- [ ] Documentation improvements

### Future Enhancements
- [ ] Real-time market data streaming
- [ ] Advanced ML model training
- [ ] Mobile app development
- [ ] International market support