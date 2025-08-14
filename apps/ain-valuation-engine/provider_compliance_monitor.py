"""
Provider Compliance Monitor
- Tracks ToS/robots.txt for all VIN providers
- Detects changes and logs/alerts for compliance
- FAANG-level: modular, extensible, ready for scheduler/alert integration
"""
import requests
import logging
import hashlib
import os
import json
from datetime import datetime

PROVIDERS = {
    "NHTSA": {
        "tos_url": "https://vpic.nhtsa.dot.gov/api/",
        "robots_url": "https://vpic.nhtsa.dot.gov/robots.txt"
    },
    # Add more providers as needed
}

COMPLIANCE_LOG = "provider_compliance_log.json"


def fetch_url(url):
    try:
        resp = requests.get(url, timeout=10)
        resp.raise_for_status()
        return resp.text
    except Exception as e:
        logging.error(f"Failed to fetch {url}: {e}")
        return None

def hash_content(content):
    return hashlib.sha256(content.encode("utf-8")).hexdigest()

def load_log():
    if os.path.exists(COMPLIANCE_LOG):
        with open(COMPLIANCE_LOG, "r") as f:
            return json.load(f)
    return {}

def save_log(log):
    with open(COMPLIANCE_LOG, "w") as f:
        json.dump(log, f, indent=2)

def check_provider_compliance():
    log = load_log()
    alerts = []
    for name, meta in PROVIDERS.items():
        for key in ["tos_url", "robots_url"]:
            url = meta[key]
            content = fetch_url(url)
            if content is None:
                continue
            h = hash_content(content)
            prev = log.get(name, {}).get(key)
            if prev and prev != h:
                alert = f"[ALERT] {name} {key} changed at {datetime.utcnow().isoformat()}"
                logging.warning(alert)
                alerts.append(alert)
            log.setdefault(name, {})[key] = h
    save_log(log)
    return alerts

if __name__ == "__main__":
    alerts = check_provider_compliance()
    if alerts:
        print("\n".join(alerts))
    else:
        print("No compliance changes detected.")
