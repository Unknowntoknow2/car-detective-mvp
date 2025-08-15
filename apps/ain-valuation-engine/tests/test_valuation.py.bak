import sys
sys.path.append('src/ain-backend')
from server import app

def test_valuate_endpoint():
    with app.test_client() as client:
        response = client.post("/api/valuate", json={"price": 12345})
        assert response.status_code == 200
        assert response.get_json()["valuation"] == 12345
