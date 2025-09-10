from engine.config_loader import load_config
import pprint

cfg = load_config('weights.v1.yaml', 'calibration.v1.json')
pprint.pprint(cfg["confidence"]["bands_pct"])
