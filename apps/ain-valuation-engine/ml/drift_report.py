
import pandas as pd
import os
from evidently.report import Report
from evidently.metrics import DataDriftPreset, RegressionPerformancePreset
import boto3
import json

def load_reference_data(path):
	return pd.read_csv(path)

def load_current_data(path):
	return pd.read_csv(path)

def write_to_s3(bucket, key, content, content_type="application/json"):
	s3 = boto3.client("s3")
	s3.put_object(Bucket=bucket, Key=key, Body=content, ContentType=content_type)

def send_sns_alert(topic_arn, message):
	sns = boto3.client("sns")
	sns.publish(TopicArn=topic_arn, Message=message)

def run_drift_report(ref_path, cur_path, s3_bucket, s3_prefix, sns_arn=None, drift_threshold=0.2):
	ref = load_reference_data(ref_path)
	cur = load_current_data(cur_path)
	report = Report(metrics=[DataDriftPreset(), RegressionPerformancePreset()])
	report.run(reference_data=ref, current_data=cur)
	html = report.save_html()
	json_report = report.as_dict()
	# Write to S3
	write_to_s3(s3_bucket, f"{s3_prefix}/drift_report.html", html, content_type="text/html")
	write_to_s3(s3_bucket, f"{s3_prefix}/drift_report.json", json.dumps(json_report))
	# Check drift and alert
	drift_score = json_report['metrics'][0]['result']['drift_share']
	if drift_score > drift_threshold and sns_arn:
		send_sns_alert(sns_arn, f"AIN Valuation Engine drift detected: {drift_score:.2f}")
	print(f"Drift report complete. Drift score: {drift_score:.2f}")

if __name__ == "__main__":
	import sys
	ref_path = sys.argv[1]
	cur_path = sys.argv[2]
	s3_bucket = os.environ.get("S3_BUCKET_AIN_ML")
	s3_prefix = "drift_reports"
	sns_arn = os.environ.get("DRIFT_ALERT_SNS_ARN")
	run_drift_report(ref_path, cur_path, s3_bucket, s3_prefix, sns_arn)
