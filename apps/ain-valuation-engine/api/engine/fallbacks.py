from typing import Literal, TypedDict

Method = Literal['market','fallback']

class FallbackResult(TypedDict):
    method: Method
    radius_km: int
    range_pct: float
    notes: list[str]

def choose_method(comp_count: int, base_radius_km: int = 160) -> FallbackResult:
    if comp_count >= 3:
        return {"method":"market","radius_km": base_radius_km, "range_pct": 0.10, "notes": ["sufficient comps"]}
    # broaden search once
    if comp_count == 0:
        return {"method":"fallback","radius_km": base_radius_km*2, "range_pct": 0.15, "notes": ["no comps found"]}
    return {"method":"fallback","radius_km": int(base_radius_km*1.5), "range_pct": 0.15, "notes": ["sparse comps"]}
