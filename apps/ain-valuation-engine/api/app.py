# api/app.py

from flask import Flask, request, jsonify, make_response
import os
import uuid # For generating unique filenames
from werkzeug.utils import secure_filename # For securing filenames

# Assuming val_engine is in the same directory level or added to PYTHONPATH
from val_engine.main import initialize_valuation_engine, run_valuation
from val_engine.model import MODEL_PATH, ENCODERS_PATH # For cleanup in example

# --- Flask App Setup ---
app = Flask(__name__)

# Configuration for video uploads
# It's crucial to configure a secure upload folder.
# In a real production environment, this would be a cloud storage bucket.
UPLOAD_FOLDER = 'uploads/videos'
ALLOWED_EXTENSIONS = {'mp4', 'mov', 'webm'} # Define allowed video formats
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# --- Initialize ML Model at App Startup ---
# This ensures the model is loaded once when the Flask app starts
# and is ready for predictions.
with app.app_context():
    try:
        initialize_valuation_engine()
        print("Flask app: Valuation engine initialized successfully.")
    except Exception as e:
        print(f"Flask app: ERROR during valuation engine initialization: {e}")
        # In production, you might want to log this error and potentially exit
        # or mark the app as unhealthy.


# --- API Endpoints ---

@app.route('/')
def health_check():
    """Basic health check endpoint."""
    return jsonify({"status": "healthy", "message": "AIN Valuation Engine API is running."}), 200

@app.route('/valuation', methods=['POST'])
def get_valuation():
    """
    Endpoint to get a vehicle valuation.
    Expects a JSON payload conforming to VehicleDataForValuation.
    """
    if not request.is_json:
        return make_response(jsonify({"error": "Request must be JSON"}), 400)

    input_data = request.json

    # Basic input validation (more robust validation with JSON Schema/Pydantic would go here)
    required_fields = ["vin", "make", "model", "year", "mileage", "overall_condition_rating", "zipcode"]
    for field in required_fields:
        if field not in input_data or not isinstance(input_data[field], dict) or "value" not in input_data[field]:
            return make_response(jsonify({"error": f"Missing or invalid required field: {field}. Ensure it has a 'value' key."}), 400)

    try:
        # Call the refactored run_valuation from val_engine.main
        valuation_result = run_valuation(input_data)
        return jsonify(valuation_result), 200
    except RuntimeError as e:
        # Catch errors related to model not being loaded or other engine issues
        return make_response(jsonify({"error": str(e)}), 500)
    except KeyError as e:
        # Catch errors for missing expected keys
        return make_response(jsonify({"error": f"Missing expected data for valuation: {e}"}), 400)
    except Exception as e:
        # Catch any other unexpected errors
        print(f"An unexpected error occurred during valuation: {e}")
        return make_response(jsonify({"error": "An internal error occurred during valuation."}), 500)


@app.route('/upload_video', methods=['POST'])
def upload_video():
    """
    Endpoint to handle video uploads for condition analysis.
    Expects a video file and associated metadata (e.g., valuation_id, vin).
    """
    if 'video' not in request.files:
        return make_response(jsonify({"error": "No video file provided in request."}), 400)

    video_file = request.files['video']
    if video_file.filename == '':
        return make_response(jsonify({"error": "No selected video file."}), 400)

    if not allowed_file(video_file.filename):
        return make_response(jsonify({"error": "Invalid file type. Only MP4, MOV, WebM are allowed."}), 400)

    # Extract metadata from form data (or JSON body if sent separately)
    # For simplicity, assuming metadata like valuation_id/vin is sent as form fields
    valuation_id = request.form.get('valuation_id')
    vin = request.form.get('vin')
    
    if not valuation_id and not vin:
        return make_response(jsonify({"error": "Missing associated metadata (valuation_id or VIN)."}), 400)

    try:
        # Secure the filename and create a unique name to prevent overwrites
        original_filename = secure_filename(video_file.filename)
        unique_filename = f"{uuid.uuid4()}_{original_filename}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        video_file.save(file_path)

        # In a real scenario, you would then:
        # 1. Upload this file to a cloud storage bucket (e.g., Supabase Storage, S3).
        # 2. Trigger an asynchronous AI analysis job (e.g., using a message queue like Celery/RabbitMQ, or cloud functions).
        # 3. Store the video URL and initial metadata in your database (e.g., Supabase).
        # 4. Once AI analysis is complete, update the database with ai_condition_score, ai_analysis_summary.

        # For this example, we'll simulate the URL and AI analysis
        # In production, this would be the public URL from your cloud storage
        simulated_public_url = f"/videos/{unique_filename}" 
        
        # Simulate AI analysis result (this would come from an actual AI service)
        simulated_ai_score = 85 # Example score
        simulated_duration = 120 # Example duration in seconds
        simulated_ai_summary = "Minor scratch on rear bumper, engine sound normal."

        # Return success response with video metadata
        return jsonify({
            "message": "Video uploaded successfully.",
            "file_url": simulated_public_url,
            "filename": unique_filename,
            "valuation_id": valuation_id,
            "vin": vin,
            "uploaded_at": pd.Timestamp.now().isoformat(),
            "ai_condition_score": simulated_ai_score,
            "duration_seconds": simulated_duration,
            "ai_analysis_summary": simulated_ai_summary,
            "verified": True, # Once AI analysis is done, it can be marked verified
            "source_origin": "AppRecorded" # Or 'UserUpload'
        }), 200

    except Exception as e:
        print(f"Error uploading video: {e}")
        return make_response(jsonify({"error": f"Failed to upload video: {e}"}), 500)

if __name__ == '__main__':
    # Clean up model artifacts from previous local test runs (if any)
    # This is for development convenience, not for production deployment.
    if os.path.exists(MODEL_PATH):
        os.remove(MODEL_PATH)
    if os.path.exists(ENCODERS_PATH):
        os.remove(ENCODERS_PATH)
    print("Cleaned up model artifacts before starting Flask app for fresh test.")
    
    # Run the Flask app
    # In production, use a WSGI server like Gunicorn (e.g., gunicorn -w 4 api.app:app)
    app.run(debug=True, host='0.0.0.0', port=5000)

