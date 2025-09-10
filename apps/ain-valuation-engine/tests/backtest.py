"""
Spec-only skeleton. Your pipeline should:
  1) Load truth dataset (train/test split as acceptance YAML).
  2) Build features via /configs/features.v1.yaml.
  3) Generate comps (cache OK) with IQR/MAD filter and radius ladder.
  4) Predict via hybrid: XGB ⊕ comp_median, or fallback curve.
  5) Score confidence & calibrated bands.
  6) Write metrics_overall.json, metrics_by_fuel.json, metrics_fallback_only.json, residuals.parquet, calibration_report.json.

Outputs must be placed in runs/<tag>/ to be used by assert_acceptance.py.
"""
