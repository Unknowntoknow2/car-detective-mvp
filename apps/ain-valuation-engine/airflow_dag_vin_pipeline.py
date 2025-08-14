"""
Airflow DAG template for scheduling VIN pipeline compliance and health checks.
"""
from airflow import DAG
from airflow.operators.bash import BashOperator
from airflow.utils.dates import days_ago
from datetime import timedelta

default_args = {
    'owner': 'vin_pipeline',
    'depends_on_past': False,
    'email_on_failure': True,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

dag = DAG(
    'vin_pipeline_compliance_monitor',
    default_args=default_args,
    description='VIN pipeline compliance and provider health monitoring',
    schedule_interval=timedelta(hours=1),
    start_date=days_ago(1),
    catchup=False,
)

compliance_check = BashOperator(
    task_id='run_compliance_monitor',
    bash_command='python3 provider_compliance_monitor.py',
    dag=dag,
)

health_check = BashOperator(
    task_id='run_pipeline_health_check',
    bash_command='python3 vin_pipeline_metrics_exporter.py',
    dag=dag,
)

compliance_check >> health_check
