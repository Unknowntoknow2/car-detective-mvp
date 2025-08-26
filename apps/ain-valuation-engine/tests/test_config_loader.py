import os
import json
import yaml
from engine.config_loader import load_config

def test_load_config_yaml_only(tmp_path):
    weights = {'confidence': {'bands_pct': {'high': [0.06, 0.08], 'medium': [0.08, 0.12], 'low': [0.12, 0.18]}}, 'reliability': {}}
    weights_path = tmp_path / 'weights.v1.yaml'
    with open(weights_path, 'w') as f:
        yaml.dump(weights, f)
    cfg = load_config(str(weights_path))
    assert cfg['confidence']['bands_pct']['high'] == [0.06, 0.08]
    assert 'bands_pct' in cfg['confidence']

def test_load_config_with_calibration(tmp_path):
    weights = {'confidence': {'bands_pct': {'high': [0.06, 0.08], 'medium': [0.08, 0.12], 'low': [0.12, 0.18]}}, 'reliability': {}}
    calib = {'bands_pct': {'high': [0.07, 0.09], 'medium': [0.09, 0.13], 'low': [0.13, 0.19]}}
    weights_path = tmp_path / 'weights.v1.yaml'
    calib_path = tmp_path / 'calibration.v1.json'
    with open(weights_path, 'w') as f:
        yaml.dump(weights, f)
    with open(calib_path, 'w') as f:
        json.dump(calib, f)
    cfg = load_config(str(weights_path), str(calib_path))
    assert cfg['confidence']['bands_pct']['high'] == [0.07, 0.09]
    assert cfg['confidence']['bands_pct']['medium'] == [0.09, 0.13]
    assert cfg['confidence']['bands_pct']['low'] == [0.13, 0.19]
