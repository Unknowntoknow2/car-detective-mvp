from typing import List
from engine.comps_filter import RawComp

def select_comps(comps: List[RawComp], subject_mileage: int, cfg: dict) -> List[RawComp]:
    # Example: Try tight radius, then relax, then filter by mileage window
    # Pseudocode—adapt as needed for your business rules!
    radius_steps = cfg["filters"]["radius_steps_km"]
    for radius in radius_steps:
        selected = [c for c in comps if c.distance_km <= radius]
        # Optionally: filter on mileage window here
        if len(selected) >= cfg["filters"]["comps"]["min_k"]:
            return selected
    # Fallback: return as many as possible
    return sorted(comps, key=lambda c: c.distance_km)[:cfg["filters"]["comps"]["min_k"]]
