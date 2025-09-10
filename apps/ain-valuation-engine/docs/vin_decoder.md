# VIN Decoder Integration

## Purpose
Decodes VINs using the NHTSA vPIC API and maps them to internal vehicle data fields.

## Usage

\`\`\`python
from src.api_integrations.vin_decoder import decode_vin

data = decode_vin("1HGCM82633A004352")
print(data)
\`\`\`

## Testing
Run:
\`\`\`sh
pytest tests/test_vin_decoder.py
\`\`\`
