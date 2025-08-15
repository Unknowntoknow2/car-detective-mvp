import sys
sys.path.append('src/ain-backend')
from server import app

def test_homepage():
    with app.test_client() as client:
        response = client.get("/")
        assert response.status_code == 200
        assert b"AIN Valuation Engine API is running!" in response.data
