# Supabase Database Setup Guide

This directory contains SQL migration scripts to create the complete database schema for the AIN Valuation Engine.

## 📁 Migration Files

| File | Description |
|------|-------------|
| `20250808000001_create_core_tables.sql` | Core tables with PKs, FKs, indexes, RLS policies |
| `20250808000002_create_views_and_functions.sql` | Materialized views and utility functions |
| `20250808000003_insert_sample_data.sql` | Sample data for testing and development |

## 🚀 Quick Setup

### Prerequisites
- [Supabase CLI installed](https://supabase.com/docs/guides/cli)
- Project initialized with `supabase init`

### Apply Migrations

```bash
# Navigate to project root
cd /workspaces/ain-valuation-engine

# Start local Supabase
supabase start

# Apply all migrations
supabase db push

# Or apply individually
supabase db push --file supabase/migrations/20250808000001_create_core_tables.sql
supabase db push --file supabase/migrations/20250808000002_create_views_and_functions.sql
supabase db push --file supabase/migrations/20250808000003_insert_sample_data.sql
```

### Remote Deployment

```bash
# Link to remote project
supabase link --project-ref YOUR_PROJECT_REF

# Push to production
supabase db push --linked
```

## 📊 Database Schema Overview

### Core Tables

```
vehicle_specs (PK: vin)
├── Basic vehicle info from NHTSA decode
├── Engine, transmission, safety specs
└── Manufacturing details

nhtsa_recalls (FK: vehicle_specs.vin)
├── Official NHTSA recall data
├── Campaign numbers and remedies
└── Status tracking

nhtsa_safety_ratings (FK: vehicle_specs.vin)
├── 5-star safety ratings
├── Crash test results
└── Rollover ratings

fuel_economy (FK: vehicle_specs.vin)
├── EPA MPG ratings
├── Annual fuel costs
└── Emissions data

market_listings (FK: vehicle_specs.vin)
├── Current market prices
├── Comparable vehicle data
└── Listing sources and locations

follow_up_answers (FK: vehicle_specs.vin)
├── User-provided vehicle details
├── Condition and feature data
└── Valuation inputs

valuation_history (FK: vehicle_specs.vin)
├── Historical valuation results
├── Confidence scores and explanations
└── Adjustment breakdowns
```

### Key Features

- **Row Level Security (RLS)** enabled on user data tables
- **Automatic timestamps** with update triggers
- **Materialized view** `vehicle_profiles` for efficient queries
- **Utility functions** for comparables and adjustments
- **Sample data** for immediate testing

## 🔧 Utility Functions

### Get Comparable Vehicles
```sql
SELECT * FROM get_comparable_vehicles('5YFB4MDE8SP33B447', 3, 100, 150);
```

### Calculate Valuation Adjustments
```sql
SELECT calculate_valuation_adjustments('5YFB4MDE8SP33B447', 30000.00);
```

### Market Statistics
```sql
SELECT get_market_statistics('TOYOTA', 'RAV4', 2023, 2);
```

### Refresh Profiles
```sql
SELECT refresh_vehicle_profiles();
```

## 🛡️ Security & RLS

- **Public data** (vehicle specs, safety, fuel economy) - READ access for all
- **User data** (follow-up answers, valuations) - User-specific access only
- **Anonymous access** allowed for vehicle lookups
- **JWT authentication** required for user-specific operations

## 📝 Sample Usage

```sql
-- Insert a new vehicle
INSERT INTO vehicle_specs (vin, make, model, year) 
VALUES ('1HGBH41JXMN109186', 'HONDA', 'Accord', 2021);

-- Add user input
INSERT INTO follow_up_answers (vin, mileage, condition, zip_code)
VALUES ('1HGBH41JXMN109186', 35000, 'good', '90210');

-- Get complete vehicle profile
SELECT * FROM vehicle_profiles WHERE vin = '1HGBH41JXMN109186';

-- Find comparable vehicles
SELECT * FROM get_comparable_vehicles('1HGBH41JXMN109186');
```

## 🔍 Troubleshooting

### Common Issues

1. **Migration fails**: Check for syntax errors in SQL files
2. **RLS blocking queries**: Ensure proper authentication context
3. **Function errors**: Verify all dependencies are created first

### Reset Database
```bash
supabase db reset
```

### View Logs
```bash
supabase logs
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Data Types](https://www.postgresql.org/docs/current/datatype.html)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Materialized Views](https://www.postgresql.org/docs/current/sql-creatematerializedview.html)
