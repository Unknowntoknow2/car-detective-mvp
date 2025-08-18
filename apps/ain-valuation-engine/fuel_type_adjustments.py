# fuel_type_adjustments.py

FUEL_TYPE_DELTAS = {
    'hybrid': {'base': 0.03, 'region': {'CA': 0.05, 'TX': 0.01}},
    'ev': {'base': 0.04, 'region': {'CA': 0.07, 'NY': 0.03}},
    'diesel': {'base': 0.02, 'region': {'ND': 0.04, 'CA': -0.01}},
    'gas': {'base': 0.0, 'region': {}},
}

def get_fuel_type_adjustment(fuel_type, region):
    base = FUEL_TYPE_DELTAS.get(fuel_type, {}).get('base', 0)
    region_delta = FUEL_TYPE_DELTAS.get(fuel_type, {}).get('region', {}).get(region, 0)
    return base + region_delta
