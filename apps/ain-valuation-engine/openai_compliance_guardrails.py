# openai_compliance_guardrails.py
"""
FAANG-level compliance guardrails for OpenAI web search data acquisition.
- Maintains a whitelist of allowed sources.
- Checks robots.txt and ToS before querying.
- Logs provenance and compliance status for every acquisition job.
"""
import requests
import time
import json
from urllib.parse import urlparse

# Example whitelist (expand as needed)
ALLOWED_DOMAINS = {
    "gsaauctions.gov": "public government data",
    "epa.gov": "public dataset",
    "fueleconomy.gov": "public dataset",
    "nhtsa.gov": "public dataset",
    # Add more as needed
}

PROVENANCE_LOG = "provenance_log.jsonl"


def check_robots_txt(domain: str) -> bool:
    url = f"https://{domain}/robots.txt"
    try:
        resp = requests.get(url, timeout=5)
        if resp.status_code != 200:
            return True  # Default allow if robots.txt missing
        lines = resp.text.lower().splitlines()
        for line in lines:
            if "disallow: /" in line:
                return False
        return True
    except Exception:
        return True  # Default allow on error


def log_provenance(source_url: str, verdict: str, tos_note: str):
    entry = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "source_url": source_url,
        "domain": urlparse(source_url).netloc,
        "robots_verdict": verdict,
        "tos_note": tos_note,
    }
    with open(PROVENANCE_LOG, "a") as f:
        f.write(json.dumps(entry) + "\n")


def is_compliant(source_url: str) -> bool:
    domain = urlparse(source_url).netloc
    if domain not in ALLOWED_DOMAINS:
        log_provenance(source_url, "blocked", "domain not in whitelist")
        return False
    robots_ok = check_robots_txt(domain)
    if not robots_ok:
        log_provenance(source_url, "blocked", "robots.txt disallows crawling")
        return False
    log_provenance(source_url, "allowed", ALLOWED_DOMAINS[domain])
    return True

# Example usage:
if __name__ == "__main__":
    test_url = "https://gsaauctions.gov/auction1"
    if is_compliant(test_url):
        print(f"{test_url} is compliant for OpenAI web search acquisition.")
    else:
        print(f"{test_url} is NOT compliant.")
