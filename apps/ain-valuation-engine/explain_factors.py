# explain_factors.py

def explain_factors(feature_dict, weights_dict):
    """
    Returns a list of factor contributions and a user-friendly summary.
    """
    factors = []
    for k, v in feature_dict.items():
        weight = weights_dict.get(k, 0)
        delta = v if isinstance(v, (int, float)) else 0
        contribution = weight * delta
        explanation = f"{k}: {weight} × {delta} = {contribution}"
        factors.append({
            'factor': k,
            'weight': weight,
            'delta': delta,
            'contribution': contribution,
            'explanation': explanation
        })
    summary = "; ".join(f["explanation"] for f in factors if f["contribution"])
    return {"factors": factors, "summary": summary}
