from engine.comps_filter import RawComp
from engine.comps_selector import select_comps

def test_select_comps_radius():
    comps = [RawComp(price=10000, mileage=50000, distance_km=10, days_old=5),
             RawComp(price=11000, mileage=52000, distance_km=30, days_old=7),
             RawComp(price=12000, mileage=54000, distance_km=60, days_old=10)]
    cfg = {'filters': {'radius_steps_km': [20, 50, 100], 'comps': {'min_k': 2}}}
    selected = select_comps(comps, subject_mileage=50000, cfg=cfg)
    assert len(selected) == 2
    assert all(c.distance_km <= 20 or c.distance_km <= 50 for c in selected)

def test_select_comps_fallback():
    comps = [RawComp(price=10000, mileage=50000, distance_km=200, days_old=5)]
    cfg = {'filters': {'radius_steps_km': [20, 50, 100], 'comps': {'min_k': 2}}}
    selected = select_comps(comps, subject_mileage=50000, cfg=cfg)
    assert len(selected) == 1
    assert selected[0].distance_km == 200
