from dataclasses import dataclass

@dataclass
class ConfidenceInput:
    method: str  # 'market' | 'fallback'
    comp_count: int
    completeness: float  # 0..1

def score_confidence(inp: ConfidenceInput) -> tuple[float, str]:
    is_market = inp.method == "market"
    cap = 0.90 if is_market else 0.65
    base = 0.65 if is_market else 0.50

    # Guard: ensure market with 2+ comps and 0.5+ completeness is at least Medium
    if is_market and inp.comp_count >= 2 and inp.completeness >= 0.50:
        floor_label = "Medium"
    else:
        floor_label = "Low"

    comp_term = min(max(inp.comp_count, 0), 5) / 5.0  # 0..1 for 0..5 comps
    comp_weight = 0.25
    completeness_weight = 0.25
    score = base + comp_weight * comp_term + completeness_weight * max(min(inp.completeness, 1.0), 0.0)
    score = min(score, cap)

    if is_market and score >= 0.80 and inp.comp_count >= 5 and inp.completeness >= 0.90:
        label = "High"
    elif score >= 0.55 or floor_label == "Medium":
        label = "Medium"
    else:
        label = "Low"

    return round(score, 2), label
