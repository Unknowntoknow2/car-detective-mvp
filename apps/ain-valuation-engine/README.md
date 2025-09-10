# AIN Car Valuation Engine

## Overview

AIN (Automotive Intelligence Network) is an enterprise-grade, AI-powered vehicle valuation engine designed to outperform legacy platforms like Kelley Blue Book (KBB), Edmunds, and even modern LLM-based solutions. AIN combines scalable data ingestion, advanced neural architectures, rigorous explainability, robust API services, and operational excellence. It is built for transparency, accuracy, and adaptability—empowering buyers, sellers, and business partners with actionable, trustworthy insights.

---

## Features

- **AI-Powered Vehicle Valuation:**
  Predict fair market values using modern ML and deep learning models.
- **Scalable Data Ingestion:**
  Automated pipelines for ingesting millions of records from diverse sources (Kaggle, EPA, NHTSA, CarAPI, and more).
- **Neural Network Support:**
  Modular pipeline for swapping tree-based (sklearn) and neural (PyTorch/TensorFlow) models.
- **Explainability:**
  SHAP for feature-level breakdowns; GPT-powered human-readable narratives for every valuation.
- **Buyer/Seller Mode:**
  Toggle to generate valuations optimized for buyers or sellers.
- **REST API (Flask/FastAPI):**
  Secure endpoints, input validation, PDF/CSV/JSON export, and robust error handling.
- **Retraining & Model Versioning:**
  CLI and automated retraining workflows with model registry, versioning, and audit trails.
- **Compliance & Security:**
  GDPR/CCPA compliant, PII redaction, authentication/authorization, audit logs.
- **Monitoring & MLOps:**
  MLFlow, Weights & Biases, Evidently, Prometheus, Grafana, Sentry.
- **Documentation & Extensibility:**
  Comprehensive API docs, setup guides, modular codebase for rapid feature expansion.

---

## Getting Started

### Prerequisites

- Python 3.9+
- Docker (optional, for containerized development)
- Node.js (for frontend/dashboard, optional)
- API keys for OpenAI GPT (for narrative generation)
- Access to Kaggle, EPA, NHTSA, CarAPI, or other vehicle datasets

### Installation

```bash
git clone https://github.com/your-org/ain-car-valuation.git
cd ain-car-valuation
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```


### Environment Setup

Create a `.env` file in the project root:

```env
OPENAI_API_KEY=your_openai_key
API_AUTH_SECRET=your_api_secret
# Commercial VIN provider (optional)
VINAUDIT_API_KEY=your_vinaudit_key
VINAUDIT_API_ENDPOINT=https://api.vinaudit.com/v2/vehicle  # optional
VINAUDIT_API_TIMEOUT=10  # optional
VINAUDIT_API_MAX_RETRIES=2  # optional
```

If using a commercial provider, set the relevant environment variables as above. The pipeline will automatically use NHTSA first, then fall back to the commercial provider if needed. See `README_VIN_DECODER_PIPELINE.md` for full details.

### Run the API

```bash
python api/app.py
```
Or use Docker Compose for multi-service orchestration:

```bash
docker-compose up --build
```

### CLI Usage

For command-line valuation:

```bash
python main.py --input '{"year": 2020, "make": "Toyota", "model": "Camry", ...}'
```
For retraining:

```bash
python val_engine/train.py --csv path/to/data.csv
```

---

## API Reference

### POST /valuation

Submit vehicle data and receive a predicted price, SHAP breakdown, and valuation narrative.

**Sample Request:**

```json
{
  "year": 2020,
  "make": "Toyota",
  "model": "Camry",
  "mileage": 45000,
  "condition": "Good",
  "location": "CA",
  "valuation_mode": "seller"
}
```

**Sample Response:**

```json
{
  "predicted_price": 19200,
  "shap": {"mileage": -1200, "condition": +500},
  "narrative": "This valuation is based on recent market listings, adjusted for mileage and condition…"
}
```

### Additional Endpoints

- **/retrain:** Trigger model retraining with new CSV data (admin only).
- **/logs/user/{user_id}:** Retrieve audit logs for a user.
- **/export:** Download valuation results in CSV or PDF.

Full OpenAPI documentation is available at `/docs` (when the server is running).

---

## Data Sources

AIN leverages diverse, free, and public datasets:

