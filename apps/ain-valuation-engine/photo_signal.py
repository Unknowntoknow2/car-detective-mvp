# photo_signal.py

def photo_sufficiency_score(photo_list):
    """
    Compute a photo sufficiency score (0-1) based on count, angle diversity, and basic clarity (placeholder).
    photo_list: list of dicts with keys: 'angle', 'file_size', 'is_blurry' (optional)
    """
    if not photo_list:
        return 0.0
    count = len(photo_list)
    angle_set = set(p.get('angle') for p in photo_list if p.get('angle'))
    blurry_count = sum(1 for p in photo_list if p.get('is_blurry'))
    score = min(1.0, 0.2 * count + 0.1 * len(angle_set) - 0.1 * blurry_count)
    return max(0.0, score)
