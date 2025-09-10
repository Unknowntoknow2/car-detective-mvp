from vininfo import Vin

def is_valid_vin(vin):
    try:
        Vin.validate(vin)
        return True
    except Exception:
        return False

# Example usage:
if __name__ == "__main__":
    print(is_valid_vin('1HGCM82633A004352'))  # True
    print(is_valid_vin('INVALIDVIN1234'))     # False
