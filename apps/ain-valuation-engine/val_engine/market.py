import json
from typing import Dict, Any, Optional
import numpy as np

def load_comps_file(path: str) -> Dict[str, Any]:
    with open(path, 'r') as f:
        return json.load(f)

def compute_market_anchor(comps: Dict[str, Any], target_trim: Optional[str]=None, target_year: Optional[int]=None, target_miles: Optional[int]=None) -> Dict[str, Any]:
    """
    Given a comps dict (from JSON), compute median price and range for matching comps.
    Optionally normalize for trim/year/miles.
    Returns: dict with median_price, price_range, comps_used, listings
    """
    listings = comps.get('listings', [])
    # Filter for same gen/trim family if possible
    filtered = []
    for l in listings:
        if target_trim and l.get('trim') and target_trim[:2] == l['trim'][:2]:
            filtered.append(l)
        elif not target_trim:
            filtered.append(l)
    if len(filtered) < 3:
        filtered = listings
    prices = [l['price'] for l in filtered if l.get('price')]
    if not prices:
        return {'median_price': None, 'price_range': None, 'comps_used': 0, 'listings': []}
    median = float(np.median(prices))
    price_range = [float(np.percentile(prices, 10)), float(np.percentile(prices, 90))]
    return {
        'median_price': median,
        'price_range': price_range,
        'comps_used': len(filtered),
        'listings': filtered
    }
