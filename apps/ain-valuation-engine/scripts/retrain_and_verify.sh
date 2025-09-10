#!/usr/bin/env bash
set -euo pipefail

# fresh env (optional if you already activated .venv)
python -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# clean legacy artifacts
rm -f artifacts/model.joblib artifacts/pipeline.joblib artifacts/model_bundle.joblib

# retrain (saves bundle['pipe'])
PYTHONPATH=. python val_engine/train_tabular.py

# inspect
PYTHONPATH=. python scripts/inspect_artifact.py artifacts/model_bundle.joblib

# smoke
PYTHONPATH=. python scripts/smoke_predict.py

# tests
pytest
echo "Retrain + verify: OK"
