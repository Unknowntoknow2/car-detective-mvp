# AIN Valuation Engine — Onboarding & Usage Guide

## Quick Start

1. **Install dependencies:**
   ```
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Retrain and Save the Model:**
   ```
   python val_engine/train_tabular.py
   ```
   - This produces `model_bundle.joblib` with keys: `['pipe', 'metrics', 'feature_config', 'metadata']`.

3. **Artifact Inspection:**
   ```
   python scripts/inspect_artifact.py
   ```

4. **Run CLI Valuation:**
   ```
   python val_engine/main.py --bundle artifacts/model_bundle.joblib
   ```

5. **Run Smoke Test:**
   ```
   python scripts/smoke_predict.py
   ```

6. **Run API Server:**
   ```
   PYTHONPATH=. python val_engine/enhanced_valuation_api.py
   ```
   - POST to `/predict` with JSON: `{ "rows": [ { ...features... } ] }`

## Updating the Model

- Retrain the model after any data or code change.
- Replace the old `model_bundle.joblib` with the new one.
- Run smoke and CLI tests to confirm.

## Adding Features / Debugging

- All code must load the pipeline using `pipeline_loader.py`.
- Never manually preprocess or reorder input columns—pass raw dicts.
- Inspect artifacts with `inspect_artifact.py`.
- Check `.github/workflows/ci.yml` for CI/CD test workflow.

## Versioning

- Each artifact includes metadata: sklearn version, config, date, git hash.
- If artifact/sklearn version mismatch at inference, a warning is logged.

## Support

For onboarding help or bug reports, file an issue or contact the core team.
