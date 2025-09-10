import logging
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
import uvicorn

from engine.inference_ensemble import InferenceEnsembleEngine
from engine.logging_config import setup_logging

setup_logging()

ENGINE_CONFIG = {
    "tabular_xgb_path": "models/tab_xgb.pkl",
    "tabular_dnn_path": "models/tab_dnn.pt",
    "image_cnn_path": "models/img_cnn.pt",
    "text_bert_path": "models/txt_bert.pt",
    "meta_learner_path": "models/meta_learner.pkl",
    "tabular_pipeline_path": "pipelines/tabular_pipe.pkl",
    "image_pipeline_path": "pipelines/image_pipe.pkl",
    "text_pipeline_path": "pipelines/text_pipe.pkl",
    "model_version_info_path": "models/version.info"
}

app = FastAPI(
    title="Valuation Ensemble Engine Explainability API",
    description="REST API for explainability (SHAP) with the stacking ensemble inference engine",
    version="1.0.0"
)

class TabularInput(BaseModel):
    data: Dict[str, Any]

class ExplainResponse(BaseModel):
    ensemble_value: float
    shap_values: Dict[str, float]
    base_model_predictions: Dict[str, float]
    model_versions: str

engine = InferenceEnsembleEngine(**ENGINE_CONFIG)
logger = logging.getLogger("explain_api")

@app.post("/explain", response_model=ExplainResponse)
async def explain(
    tabular: TabularInput,
    image: Optional[UploadFile] = File(None),
    text: Optional[str] = Form(None)
):
    try:
        image_bytes = await image.read() if image else None
        if not tabular or not tabular.data:
            logger.warning("Missing tabular input for explainability")
            raise HTTPException(status_code=422, detail="Tabular data required")
        if not image_bytes:
            image_bytes = b"\x00"
        if not text:
            text = ""
        logger.info(f"Explain request: tabular keys={list(tabular.data.keys())} text_len={len(text)} image={bool(image)}")

        # --- SHAP or explanation logic ---
        # For demonstration, this assumes the engine implements an `explain` method returning SHAP values per feature.
        # You need to implement engine.explain(tabular_dict, image_bytes, text) in your engine.
        # Fallback: if not implemented, return zeros.
        try:
            explanation = engine.explain(tabular.data, image_bytes, text)
            shap_values = explanation.get("shap_values", {})
        except AttributeError:
            shap_values = {k: 0.0 for k in tabular.data.keys()}  # Placeholder

        result = engine.predict(tabular.data, image_bytes, text)
        response = {
            "ensemble_value": result["ensemble_value"],
            "base_model_predictions": result["base_model_predictions"],
            "shap_values": shap_values,
            "model_versions": result["model_versions"],
        }
        return response
    except Exception as e:
        logger.exception("Explainability failed")
        raise HTTPException(status_code=500, detail=f"Explainability failed: {str(e)}")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/version")
def version():
    return {"model_versions": engine.model_version_info}

if __name__ == "__main__":
    uvicorn.run("engine.explain_api:app", host="0.0.0.0", port=8000, reload=True)
