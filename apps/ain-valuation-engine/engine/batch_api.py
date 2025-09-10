from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, List, Any
import uvicorn

from engine.inference_ensemble import InferenceEnsembleEngine

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
    title="Valuation Ensemble Engine Batch API",
    description="REST API for batch inference with the advanced stacking ensemble valuation engine",
    version="1.0.0"
)

class BatchRecord(BaseModel):
    tabular: Dict[str, Any]
    text: Optional[str] = ""
    # For image, client should send base64 (or URL), see note below

class BatchRequest(BaseModel):
    records: List[BatchRecord]
    # images: Optional[List[UploadFile]] # If using multipart; see note below

class BatchPredictResponse(BaseModel):
    results: List[Dict[str, Any]]

engine = InferenceEnsembleEngine(**ENGINE_CONFIG)

@app.post("/batch_predict", response_model=BatchPredictResponse)
async def batch_predict(request: BatchRequest):
    results = []
    for idx, record in enumerate(request.records):
        try:
            # This version expects image bytes are not provided (could extend to accept base64/images)
            image_bytes = b"\x00"  # Use a dummy/empty image or adapt as needed
            tabular = record.tabular
            text = record.text or ""
            result = engine.predict(tabular, image_bytes, text)
            results.append(result)
        except Exception as e:
            results.append({"error": f"Record {idx}: {str(e)}"})
    return {"results": results}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/version")
def version():
    return {"model_versions": engine.model_version_info}

if __name__ == "__main__":
    uvicorn.run("engine.batch_api:app", host="0.0.0.0", port=8000, reload=True)
