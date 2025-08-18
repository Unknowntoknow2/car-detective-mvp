from api.engine.explain import explain_factors

def test_explain_factors():
    breakdown = {"mileage": -0.07, "trim": 0.02, "foo": 0.001}
    result = explain_factors(breakdown)
    assert "mileage: -7.0%" in result
    assert "trim: +2.0%" in result
    assert all("foo" not in s for s in result)
