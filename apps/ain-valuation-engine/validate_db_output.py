import json
from jsonschema import validate, ValidationError

with open('schemas/vehicle_decoded_schema_v2.json') as f:
    schema = json.load(f)

with open('db_output.json') as f:
    data = json.load(f)

try:
    validate(instance=data, schema=schema)
    print("Validation successful!")
except ValidationError as e:
    print("Validation error:", e)
