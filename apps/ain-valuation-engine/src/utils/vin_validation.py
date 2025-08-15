from stdnum.vin import validate as vin_validate, is_valid as vin_is_valid

class VINValidationError(Exception):
    pass

def validate_vin(vin_code):
    try:
        vin_validate(vin_code)
        return True
    except Exception as e:
        raise VINValidationError(str(e))

def is_valid_vin_safe(vin_code):
    return vin_is_valid(vin_code)
