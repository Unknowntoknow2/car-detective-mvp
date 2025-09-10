# metrics_log.py
import datetime
import json

def log_metrics(comp_count, method, confidence, error_label, segment, fuel_type, output_path='metrics_log.jsonl'):
    entry = {
        'timestamp': datetime.datetime.utcnow().isoformat(),
        'comp_count': comp_count,
        'method': method,
        'confidence': confidence,
        'error_label': error_label,
        'segment': segment,
        'fuel_type': fuel_type
    }
    with open(output_path, 'a') as f:
        f.write(json.dumps(entry) + '\n')
