from typing import Dict

def explain_factors(breakdown: Dict[str, float]) -> list[str]:
    msgs = []
    for k, v in breakdown.items():
        if abs(v) < 0.005:  # <0.5%
            continue
        sign = "+" if v > 0 else "-"
        msgs.append(f"{k}: {sign}{abs(v)*100:.1f}%")
    return msgs
