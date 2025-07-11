# Valuation Platform - Dynamic Data Sources Audit

**Generated:** `${new Date().toISOString()}`  
**Purpose:** Complete transparency of all dynamic data sources used in vehicle valuations

## 🔍 OVERVIEW

This document provides a comprehensive audit of all dynamic data sources used in the valuation platform. **NO HARDCODED VALUES** are used in production calculations.

---

## 📊 CORE VALUATION DATA SOURCES

### 1. **VIN Decoding Services**
- **Source:** `supabase/functions/decode-vin`
- **Purpose:** Extract vehicle specifications from VIN
- **Data Retrieved:** Make, model, year, trim, engine, transmission, body type
- **Table:** `decoded_vehicles`
- **Frequency:** Real-time per VIN request

### 2. **Market Listings Search**
- **Source:** `supabase/functions/openai-web-search`
- **Purpose:** Find current market listings for similar vehicles
- **Data Retrieved:** Price, mileage, condition, dealer, location, listing URL
- **Table:** `market_listings`
- **Frequency:** Real-time per valuation request

### 3. **MSRP Data**
- **Source:** OEM manufacturer data, industry databases
- **Purpose:** Baseline vehicle pricing before adjustments
- **Data Retrieved:** Original manufacturer suggested retail price
- **Storage:** Calculated dynamically or cached in valuation logic
- **Frequency:** Updated per model year/trim

### 4. **Auction Results**
- **Source:** `supabase/functions/fetch-auction-data`
- **Purpose:** Historical sale prices for price validation
- **Data Retrieved:** Sale price, condition, mileage, auction house
- **Table:** `auction_results_by_vin`
- **Frequency:** Batch updates, triggered by VIN lookup

---

## 🔧 ADJUSTMENT FACTORS (DATABASE-DRIVEN)

### 5. **Vehicle Condition Adjustments**
- **Table:** `condition_descriptions`
- **Fields:** `condition_level`, `value_impact`, `description`
- **Purpose:** Apply condition-based price multipliers
- **Source:** Industry standard condition guidelines

### 6. **Equipment & Features**
- **Table:** `features`
- **Fields:** `name`, `category`, `value_impact`
- **Purpose:** Add/subtract value for optional equipment
- **Source:** OEM option pricing, market research

### 7. **Color Adjustments**
- **Table:** `color_adjustment`
- **Fields:** `color`, `category`, `multiplier`
- **Purpose:** Adjust for color popularity/rarity
- **Source:** Market demand analysis

### 8. **Fuel Type Adjustments**
- **Table:** `fuel_type_adjustment`
- **Fields:** `type`, `multiplier`, `description`
- **Purpose:** Adjust for fuel efficiency impact on value
- **Source:** Market preference data

### 9. **Regional Market Adjustments**
- **Table:** `market_adjustments`
- **Fields:** `zip_code`, `market_multiplier`, `last_updated`
- **Purpose:** Regional pricing variations
- **Source:** ZIP code market analysis

---

## 👥 USER-PROVIDED DATA

### 10. **Follow-up Questionnaire**
- **Table:** `follow_up_answers`
- **Fields:** Vehicle condition, accidents, modifications, service history
- **Purpose:** Personalized condition assessment
- **Source:** User input via questionnaire

### 11. **Photo Analysis (AI)**
- **Table:** `ai_photo_analysis`
- **Fields:** `condition_score`, `damage_detected`, `features_detected`
- **Purpose:** AI-driven condition assessment
- **Source:** Computer vision analysis of uploaded photos

---

## 🔍 VALIDATION & QUALITY DATA

### 12. **Competitor Pricing**
- **Table:** `competitor_prices`
- **Fields:** `kbb_value`, `carvana_value`, `vin`
- **Purpose:** Cross-reference with major platforms
- **Source:** External API calls to pricing services

### 13. **Recall Information**
- **Table:** `recalls_cache`
- **Fields:** `recalls_data`, `make`, `model`, `year`
- **Purpose:** Factor in open recalls affecting value
- **Source:** NHTSA recall database

### 14. **Regional Fuel Costs**
- **Table:** `regional_fuel_costs`
- **Fields:** `fuel_type`, `cost_per_gallon`, `zip_code`
- **Purpose:** Regional operating cost impact
- **Source:** Energy Information Administration (EIA)

---

## 📈 MARKET INTELLIGENCE

### 15. **Market Context Data**
- **Table:** `market_context_data`
- **Fields:** `market_temperature`, `avg_days_on_market`, `supply_demand_ratio`
- **Purpose:** Market timing and demand factors
- **Source:** Aggregated listing analysis

### 16. **Market Comparables**
- **Table:** `market_comps`
- **Fields:** `price`, `mileage`, `condition`, `features`, `confidence_score`
- **Purpose:** Similar vehicle pricing benchmarks
- **Source:** Web scraping, dealer feeds, auction data

---

## 🛡️ DATA INTEGRITY CONTROLS

### **Audit Logging**
- **Table:** `compliance_audit_log`
- **Purpose:** Track all data sources used in each valuation
- **Fields:** `data_sources_used`, `input_data`, `output_data`, `processing_time_ms`

### **Quality Assurance**
- **Table:** `qa_reports`
- **Purpose:** Monitor data quality and outlier detection
- **Fields:** `outliers_detected`, `missing_data_flags`, `source_failures`

### **Fraud Detection**
- **Table:** `fraud_detection_flags`
- **Purpose:** Identify suspicious listings or data manipulation
- **Fields:** `flag_type`, `confidence_score`, `auto_flagged`

---

## ✅ VALIDATION PROCESS

Each valuation calculation follows this data validation flow:

1. **VIN Validation** → Decode vehicle specifications
2. **Market Search** → Find current listings and comparables  
3. **Historical Analysis** → Check auction results and trends
4. **Regional Adjustment** → Apply local market factors
5. **Condition Assessment** → User input + AI photo analysis
6. **Feature Detection** → Equipment and option identification
7. **Quality Check** → Outlier detection and confidence scoring
8. **Audit Trail** → Log all sources used

---

## 🔒 PRODUCTION SAFEGUARDS

- **No Hardcoded Values:** All calculations use dynamic database lookups
- **Real-time Data:** Market listings fetched live per request
- **Source Attribution:** Every price factor traced to specific data source
- **Confidence Scoring:** Transparency about data quality and completeness
- **Audit Logging:** Complete trail of data sources used in each valuation

---

## 📞 DATA SOURCE VERIFICATION

To verify any calculation:
1. Check `compliance_audit_log` table for specific valuation ID
2. Review `data_sources_used` field for complete source list
3. Cross-reference with individual source tables
4. Validate against `qa_reports` for data quality metrics

**All data is sourced dynamically - no artificial inflation or manipulation.**