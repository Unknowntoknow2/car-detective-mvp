from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.bash import BashOperator

default_args = {"owner": "AIN", "retries": 1, "retry_delay": timedelta(minutes=10)}
with DAG(
    dag_id="market_ingest_openai",
    default_args=default_args,
    schedule_interval="0 */8 * * *",
    start_date=datetime(2025, 8, 18),
    catchup=False,
    tags=["market", "openai"]
) as dag:
    base = "pnpm ts-node scripts/run-openai-agent.ts --zip=94103 --radius=150"
    toyota = BashOperator(task_id="ingest_toyota_camry", bash_command=f"{base} --make=Toyota --model=Camry --year=2019")
    honda  = BashOperator(task_id="ingest_honda_civic", bash_command=f"{base} --make=Honda --model=Civic --year=2018")
    toyota >> honda
