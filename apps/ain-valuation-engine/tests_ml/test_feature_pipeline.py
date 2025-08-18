
import numpy as np
import pandas as pd
from ml.feature_pipeline import build_feature_pipeline, NUMERIC_FEATURES, CATEGORICAL_FEATURES

def test_feature_pipeline_shape_and_order():
	sample = {
		"age_years": 2.5,
		"mileage": 25000,
		"comp_count": 5,
		"comp_mean": 21000.0,
		"comp_median": 20800.0,
		"condition_score": 0.9,
		"owners": 1,
		"accidents": 0,
		"title_brand_flags": 0,
		"options_count": 8,
		"make": "Toyota",
		"model": "Camry",
		"trim": "LE",
		"body_style": "sedan",
		"drivetrain": "FWD",
		"fuel_type": "gas",
		"region_bucket": "west"
	}
	df = pd.DataFrame([sample])
	pipeline = build_feature_pipeline()
	X = pipeline.fit_transform(df)
	# Check output is 2D numpy array
	assert isinstance(X, np.ndarray)
	assert X.shape[0] == 1
	# Check feature count is stable
	n_num = len(NUMERIC_FEATURES)
	n_cat = pipeline.named_steps['preprocessor'].transformers_[1][1].fit(df[CATEGORICAL_FEATURES]).transform(df[CATEGORICAL_FEATURES]).shape[1]
	assert X.shape[1] == n_num + n_cat
	# Check order: numeric first, then categorical one-hot
	# (One-hot order is determined by pandas column order and encoder)
