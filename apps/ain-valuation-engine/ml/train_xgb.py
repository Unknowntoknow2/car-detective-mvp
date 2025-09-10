
import pandas as pd
import numpy as np
import xgboost as xgb
import mlflow
import joblib
from ml.feature_pipeline import build_feature_pipeline
from ml.eval_metrics import compute_metrics
import os

def load_data(path):
	return pd.read_csv(path)


def train_xgb(data_path, mlflow_uri, output_dir="artifacts", gate_metrics=None):
	mlflow.set_tracking_uri(mlflow_uri)
	df = load_data(data_path)
	y = df["target"]
	X = df.drop(columns=["target"])
	pipeline = build_feature_pipeline()
	X_proc = pipeline.fit_transform(X)
	split = int(len(df) * 0.8)
	dval = xgb.DMatrix(X_proc[split:], label=y.iloc[split:])
	dtrain2 = xgb.DMatrix(X_proc[:split], label=y.iloc[:split])
	params = {
		"objective": "reg:squarederror",
		"eval_metric": "mae",
		"max_depth": 6,
		"eta": 0.1,
		"seed": 42
	}
	with mlflow.start_run() as run:
		model = xgb.train(
			params,
			dtrain2,
			num_boost_round=500,
			evals=[(dval, "eval")],
			early_stopping_rounds=20,
			verbose_eval=False
		)
		os.makedirs(output_dir, exist_ok=True)
		model.save_model(f"{output_dir}/xgb.json")
		joblib.dump(pipeline, f"{output_dir}/pipeline.joblib")
		y_pred = model.predict(dval)
		metrics = compute_metrics(y.iloc[split:], y_pred)
		for k, v in metrics.items():
			mlflow.log_metric(k, v)
		mlflow.log_artifact(f"{output_dir}/xgb.json")
		mlflow.log_artifact(f"{output_dir}/pipeline.joblib")
		print("Validation metrics:", metrics)
		# Promotion gate logic
		if gate_metrics:
			old_mae = gate_metrics.get("mae")
			new_mae = metrics["mae"]
			if old_mae is not None and (old_mae - new_mae) < 150:
				print(f"Gate: MAE improvement {old_mae - new_mae:.2f} < $150, not promoting.")
			else:
				print(f"Gate: MAE improved by {old_mae - new_mae:.2f}, eligible for promotion.")

if __name__ == "__main__":
	import sys
	data_path = sys.argv[1]
	mlflow_uri = os.environ.get("MLFLOW_TRACKING_URI", "file:./mlruns")
	# Optionally pass old metrics for gate
	gate_metrics = None
	if len(sys.argv) > 2:
		import json
		gate_metrics = json.loads(sys.argv[2])
	train_xgb(data_path, mlflow_uri, gate_metrics=gate_metrics)
