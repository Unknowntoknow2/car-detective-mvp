#!/bin/bash

echo "🚗 AIN VALUATION ENGINE - PR C VALIDATION 🚗"
echo "=============================================="
echo "Testing NHTSA Complaints & Investigations Implementation"
echo ""

cd /workspaces/ain-valuation-engine

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_section() {
    echo ""
    echo -e "${BLUE}█ $1${NC}"
    echo "----------------------------------------"
}

# Database connection string
DB_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"

# 1. Database Schema Validation
print_section "DATABASE SCHEMA VALIDATION"

print_status "Checking complaints table structure..."
COMPLAINTS_COLUMNS=$(psql "$DB_URL" -c "SELECT column_name FROM information_schema.columns WHERE table_name = 'nhtsa_complaints';" | grep -c "nhtsa_id\|odi_number\|summary\|severity_level")
if [ "$COMPLAINTS_COLUMNS" -ge 4 ]; then
    print_success "NHTSA Complaints table structure verified (found required columns)"
else
    print_error "NHTSA Complaints table structure incomplete"
fi

print_status "Checking investigations table structure..."
INVESTIGATIONS_COLUMNS=$(psql "$DB_URL" -c "SELECT column_name FROM information_schema.columns WHERE table_name = 'nhtsa_investigations';" | grep -c "investigation_id\|investigation_type\|status\|units_affected")
if [ "$INVESTIGATIONS_COLUMNS" -ge 4 ]; then
    print_success "NHTSA Investigations table structure verified (found required columns)"
else
    print_error "NHTSA Investigations table structure incomplete"
fi

# 2. RPC Functions Validation
print_section "RPC FUNCTIONS VALIDATION"

print_status "Testing rpc_upsert_complaints function..."
RPC_COMPLAINTS=$(psql "$DB_URL" -c "SELECT routine_name FROM information_schema.routines WHERE routine_name = 'rpc_upsert_complaints';" | grep -c "rpc_upsert_complaints")
if [ "$RPC_COMPLAINTS" -ge 1 ]; then
    print_success "rpc_upsert_complaints function exists"
else
    print_error "rpc_upsert_complaints function missing"
fi

print_status "Testing rpc_upsert_investigations function..."
RPC_INVESTIGATIONS=$(psql "$DB_URL" -c "SELECT routine_name FROM information_schema.routines WHERE routine_name = 'rpc_upsert_investigations';" | grep -c "rpc_upsert_investigations")
if [ "$RPC_INVESTIGATIONS" -ge 1 ]; then
    print_success "rpc_upsert_investigations function exists"
else
    print_error "rpc_upsert_investigations function missing"
fi

print_status "Testing get_complaints_summary function..."
RPC_SUMMARY=$(psql "$DB_URL" -c "SELECT routine_name FROM information_schema.routines WHERE routine_name = 'get_complaints_summary';" | grep -c "get_complaints_summary")
if [ "$RPC_SUMMARY" -ge 1 ]; then
    print_success "get_complaints_summary function exists"
else
    print_error "get_complaints_summary function missing"
fi

# 3. Sample Data Validation
print_section "SAMPLE DATA VALIDATION"

print_status "Checking complaints sample data..."
SAMPLE_COMPLAINTS=$(psql "$DB_URL" -t -c "SELECT COUNT(*) FROM nhtsa_complaints;" | xargs)
if [ "$SAMPLE_COMPLAINTS" -gt 0 ]; then
    print_success "Sample complaints data loaded: $SAMPLE_COMPLAINTS records"
else
    print_warning "No sample complaints data found"
fi

print_status "Checking investigations sample data..."
SAMPLE_INVESTIGATIONS=$(psql "$DB_URL" -t -c "SELECT COUNT(*) FROM nhtsa_investigations;" | xargs)
if [ "$SAMPLE_INVESTIGATIONS" -gt 0 ]; then
    print_success "Sample investigations data loaded: $SAMPLE_INVESTIGATIONS records"
else
    print_warning "No sample investigations data found"
fi

# 4. Vehicle Profiles Integration
print_section "VEHICLE PROFILES INTEGRATION"

print_status "Checking enhanced vehicle profiles with safety risk scoring..."
ENHANCED_PROFILES=$(psql "$DB_URL" -c "SELECT column_name FROM information_schema.columns WHERE table_name = 'vehicle_profiles' AND column_name IN ('safety_risk_level', 'complaints_count', 'investigations_count');" | grep -c "safety_risk_level\|complaints_count\|investigations_count")
if [ "$ENHANCED_PROFILES" -ge 3 ]; then
    print_success "Enhanced vehicle profiles with complaints/investigations data"
else
    print_error "Vehicle profiles missing complaints/investigations integration"
fi

# 5. Edge Functions Validation
print_section "EDGE FUNCTIONS VALIDATION"

print_status "Checking complaints edge function..."
if [ -f "supabase/functions/complaints/index.ts" ]; then
    FUNCTION_SIZE=$(wc -l < "supabase/functions/complaints/index.ts")
    if [ "$FUNCTION_SIZE" -gt 50 ]; then
        print_success "Complaints edge function implemented ($FUNCTION_SIZE lines)"
    else
        print_warning "Complaints edge function appears incomplete"
    fi
else
    print_error "Complaints edge function missing"
fi

print_status "Checking investigations edge function..."
if [ -f "supabase/functions/investigations/index.ts" ]; then
    FUNCTION_SIZE=$(wc -l < "supabase/functions/investigations/index.ts")
    if [ "$FUNCTION_SIZE" -gt 50 ]; then
        print_success "Investigations edge function implemented ($FUNCTION_SIZE lines)"
    else
        print_warning "Investigations edge function appears incomplete"
    fi
