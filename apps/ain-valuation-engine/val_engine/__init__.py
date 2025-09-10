"""
AIN Valuation Engine Package

A comprehensive vehicle valuation system with ML prediction, SHAP explainability, 
and LLM-powered natural language summaries.

Modules:
    - main: Primary valuation orchestration
    - model: ML model training and prediction  
    - shap_explainer: Model interpretability with SHAP
    - llm_summary: Natural language valuation summaries
    - utils: Data loading and preprocessing utilities
"""

__version__ = "2.0.0"
__author__ = "AIN Engineering Team"

# Main exports for easy access
from .main import run_valuation, initialize_valuation_engine
from .model import predict_price_comprehensive, train_model
from .shap_explainer import explain_prediction_comprehensive
from .llm_summary import generate_valuation_summary

__all__ = [
    "run_valuation",
    "initialize_valuation_engine", 
    "predict_price_comprehensive",
    "train_model",
    "explain_prediction_comprehensive",
    "generate_valuation_summary"
]
