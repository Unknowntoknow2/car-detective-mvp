
import mlflow
import os

def register_latest_model(experiment_name="ain_valuation_xgb", stage="Staging"):
	client = mlflow.tracking.MlflowClient()
	experiment = client.get_experiment_by_name(experiment_name)
	if not experiment:
		raise ValueError(f"Experiment {experiment_name} not found")
	runs = client.search_runs(experiment.experiment_id, order_by=["metrics.mae ASC"])
	if not runs:
		raise ValueError("No runs found")
	best_run = runs[0]
	model_uri = f"runs:/{best_run.info.run_id}/model"
	result = mlflow.register_model(model_uri, experiment_name)
	client.transition_model_version_stage(
		name=experiment_name,
		version=result.version,
		stage=stage,
		archive_existing_versions=True
	)
	print(f"Registered model version {result.version} to stage {stage}")

if __name__ == "__main__":
	register_latest_model()
