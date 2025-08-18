"""
Airflow DAG for End-to-End Vehicle Valuation AI Pipeline
- Ingests from NHTSA, commercial APIs, Nuelinks, auctions, dealer feeds
- Normalizes, enriches, and stores data
- Triggers model training, evaluation, and explainability
- Logs compliance and provenance
"""
from airflow import DAG
from airflow.operators.bash import BashOperator
from airflow.operators.python import PythonOperator
from airflow.sensors.external_task import ExternalTaskSensor
from airflow.utils.dates import days_ago
from datetime import timedelta
import logging

default_args = {
    'owner': 'vehicle_valuation',
    'depends_on_past': False,
    'email_on_failure': True,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=10),
}

dag = DAG(
    'vehicle_valuation_pipeline',
    default_args=default_args,
    description='End-to-end vehicle valuation AI pipeline',
    schedule_interval=timedelta(hours=1),
    start_date=days_ago(1),
    catchup=False,
)

ingest_nhtsa = BashOperator(
    task_id='ingest_nhtsa',
    bash_command='python3 fetch_marketplace_data.py',
    dag=dag,
)

ingest_commercial = BashOperator(
    task_id='ingest_commercial',
    bash_command='python3 openai_batch_acquisition.py',
    dag=dag,
)

ingest_nuelinks = BashOperator(
    task_id='ingest_nuelinks',
    bash_command='python3 fetch_nuelinks_data.py',
    dag=dag,
)

normalize_enrich = BashOperator(
    task_id='normalize_enrich',
    bash_command='python3 canonical_vehicle_schema.py',
    dag=dag,
)

train_model = BashOperator(
    task_id='train_model',
    bash_command='python3 train_market_value_model.py',
    dag=dag,
)

evaluate_model = BashOperator(
    task_id='evaluate_model',
    bash_command='python3 evaluate_market_value_model.py',
    dag=dag,
)

explainability = BashOperator(
    task_id='explainability',
    bash_command='python3 shap_explainability.py',
    dag=dag,
)

compliance_monitor = BashOperator(
    task_id='compliance_monitor',
    bash_command='python3 provider_compliance_monitor.py',
    dag=dag,
)


# Batch pipeline orchestration
[ingest_nhtsa, ingest_commercial, ingest_nuelinks] >> normalize_enrich >> train_model >> evaluate_model >> explainability
normalize_enrich >> compliance_monitor

# Streaming pipeline orchestration (Kafka trigger)
streaming_sensor = BashOperator(
    task_id='start_streaming_consumer',
    bash_command='python3 vehicle_streaming_consumer.py',
    dag=dag,
)

# Provenance/monitoring hooks (could be PythonOperator for custom logic)
def log_streaming_provenance():
    print("Streaming provenance and monitoring active.")

provenance_monitor = PythonOperator(
    task_id='streaming_provenance_monitor',
    python_callable=log_streaming_provenance,
    dag=dag,
)

streaming_sensor >> provenance_monitor
