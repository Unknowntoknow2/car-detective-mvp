from api.engine.fallbacks import choose_method

def test_market_method():
    result = choose_method(4)
    assert result["method"] == "market"
    assert result["radius_km"] == 160
    assert result["range_pct"] == 0.10

def test_fallback_none():
    result = choose_method(0)
    assert result["method"] == "fallback"
    assert result["radius_km"] == 320
    assert result["range_pct"] == 0.15

def test_fallback_sparse():
    result = choose_method(1)
    assert result["method"] == "fallback"
    assert result["radius_km"] == 240
    assert result["range_pct"] == 0.15
