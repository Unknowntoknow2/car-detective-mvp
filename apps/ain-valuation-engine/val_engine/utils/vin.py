import requests

def decode_vin(vin):
    """
    Decode a VIN using the NHTSA vPIC API and return a dict with key vehicle specs.
    """
    url = f'https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/{vin}?format=json'
    resp = requests.get(url)
    if resp.status_code != 200:
        raise ValueError(f"Failed to decode VIN: {vin}")
    data = resp.json()
    results = {r['Variable']: r['Value'] for r in data['Results'] if r['Value']}
    # Map to canonical fields
    return {
        'vin': vin,
        'make': results.get('Make'),
        'model': results.get('Model'),
        'year': int(results.get('Model Year')) if results.get('Model Year') else None,
        'body_style': results.get('Body Class'),
        'engine': results.get('Engine Model'),
        'transmission': results.get('Transmission Style'),
        'drive_type': results.get('Drive Type'),
        'trim': results.get('Trim'),
        'doors': results.get('Doors'),
        'fuel_type': results.get('Fuel Type - Primary'),
    }