- [Kaggle Vehicle Sales Data](https://www.kaggle.com/datasets)
- [EPA Fuel Economy Data](https://www.fueleconomy.gov/feg/download.shtml)
- [NHTSA vPIC API](https://vpic.nhtsa.dot.gov/api/)
- [CarAPI.app](https://carapi.app/)
- Community datasets on GitHub

Data is versioned (DVC, LakeFS) and enriched (e.g., VIN decoding, EPA specs) for robust, real-world accuracy.

---

## Compliance & Security

- **Authentication:** JWT/OAuth, API keys, SSO (Authelia)
- **PII Redaction & Encryption:** AES-256 at rest, TLS in transit
- **Audit Trails:** Logs all predictions, retraining, API calls
- **GDPR/CCPA:** User data access/deletion, privacy policies

---

## Architecture

The AIN Valuation Engine follows a modern, scalable architecture designed for enterprise deployment:

### Core Components
- **Frontend**: React 19 with TypeScript and Vite build system
- **Backend**: Supabase with PostgreSQL database and Edge Functions
- **AI/ML Stack**: OpenAI GPT-3.5-turbo, SHAP explainability, scikit-learn models
- **Data Sources**: NHTSA vPIC, EPA, safety ratings, market listings
- **Caching**: Redis for performance optimization
- **Monitoring**: Comprehensive logging and performance metrics

For detailed architectural decisions, see [Architecture Decision Records](docs/adr/).

---

## Development Roadmap

See [CHANGELOG.md](CHANGELOG.md) for recent releases and [AIN_Enterprise_Development_Manual.md](AIN_Enterprise_Development_Manual.md) for the full roadmap, team structure, operational playbook, and contribution guide.

### Current Version: 1.2.0
- ✅ VIN decoding and vehicle specifications
- ✅ NHTSA safety ratings integration
- ✅ Safety data backfill system
- 🚧 IIHS safety ratings (in progress)
- 📋 European NCAP support (planned)

---

## Documentation

### Core Documentation
- [System Architecture](SYSTEM_DOCUMENTATION.md) - Technical system overview
- [Enterprise Manual](AIN_Enterprise_Development_Manual.md) - Complete enterprise guide
- [API Documentation](API_INTEGRATION_GUIDE.md) - API integration guide
- [Troubleshooting](TROUBLESHOOTING_GUIDE.md) - Common issues and solutions

### Developer Resources
- [Architecture Decision Records](docs/adr/) - Key architectural decisions
- [Database Schema](docs/schema/vehicle_specs.md) - Core data model documentation
- [PR History](docs/history/) - Major development milestones
- [Contributing Guide](CONTRIBUTING.md) - Development workflow and standards

---

## Contributing

- Fork and branch from `main`
- Use `feat/`, `fix/`, `docs/` prefixes in branch names
- Submit PRs with tests and documentation updates
- Run pre-commit hooks and CI before merging

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed information and [docs/history/](docs/history/) for examples of major contributions.

---

## License


## Monitoring & Best Practices
- Automated monitoring: See `automated_monitoring.py` and `AUTOMATED_MONITORING_SETUP.md`
- Error alerting: See `email_alert.py` (integrated in monitoring script)
- Best practices checklist: See `BEST_PRACTICES_CHECKLIST.md`
- Documentation index: See `DOCUMENTATION_INDEX.md`

AIN Car Valuation Engine is [MIT licensed](LICENSE).

---

## Support & Community

### External Resources
- [OpenAI API](https://openai.com/api) - AI/ML integration
- [Kaggle Datasets](https://www.kaggle.com/datasets) - Vehicle data sources
- [EPA Data](https://www.fueleconomy.gov/) - Fuel economy information
- [NHTSA API](https://vpic.nhtsa.dot.gov/api/) - Vehicle specifications and safety
- [CarAPI](https://carapi.app/) - Automotive data integration

### Project Resources
- **Issues**: GitHub Issues for bug reports and feature requests
- **Discussions**: GitHub Discussions for community questions
- **Enterprise Support**: See [AIN_Enterprise_Development_Manual.md](AIN_Enterprise_Development_Manual.md)

For questions, join discussions or open issues!

---

> **Enterprise Users**: For complete onboarding, operational playbooks, and audit documentation, see [AIN_Enterprise_Development_Manual.md](AIN_Enterprise_Development_Manual.md) and the [docs/](docs/) directory.
