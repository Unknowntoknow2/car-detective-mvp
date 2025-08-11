# ADR-002: Database Architecture and Data Layer Design

## Status
Accepted

## Context

The AIN Valuation Engine requires a robust data architecture to handle:

- Vehicle specifications and VIN decoding data
- Safety ratings and recall information
- Market listings and pricing history
- Fuel economy and environmental data
- User valuation requests and audit logs
- ML model training data and predictions

The system must support:
- Real-time queries for valuation requests
- Complex joins across multiple data sources
- Materialized views for performance
- Audit trails for compliance
- Scalable data ingestion pipelines

## Decision

We have selected **Supabase** as our primary database platform with the following architecture:

### Core Database Design:
- **PostgreSQL**: Primary database with advanced JSON support
- **Materialized Views**: Pre-computed vehicle profiles for performance
- **RPC Functions**: Database-level business logic for VIN decoding
- **Real-time Subscriptions**: Live updates for frontend applications

### Data Organization:
```sql
-- Core Tables
vehicle_specs          -- VIN-decoded vehicle specifications
safety_ratings        -- NHTSA safety data
fuel_economy         -- EPA fuel economy data
market_listings      -- Current market data
recalls              -- NHTSA recall information
user_requests        -- Valuation request history
audit_logs          -- Compliance and debugging logs

-- Performance Optimizations
vehicle_profiles     -- Materialized view joining core data
market_summaries     -- Aggregated market statistics
```

### Integration Strategy:
- **Edge Functions**: Serverless functions for API integrations
- **Database Triggers**: Automatic data validation and processing
- **Row Level Security**: User-based data access control
- **Backup and Recovery**: Automated backups with point-in-time recovery

## Consequences

### Positive:
- **Rapid Development**: Built-in auth, real-time, and edge functions
- **PostgreSQL Power**: Advanced queries, JSON support, full-text search
- **Scalability**: Automatic scaling and load balancing
- **Cost Effective**: Generous free tier, predictable pricing
- **Developer Experience**: Excellent tooling and documentation
- **Compliance Ready**: SOC 2, GDPR compliant infrastructure

### Negative:
- **Vendor Lock-in**: Supabase-specific features limit portability
- **Learning Curve**: Team needs to learn Supabase ecosystem
- **Data Gravity**: Moving large datasets becomes expensive
- **Limited Customization**: Less control than self-hosted solutions

## Alternatives Considered

### 1. Self-Hosted PostgreSQL
- **Pros**: Complete control, cost predictability, no vendor lock-in
- **Cons**: Infrastructure management overhead, security responsibility, scaling complexity

### 2. AWS RDS with Aurora
- **Pros**: AWS ecosystem integration, enterprise features, managed service
- **Cons**: Higher costs, complex pricing, requires AWS expertise

### 3. Google Cloud SQL
- **Pros**: Google Cloud integration, good performance, managed backups
- **Cons**: Vendor lock-in, limited real-time features, complex networking

### 4. MongoDB Atlas
- **Pros**: Document-based, good for varied data structures, cloud-native
- **Cons**: Different query paradigm, less mature for financial data, learning curve

## Implementation Strategy

### Phase 1: Core Schema
- Implement base tables for vehicle data
- Set up VIN decoding RPC functions
- Create basic materialized views

### Phase 2: Performance Optimization
- Implement advanced materialized views
- Set up automated data refresh jobs
- Optimize query performance with indexes

### Phase 3: Advanced Features
- Real-time subscriptions for live updates
- Advanced audit logging
- Data archival and retention policies

## Data Migration Plan

1. **Schema Setup**: Create tables and relationships
2. **Data Import**: Bulk import historical data
3. **Function Deployment**: Deploy RPC functions and triggers
4. **View Creation**: Build materialized views
5. **Testing**: Comprehensive data validation
6. **Monitoring**: Set up performance monitoring

## Review Date
2025-07-08 (6 months from acceptance)