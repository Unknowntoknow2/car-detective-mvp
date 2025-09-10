#!/bin/bash
set -euo pipefail

timestamp=$(date +"%Y%m%d_%H%M%S")
log_dir="logs"
log_file="$log_dir/step8_security_audit_$timestamp.log"

# Track results for summary
secrets_result="PASS"
rls_result="PASS"
pii_result="PASS"
deps_result="PASS"
error_result="PASS"

mkdir -p "$log_dir"

echo "=== Step 8 Security & Compliance Audit Started at $timestamp ===" | tee -a "$log_file"

#######################################
# 1. Secrets & Keys Audit
#######################################
echo "--- Scanning for secrets and keys in repo ---" | tee -a "$log_file"
if grep -r -i --color=never 'key\|secret\|token\|password\|api' . | grep -vE 'node_modules|.git|.env|.bak|_archive|_archive_ui|logs' | grep -q .; then
  secrets_result="FAIL"
  echo "Secrets or keys found in repo (FAIL)" | tee -a "$log_file"
else
  echo "No plaintext secrets found (PASS)" | tee -a "$log_file"
fi

if command -v trufflehog &> /dev/null; then
  echo "--- Running trufflehog for deep secret scan ---" | tee -a "$log_file"
  if trufflehog filesystem --directory . --exclude_paths .git,.env,node_modules,_archive,_archive_ui,logs --no-update | grep -q 'Reason'; then
    secrets_result="FAIL"
    echo "Trufflehog found potential secrets (FAIL)" | tee -a "$log_file"
  else
    echo "Trufflehog found no secrets (PASS)" | tee -a "$log_file"
  fi
else
  echo "trufflehog not installed, skipping deep scan." | tee -a "$log_file"
fi

echo "--- Checking .env and .gitignore ---" | tee -a "$log_file"
if grep -q '^.env' .gitignore; then
  echo ".env is in .gitignore (PASS)" | tee -a "$log_file"
else
  echo ".env is NOT in .gitignore (FAIL)" | tee -a "$log_file"
  secrets_result="FAIL"
fi

#######################################
# 2. Supabase RLS (Row-Level Security)
#######################################
echo "--- Checking Supabase migrations for RLS and policies ---" | tee -a "$log_file"
echo "--- Checking Supabase migrations for RLS and policies ---" | tee -a "$log_file"
if find supabase/migrations -type f -name '*.sql' | grep -q .; then
  if grep -i 'enable row level security' supabase/migrations/*.sql | grep -q .; then
    echo "RLS enable statements found (PASS)" | tee -a "$log_file"
  else
    echo "No RLS enable statements found (FAIL)" | tee -a "$log_file"
    rls_result="FAIL"
  fi
  if grep -i 'policy' supabase/migrations/*.sql | grep -q .; then
    echo "Policy statements found (PASS)" | tee -a "$log_file"
  else
    echo "No policy statements found (FAIL)" | tee -a "$log_file"
    rls_result="FAIL"
  fi
else
  echo "No Supabase migrations found (WARN)" | tee -a "$log_file"
  rls_result="WARN"
fi

#######################################
# 3. Data Compliance (GDPR/CCPA)
#######################################
echo "--- Checking for PII storage and consent ---" | tee -a "$log_file"
if grep -r -i --color=never 'email\|vin\|photo\|user' . | grep -vE 'node_modules|.git|.bak|_archive|_archive_ui|logs' | grep -q .; then
  pii_result="WARN"
  echo "Potential PII found (WARN)" | tee -a "$log_file"
else
  echo "No PII found (PASS)" | tee -a "$log_file"
fi

echo "--- Checking for audit log anonymization and retention ---" | tee -a "$log_file"
# Only log if audit log files are found
if grep -r -i 'audit' . | grep -vE 'node_modules|.git|.bak|_archive|_archive_ui|logs' | grep -q .; then
  echo "Audit log references found (INFO)" | tee -a "$log_file"
else
  echo "No audit log references found (INFO)" | tee -a "$log_file"
fi

#######################################
# 4. Dependency Vulnerabilities
#######################################
echo "--- Running npm audit --production ---" | tee -a "$log_file"
audit_out=$(npm audit --production)
if echo "$audit_out" | grep -q 'high\|critical'; then
  echo "High or critical vulnerabilities found (FAIL)" | tee -a "$log_file"
  deps_result="FAIL"
else
  echo "No high/critical vulnerabilities (PASS)" | tee -a "$log_file"
fi

if npm audit --production | grep -q 'high\|critical'; then
  echo "High or critical vulnerabilities found (FAIL)" | tee -a "$log_file"
  exit 1
else
  echo "No high/critical vulnerabilities (PASS)" | tee -a "$log_file"
fi

#######################################
# 5. Error/Crash Safety
#######################################
echo "--- Checking for React error boundaries ---" | tee -a "$log_file"
if grep -R 'ErrorBoundary' src/components/ | grep -q .; then
  echo "Error boundaries found (PASS)" | tee -a "$log_file"
else
  echo "No error boundaries found (WARN)" | tee -a "$log_file"
  error_result="WARN"
fi

echo "--- Checking valuation engine error handling ---" | tee -a "$log_file"
if grep -R 'catch\|try' src/ain-backend/valuationEngine.ts | grep -q .; then
  echo "Error handling found in valuation engine (PASS)" | tee -a "$log_file"
else
  echo "No error handling found in valuation engine (FAIL)" | tee -a "$log_file"
  error_result="FAIL"
fi

echo "=== Step 8 Security & Compliance Audit Completed at $(date +"%Y%m%d_%H%M%S") ===" | tee -a "$log_file"

# Final summary table
echo "" | tee -a "$log_file"
echo "==================== SECURITY & COMPLIANCE SUMMARY ====================" | tee -a "$log_file"
printf "%-30s %-10s\n" "Check" "Result" | tee -a "$log_file"
printf "%-30s %-10s\n" "------------------------------" "----------" | tee -a "$log_file"
printf "%-30s %-10s\n" "Secrets & Keys" "$secrets_result" | tee -a "$log_file"
printf "%-30s %-10s\n" "Supabase RLS" "$rls_result" | tee -a "$log_file"
printf "%-30s %-10s\n" "Data Compliance (PII)" "$pii_result" | tee -a "$log_file"
printf "%-30s %-10s\n" "Dependency Vulnerabilities" "$deps_result" | tee -a "$log_file"
printf "%-30s %-10s\n" "Error/Crash Safety" "$error_result" | tee -a "$log_file"
echo "======================================================================" | tee -a "$log_file"
echo "" | tee -a "$log_file"
