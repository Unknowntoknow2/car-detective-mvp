
import numpy as np
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

NUMERIC_FEATURES = [
	"age_years", "mileage", "comp_count", "comp_mean", "comp_median",
	"condition_score", "owners", "accidents", "title_brand_flags", "options_count"
]
CATEGORICAL_FEATURES = [
	"make", "model", "trim", "body_style", "drivetrain", "fuel_type", "region_bucket"
]

def build_feature_pipeline():
	numeric_transformer = StandardScaler()
	categorical_transformer = OneHotEncoder(handle_unknown="ignore", sparse=False)
	preprocessor = ColumnTransformer(
		transformers=[
			("num", numeric_transformer, NUMERIC_FEATURES),
			("cat", categorical_transformer, CATEGORICAL_FEATURES),
		],
		remainder="drop"
	)
	pipeline = Pipeline([
		("preprocessor", preprocessor)
	])
	return pipeline
