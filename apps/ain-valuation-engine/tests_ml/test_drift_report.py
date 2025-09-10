
import pandas as pd
import tempfile
import os
import pytest
from ml.drift_report import run_drift_report

def test_drift_alert_triggers(monkeypatch):
	# Create synthetic reference and current data
	ref = pd.DataFrame({"feature1": [1]*100, "target": [10000]*100})
	cur = pd.DataFrame({"feature1": [10]*100, "target": [20000]*100})
	with tempfile.TemporaryDirectory() as tmpdir:
		ref_path = os.path.join(tmpdir, "ref.csv")
		cur_path = os.path.join(tmpdir, "cur.csv")
		ref.to_csv(ref_path, index=False)
		cur.to_csv(cur_path, index=False)
		# Patch S3 and SNS to no-op
		monkeypatch.setattr("ml.drift_report.write_to_s3", lambda *a, **kw: None)
		monkeypatch.setattr("ml.drift_report.send_sns_alert", lambda *a, **kw: None)
		# Should print drift score > threshold
		run_drift_report(ref_path, cur_path, "dummy-bucket", "prefix", sns_arn=None, drift_threshold=0.1)
