# Model Card — AIN Valuation Engine (Tabular Ridge Pipeline)

**Owner:** AIN (Auto Intelligence Network)  
**Artifact:** `artifacts/model_bundle.joblib`  
**Format:** Joblib bundle dict with keys: `pipe`, `metrics`, `feature_config`, `metadata`  
**Sklearn Version:** 1.7.0 (pinned in requirements)

## Intended Use
- Predict market value for used vehicles given structured attributes.
- Served via CLI (`val_engine/main.py`) and Flask API (`/predict`).

## Training Data
- Loaded via `val_engine/utils/data_loader.py` (see repo for source definition).
- **TARGET:** `price` (float)
- **Features:**
  - Numeric: `mileage`, `year`, `owner_count`, `engine_hp`, `mpg_city`, `mpg_highway`
  - Categorical: `make`, `model`, `trim`, `drivetrain`, `fuel_type`, `transmission`,
    `exterior_color`, `interior_color`, `state`, `zip_region`

## Pipeline
- `ColumnTransformer`:
  - Numeric → `SimpleImputer(median)` → `StandardScaler`
  - Categorical → `SimpleImputer(most_frequent)` → `OneHotEncoder(handle_unknown="ignore", sparse_output=False)`
- Estimator: `Ridge(alpha=2.0, random_state=42)`
- `sklearn.set_config(transform_output="pandas")` for stable outputs

## Metrics (validation)
- Stored inside bundle under `metrics` (MAE / RMSE / MAPE).
- Inspect via `scripts/inspect_artifact.py artifacts/model_bundle.joblib`.

## Determinism & Reproducibility
- Pinned deps in `requirements.txt`
- Random seeds set in `train_tabular.py`
- CI retrain + smoke tests
- Artifact SHA-256 recorded/verifiable

## Risks & Limitations
- Data drift (distribution shift) can degrade accuracy.
- Sparse categories, rare trims/colors can underfit.
- Region proxies (`zip_region`) are coarse.
- No photo/condition AI features in this tabular baseline.

## Change Management
- Any feature list change must update:
  - `train_tabular.py` feature lists
  - `tests/test_feature_contract.py` expected sets
- Any dependency bump must retrain and pass CI (including SHA-256 regenerate).

## Contact
- Issues: open a ticket in the AIN repo
- Owner: @farid.wolasyar
