# Automated Monitoring Setup Instructions

This document describes how to schedule and monitor the automated quality assurance script for the AIN Valuation Engine.

## 1. Script Overview
- `automated_monitoring.py` runs the golden VIN test suite and recall enrichment for selected VINs.
- All results and errors are logged to `monitoring.log` for review and alerting.

## 2. Scheduling with Cron (Linux)
1. Open your crontab editor:
   ```bash
   crontab -e
   ```
2. Add the following line to run the script daily at 2:00 AM:
   ```bash
   0 2 * * * cd /workspaces/ain-valuation-engine && /usr/bin/python3 automated_monitoring.py
   ```
   - Adjust the path to `python3` if needed (use `which python3` to confirm).
   - Change the schedule as desired (see https://crontab.guru/ for syntax).

## 3. Monitoring & Alerting
- Review `monitoring.log` regularly for errors or anomalies.
- For advanced alerting, integrate with email, Slack, or monitoring tools (see below).

## 4. Optional: Email/Slack Alerts
- Use tools like `sendmail`, `mailx`, or Slack webhooks to send alerts on error log entries.
- Example (email on error):
   ```bash
   grep ERROR monitoring.log | mail -s "AIN Monitoring Alert" youremail@example.com
   ```
- For real-time alerting, consider a simple script or log monitoring service.

## 5. Maintenance
- Update the list of golden VINs in `automated_monitoring.py` as needed.
- Periodically review and rotate logs for disk space management.

---
For questions or improvements, see the project documentation or contact the maintainer.
