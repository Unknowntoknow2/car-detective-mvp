from fastapi import FastAPI, HTTPException, Request
from pydantic import ValidationError
from engine.types import ValuationInput, ValuationOutput
from engine.inference_xgb import predict_value
from engine.shap_explain import top_local_drivers
from engine.llm_explain import llm_explanation
import time
import logging

app = FastAPI()
logger = logging.getLogger("valuation_api")

@app.post("/valuate", response_model=ValuationOutput)
def valuate(request: Request):
    start = time.time()
    try:
        data = request.json() if hasattr(request, 'json') else None
        if data is None:
            data = await request.json()
        val_input = ValuationInput(**data)
    except ValidationError as ve:
        raise HTTPException(status_code=422, detail=str(ve))
    except Exception as e:
        logger.error(f"Input validation failed: {e}")
        raise HTTPException(status_code=400, detail="Malformed request.")

    # ML or fallback routing
    use_ml = val_input.comp_count >= 3 and val_input.completeness >= 0.8
    if use_ml:
        result = predict_value(val_input)
        result["confidence"] = min(result.get("confidence", 0.85), 1.0)
        result["method"] = "ml_xgb"
    else:
        # Fallback logic (replace with your fallback engine)
        result = {
            "value": 0.0,
            "range_low": 0.0,
            "range_high": 0.0,
            "confidence": 0.6,
            "method": "fallback",
            "model_version": "n/a"
        }
    # SHAP explanations
    try:
        top_factors = top_local_drivers(val_input)
    except Exception as e:
        logger.warning(f"SHAP explanation failed: {e}")
        top_factors = []
    result["top_factors"] = top_factors
    # LLM explanation
    try:
        explanation = llm_explanation(result, top_factors, result["method"], use_ml)
    except Exception as e:
        logger.warning(f"LLM explanation failed: {e}")
        explanation = None
    result["explanation"] = explanation
    # Audit row (stub: replace with real persistence)
    logger.info(f"AUDIT: input={val_input.dict()} output={result}")
    latency = int((time.time() - start) * 1000)
    result["latency_ms"] = latency
    return result
