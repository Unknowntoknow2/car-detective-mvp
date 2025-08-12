from flask import Flask, request, jsonify, make_response
import os
import uuid
from werkzeug.utils import secure_filename
from datetime import datetime

# Assuming val_engine is in the same directory level or added to PYTHONPATH
from val_engine.main import initialize_valuation_engine, run_valuation
from val_engine.model import MODEL_PATH, ENCODERS_PATH

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads/videos'
ALLOWED_EXTENSIONS = {'mp4', 'mov', 'webm'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return filename is not None and '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

with app.app_context():
    try:
        initialize_valuation_engine()
        print("Flask app: Valuation engine initialized successfully.")
    except Exception as e:
        print(f"Flask app: ERROR during valuation engine initialization: {e}")

@app.route('/api/health')
def _health():
    return jsonify({"ok": True})

@app.route('/valuation', methods=['POST'])
def get_valuation():
    if not request.is_json:
        return make_response(jsonify({"error": "Request must be JSON"}), 400)

    input_data = request.json

    if input_data is None:
        return make_response(jsonify({"error": "Invalid input."}), 400)

    required_fields = ["vin", "make", "model", "year", "mileage", "overall_condition_rating", "zipcode"]
    for field in required_fields:
        value = input_data.get(field)
        if not isinstance(value, dict) or "value" not in value:
            return make_response(jsonify({"error": f"Missing or invalid required field: {field}. Ensure it has a 'value' key."}), 400)

    try:
        valuation_result = run_valuation(input_data)
        return jsonify(valuation_result), 200
    except RuntimeError as e:
        return make_response(jsonify({"error": str(e)}), 500)
    except KeyError as e:
        return make_response(jsonify({"error": f"Missing expected data for valuation: {e}"}), 400)
    except Exception as e:
        print(f"An unexpected error occurred during valuation: {e}")
        return make_response(jsonify({"error": "An internal error occurred during valuation."}), 500)

@app.route('/upload_video', methods=['POST'])
def upload_video():
    if 'video' not in request.files:
        return make_response(jsonify({"error": "No video file provided in request."}), 400)

    video_file = request.files['video']
    if not video_file or not video_file.filename:
        return make_response(jsonify({"error": "No selected video file."}), 400)

    if not allowed_file(video_file.filename):
        return make_response(jsonify({"error": "Invalid file type. Only MP4, MOV, WebM are allowed."}), 400)

    valuation_id = request.form.get('valuation_id')
    vin = request.form.get('vin')
    
    if not valuation_id and not vin:
        return make_response(jsonify({"error": "Missing associated metadata (valuation_id or VIN)."}), 400)

    try:
        original_filename = secure_filename(video_file.filename)
        unique_filename = f"{uuid.uuid4()}_{original_filename}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        video_file.save(file_path)

        simulated_public_url = f"/videos/{unique_filename}" 
        simulated_ai_score = 85
        simulated_duration = 120
        simulated_ai_summary = "Minor scratch on rear bumper, engine sound normal."

        return jsonify({
            "message": "Video uploaded successfully.",
            "file_url": simulated_public_url,
            "filename": unique_filename,
            "valuation_id": valuation_id,
            "vin": vin,
            "uploaded_at": datetime.utcnow().isoformat(),
            "ai_condition_score": simulated_ai_score,
            "duration_seconds": simulated_duration,
            "ai_analysis_summary": simulated_ai_summary,
            "verified": True,
            "source_origin": "AppRecorded"
        }), 200

    except Exception as e:
        print(f"Error uploading video: {e}")
        return make_response(jsonify({"error": f"Failed to upload video: {e}"}), 500)

if __name__ == '__main__':
    if os.path.exists(MODEL_PATH):
        os.remove(MODEL_PATH)
    if os.path.exists(ENCODERS_PATH):
        os.remove(ENCODERS_PATH)
    print("Cleaned up model artifacts before starting Flask app for fresh test.")
    app.run(debug=True, host='0.0.0.0', port=5000)