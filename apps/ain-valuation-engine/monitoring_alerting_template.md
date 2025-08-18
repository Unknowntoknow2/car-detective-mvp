# monitoring_alerting_template.md

## FAANG-Level Monitoring & Alerting for Data Acquisition

### 1. Data Freshness Monitoring
- Check last update timestamp for each source (CSV, API, or database).
- Alert if data is older than expected refresh frequency (see acquisition_schedule_template.csv).

### 2. Acquisition Failure Alerts
- Log all acquisition runs (success/failure, error messages).
- Send alert (email, Slack, etc.) if a script/API fails or returns zero records.

### 3. Compliance Monitoring
- Monitor for changes in robots.txt, API terms, or site structure.
- Alert if a source becomes non-compliant or inaccessible.

### 4. Dashboarding
- Visualize data freshness, acquisition status, and error rates in a dashboard (e.g., Grafana, Data Studio).

---

## Example: Python Monitoring Script (Pseudocode)

```python
import os
import pandas as pd
from datetime import datetime, timedelta

def check_freshness(csv_path, max_age_days):
    if not os.path.exists(csv_path):
        return False, 'File missing'
    mtime = datetime.fromtimestamp(os.path.getmtime(csv_path))
    if datetime.now() - mtime > timedelta(days=max_age_days):
        return False, f'Stale: last updated {mtime}'
    return True, 'Fresh'

# Example usage:
sources = [
    ('craigslist_listings.csv', 1),
    ('gsa_auctions_listings.csv', 7),
    # ...
]
for csv, max_age in sources:
    ok, msg = check_freshness(csv, max_age)
    if not ok:
        print(f'ALERT: {csv} - {msg}')
```

---

## Integration
- Schedule this script to run daily/weekly (cron, Airflow, etc.).
- Integrate with email/Slack for real-time alerts.
- Extend to log errors and monitor API/script health.

---

This template ensures your data pipeline is robust, reliable, and FAANG-level production ready.