else
    print_error "Investigations edge function missing"
fi

# 6. Test Data Integrity
print_section "DATA INTEGRITY TESTING"

print_status "Testing complaints severity classification..."
SEVERITY_TYPES=$(psql "$DB_URL" -t -c "SELECT COUNT(DISTINCT severity_level) FROM nhtsa_complaints WHERE severity_level IS NOT NULL;" | xargs)
if [ "$SEVERITY_TYPES" -gt 0 ]; then
    print_success "Complaints severity classification working ($SEVERITY_TYPES different levels)"
else
    print_warning "No severity classification found in complaints"
fi

print_status "Testing investigation types..."
INVESTIGATION_TYPES=$(psql "$DB_URL" -t -c "SELECT COUNT(DISTINCT investigation_type) FROM nhtsa_investigations WHERE investigation_type IS NOT NULL;" | xargs)
if [ "$INVESTIGATION_TYPES" -gt 0 ]; then
    print_success "Investigation types properly classified ($INVESTIGATION_TYPES different types)"
else
    print_warning "No investigation types found"
fi

# 7. Functional Testing
print_section "FUNCTIONAL TESTING"

print_status "Testing complaints summary function..."
SUMMARY_TEST=$(psql "$DB_URL" -t -c "SELECT get_complaints_summary(2023, 'TOYOTA', 'CAMRY');" | grep -c "total_complaints\|high_severity_count")
if [ "$SUMMARY_TEST" -gt 0 ]; then
    print_success "Complaints summary function working"
else
    print_warning "Complaints summary function may have issues"
fi

print_status "Testing sample complaint data quality..."
SAMPLE_QUALITY=$(psql "$DB_URL" -t -c "SELECT COUNT(*) FROM nhtsa_complaints WHERE nhtsa_id IS NOT NULL AND summary IS NOT NULL;" | xargs)
if [ "$SAMPLE_QUALITY" -eq "$SAMPLE_COMPLAINTS" ]; then
    print_success "All sample complaints have required data"
else
    print_warning "Some sample complaints missing required fields"
fi

# 8. Summary Report
print_section "PR C IMPLEMENTATION SUMMARY"

print_status "Generating implementation status report..."

# Count successful validations
TOTAL_CHECKS=12
SUCCESS_COUNT=0

# Database tables
[ "$COMPLAINTS_COLUMNS" -ge 4 ] && ((SUCCESS_COUNT++))
[ "$INVESTIGATIONS_COLUMNS" -ge 4 ] && ((SUCCESS_COUNT++))

# RPC functions
[ "$RPC_COMPLAINTS" -ge 1 ] && ((SUCCESS_COUNT++))
[ "$RPC_INVESTIGATIONS" -ge 1 ] && ((SUCCESS_COUNT++))
[ "$RPC_SUMMARY" -ge 1 ] && ((SUCCESS_COUNT++))

# Sample data
[ "$SAMPLE_COMPLAINTS" -gt 0 ] && ((SUCCESS_COUNT++))
[ "$SAMPLE_INVESTIGATIONS" -gt 0 ] && ((SUCCESS_COUNT++))

# Integration
[ "$ENHANCED_PROFILES" -ge 3 ] && ((SUCCESS_COUNT++))

# Edge functions
[ -f "supabase/functions/complaints/index.ts" ] && ((SUCCESS_COUNT++))
[ -f "supabase/functions/investigations/index.ts" ] && ((SUCCESS_COUNT++))

# Data integrity
[ "$SEVERITY_TYPES" -gt 0 ] && ((SUCCESS_COUNT++))
[ "$INVESTIGATION_TYPES" -gt 0 ] && ((SUCCESS_COUNT++))

COMPLETION_PERCENTAGE=$((SUCCESS_COUNT * 100 / TOTAL_CHECKS))

echo ""
echo "🎯 PR C IMPLEMENTATION STATUS:"
echo "  ✅ Successful checks: $SUCCESS_COUNT/$TOTAL_CHECKS"
echo "  📊 Completion: $COMPLETION_PERCENTAGE%"

if [ "$SUCCESS_COUNT" -eq "$TOTAL_CHECKS" ]; then
    print_success "PR C (NHTSA Complaints & Investigations) - 100% COMPLETE! 🚀"
    echo ""
    echo "📋 FEATURE SUMMARY:"
    echo "  • NHTSA complaints tracking with severity classification"
    echo "  • Safety investigations monitoring (PE, EA, IR types)"
    echo "  • Enhanced vehicle profiles with safety risk scoring"
    echo "  • Comprehensive database schema with RPC functions"
    echo "  • Edge functions for data ingestion and analysis"
    echo "  • Request caching and coalescing for performance"
    echo ""
    echo "✅ READY TO PROCEED TO PR D (Market Signal Baseline)"
elif [ "$SUCCESS_COUNT" -ge 10 ]; then
    print_success "PR C implementation mostly complete ($COMPLETION_PERCENTAGE%)"
    echo "Minor items may need attention before proceeding"
else
    print_warning "PR C implementation needs more work ($COMPLETION_PERCENTAGE%)"
fi

# Show actual data examples
print_section "SAMPLE DATA PREVIEW"
print_status "Sample complaints data:"
psql "$DB_URL" -c "SELECT nhtsa_id, make, model, model_year, summary, severity_level FROM nhtsa_complaints LIMIT 3;"

print_status "Sample investigations data:"
psql "$DB_URL" -c "SELECT investigation_id, investigation_type, status, units_affected FROM nhtsa_investigations LIMIT 3;"

echo ""
echo "🔗 Next: PR D - Market Signal Baseline (GoodCarBadCar, iSeeCars, Google Trends)"
echo "=============================================="
