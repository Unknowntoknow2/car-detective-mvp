from flask import Flask, jsonify, request
from werkzeug.exceptions import HTTPException
import os

app = Flask(__name__)

# ---------- Consistent JSON error envelope ----------
@app.errorhandler(Exception)
def _err(e):
    code = e.code if isinstance(e, HTTPException) else 500
    return jsonify(
        error="internal_error" if code >= 500 else "bad_request",
        details={"message": str(e)}
    ), code

# ---------- Health / Version ----------
@app.get("/api/v1/health")
def health():
    return jsonify(ok=True)

@app.get("/api/v1/version")
def version():
    sha = os.getenv("VERCEL_GIT_COMMIT_SHA") or os.getenv("GITHUB_SHA") or "dev"
    return jsonify(service="vehicle-platform", version=sha)

# ---------- OpenAPI (stub) ----------
@app.get("/api/v1/openapi.json")
def openapi():
    return jsonify({
        "openapi": "3.0.0",
        "info": {"title": "Vehicle API", "version": "v1"},
        "paths": {
            "/api/v1/health": {"get": {"responses": {"200": {"description": "OK"}}}},
            "/api/v1/version": {"get": {"responses": {"200": {"description": "OK"}}}}
        }
    })

# ---------- API index ----------
@app.get("/api")
def api_index():
    return jsonify(endpoints=[
        "/api/v1/health",
        "/api/v1/version",
        "/api/v1/openapi.json"
    ])

# ---------- (Optional) valuation stub with lazy import ----------
@app.post("/api/v1/valuations")
def valuations():
    data = request.get_json(silent=True) or {}
    vin = data.get("vin")
    if not vin:
        return jsonify(error="bad_request", details={"message": "vin is required"}), 400

    if os.getenv("ENABLE_VAL_ENGINE"):
        from val_engine.main import initialize_valuation_engine, run_valuation  # noqa: E402
        ve = initialize_valuation_engine()
        # result = run_valuation(ve, vin)
        # return jsonify(result)

    return jsonify({"vin": vin, "valuation": None, "status": "stub"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "3000")))
