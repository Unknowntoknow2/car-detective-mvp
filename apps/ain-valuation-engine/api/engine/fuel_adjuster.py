from typing import Literal

Fuel = Literal['gas','diesel','hybrid','ev']

# adjustments as percentages relative to segment baseline
ADJ = {
  'gas':    0.00,
  'diesel': 0.03,   # longevity/towing premium (region dependent)
  'hybrid': 0.02,   # efficiency premium, battery risk lower than EV
  'ev':    -0.02,   # generic depreciation; SoH can swing this
}

def fuel_adjustment(fuel: Fuel, soh: float | None = None) -> float:
    if fuel == 'ev':
        # State of Health (SoH) moves EV value materially
        if soh is None:
            return ADJ['ev'] - 0.03  # widen risk discount without data
        # normalize around 0.9 SoH
        delta = (soh - 0.90) * 0.5  # 10% SoH ~ 5% price move
        return ADJ['ev'] + delta
    return ADJ.get(fuel, 0.0)
