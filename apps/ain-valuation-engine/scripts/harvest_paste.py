#!/usr/bin/env python3
import sys, json, re

from normalize_listing import normalize_listing

TEXT = ""
if len(sys.argv) > 1:
    TEXT = open(sys.argv[1]).read()
else:
    TEXT = sys.stdin.read()

# Very lightweight patterns; extend as needed
pat = re.compile(
 r'(?P<year>20\d{2}|201\d)\s+Toyota\s+Camry\s+(?P<trim>Hybrid\s+\w+|SE|LE|XSE|XLE).*?\$?\s*(?P<price>\d{2,3}[,\d]{0,3}).*?(?P<miles>\d{1,3}[,\d]{0,3})\s*(?:mi|miles)\b',
 re.I|re.S
)

records=[]
for m in pat.finditer(TEXT):
    g=m.groupdict()
    rec={
        "source":"ManualPaste",
        "year": g["year"],
        "make":"Toyota",
        "model":"Camry",
        "trim": g["trim"],
        "price": g["price"],
        "mileage": g["miles"],
    }
    try:
        records.append(normalize_listing(rec))
    except Exception as e:
        print(f"[WARN] normalize failed: {e}")

print(json.dumps({"listings": records}, indent=2))
