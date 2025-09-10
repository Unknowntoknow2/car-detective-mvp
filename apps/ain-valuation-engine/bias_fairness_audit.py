"""
Bias Detection, Trust Scoring, and Fairness Auditing for Vehicle Valuation AI
- Audits model predictions for bias across sensitive features (e.g., location, make, year)
- Computes trust scores and fairness metrics
- Logs and reports results for compliance and dashboarding
"""
import pandas as pd
import numpy as np
import json

AUDIT_LOG = 'bias_fairness_audit_log.jsonl'

SENSITIVE_FEATURES = ['location', 'make', 'year']


def compute_group_metrics(df, feature, target='price', pred='predicted_price'):
    groups = df.groupby(feature)
    metrics = {}
    for name, group in groups:
        mae = np.mean(np.abs(group[target] - group[pred]))
        metrics[name] = {'mae': mae, 'count': len(group)}
    return metrics

def audit_bias_fairness(df):
    audit_results = {}
    for feat in SENSITIVE_FEATURES:
        metrics = compute_group_metrics(df, feat)
        audit_results[feat] = metrics
    # Trust score: inverse of max group MAE difference
    max_diff = max(
        max([m['mae'] for m in metrics.values()]) - min([m['mae'] for m in metrics.values()])
        for metrics in audit_results.values()
    )
    trust_score = 1.0 - min(max_diff / 10000, 1.0)  # Example scaling
    audit_results['trust_score'] = trust_score
    with open(AUDIT_LOG, 'a') as f:
        f.write(json.dumps(audit_results) + '\n')
    print(f"Bias/fairness audit complete. Trust score: {trust_score:.3f}")
    return audit_results

if __name__ == "__main__":
    # Example usage
    df = pd.DataFrame([
        {'location': 'NY', 'make': 'TOYOTA', 'year': 2020, 'price': 25000, 'predicted_price': 25200},
        {'location': 'CA', 'make': 'HONDA', 'year': 2020, 'price': 22000, 'predicted_price': 22500},
        {'location': 'NY', 'make': 'TOYOTA', 'year': 2019, 'price': 24000, 'predicted_price': 23800},
    ])
    audit_bias_fairness(df)
