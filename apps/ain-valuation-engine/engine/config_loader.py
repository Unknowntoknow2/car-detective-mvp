import yaml
import json
import os

def load_config(weights_yaml='weights.v1.yaml', calibration_json='calibration.v1.json'):
    with open(weights_yaml, 'r') as f:
        cfg = yaml.safe_load(f)
    if os.path.exists(calibration_json):
        with open(calibration_json, 'r') as f:
            calib = json.load(f)
        if "bands_pct" in calib:
            cfg["confidence"]["bands_pct"] = calib["bands_pct"]
    return cfg
