import pandas as pd
import csv
from collections import Counter

# Analyze golden VIN results for field completeness and decode rates

def analyze_golden_vin_results(csv_path='golden_vin_results.csv', report_path='analytics_report.md'):
    with open(csv_path, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        rows = list(reader)
    total = len(rows)
    success = sum(1 for r in rows if r.get('Success', '').lower() == 'true')
    completeness = [int(r.get('Field completeness', '0').replace('%','')) for r in rows if r.get('Field completeness')]
    avg_completeness = sum(completeness) / len(completeness) if completeness else 0
    makes = Counter(r.get('VIN', '')[:3] for r in rows)
    with open(report_path, 'w') as f:
        f.write(f"# Analytics Report\n\n")
        f.write(f"Total VINs tested: {total}\n")
        f.write(f"Decode success rate: {100*success/total:.1f}%\n")
        f.write(f"Average field completeness: {avg_completeness:.1f}%\n")
        f.write(f"\nTop 5 WMI codes (by count):\n")
        for wmi, count in makes.most_common(5):
            f.write(f"- {wmi}: {count}\n")
    print(f"Analytics report written to {report_path}")

if __name__ == "__main__":
    analyze_golden_vin_results()
