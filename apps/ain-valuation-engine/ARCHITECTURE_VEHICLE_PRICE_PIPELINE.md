# Vehicle Price Evaluation Pipeline: Architecture Overview

```
+-------------------+      +-------------------+      +-------------------+      +-------------------+
|  Data Acquisition |----->|  Data Processing  |----->|   ML Valuation    |----->|    API Layer      |
| (Airflow, Scrapy) |      | (Pandas, Kafka)   |      | (XGBoost, SHAP)   |      | (FastAPI, gRPC)   |
+-------------------+      +-------------------+      +-------------------+      +-------------------+
        |                        |                        |                          |
        v                        v                        v                          v
+-------------------+      +-------------------+      +-------------------+      +-------------------+
|  External APIs    |      |  Feature Store    |      |  Explainability   |      | Monitoring/Alert  |
| (NHTSA, EPA, etc) |      | (Feast, Redis)    |      | (SHAP, LIME)      |      | (Prometheus, ELK) |
+-------------------+      +-------------------+      +-------------------+      +-------------------+
        |                        |                        |                          |
        v                        v                        v                          v
+-------------------+      +-------------------+      +-------------------+      +-------------------+
|  Data Lake/DB     |      |  BI/Dashboards    |      |  CI/CD & Security |      | Compliance/Logs   |
| (BigQuery, S3)    |      | (Tableau, Grafana)|      | (Docker, Vault)   |      | (Audit, ToS)      |
+-------------------+      +-------------------+      +-------------------+      +-------------------+
```

**Key Flows:**
- Data is acquired from compliant sources and APIs, processed and streamed via Kafka, and stored in a feature store and data lake.
- ML models (XGBoost) predict vehicle prices; SHAP provides explainability.
- FastAPI exposes predictions and explanations as a microservice.
- Prometheus and Grafana monitor health, compliance, and performance.
- CI/CD, security, and compliance are enforced throughout.
