from api.engine.confidence import ConfidenceInput, score_confidence

def test_market_high():
    inp = ConfidenceInput(method="market", comp_count=5, completeness=1.0)
    score, label = score_confidence(inp)
    assert label == "High"
    assert 0.85 <= score <= 0.90

def test_market_medium():
    inp = ConfidenceInput(method="market", comp_count=2, completeness=0.5)
    score, label = score_confidence(inp)
    assert label == "Low"
    assert score < 0.6

def test_fallback_low():
    inp = ConfidenceInput(method="fallback", comp_count=0, completeness=0.2)
    score, label = score_confidence(inp)
    assert label == "Low"
    assert score < 0.6
