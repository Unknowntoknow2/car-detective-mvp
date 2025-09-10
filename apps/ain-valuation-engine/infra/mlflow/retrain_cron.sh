#!/bin/bash
# Nightly retrain script for AIN Valuation Engine
set -euo pipefail
DATA_PATH=${DATA_PATH:-/ml/data/latest.csv}
MLFLOW_TRACKING_URI=${MLFLOW_TRACKING_URI:-s3://ain-ml/mlflow}
python3 /ml/train_xgb.py "$DATA_PATH" "$MLFLOW_TRACKING_URI"
python3 /ml/register_model.py
