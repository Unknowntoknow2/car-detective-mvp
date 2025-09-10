# confidence.py

def compute_confidence(method, comp_count, data_completeness):
    """
    Compute confidence score with hard caps and fallback handling.
    """
    if method == 'market':
        conf = min(0.85, 0.5 + 0.05 * comp_count + 0.1 * data_completeness)
    else:
        conf = min(0.60, 0.3 + 0.05 * comp_count + 0.1 * data_completeness)
    return max(0.0, conf)

def enforce_range_floor(value, method):
    """
    Enforce minimum value range based on method.
    """
    if method == 'market':
        return value * 0.10
    else:
        return value * 0.15

def confidence_label(conf, method):
    if method != 'market' or conf < 0.75:
        return 'Medium' if conf >= 0.5 else 'Low'
    return 'High'
