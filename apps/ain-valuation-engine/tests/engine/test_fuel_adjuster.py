from api.engine.fuel_adjuster import fuel_adjustment

def test_gas():
    assert fuel_adjustment('gas') == 0.0

def test_diesel():
    assert fuel_adjustment('diesel') == 0.03

def test_hybrid():
    assert fuel_adjustment('hybrid') == 0.02

def test_ev_no_soh():
    assert abs(fuel_adjustment('ev') + 0.05) < 1e-6

def test_ev_with_soh():
    assert abs(fuel_adjustment('ev', soh=0.95) - 0.005) < 1e-6
