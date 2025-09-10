
import subprocess

def test_decode():
    out = subprocess.check_output(["python3", "vin_decoder_abstraction.py", "4T1G11AK4NU714632"]).decode()
    assert "VIN received: 4T1G11AK4NU714632" in out

def test_recalls():
    out = subprocess.check_output(["python3", "vin_decoder_abstraction.py", "recalls", "4T1G11AK4NU714632"]).decode()
    assert "VIN received: 4T1G11AK4NU714632" in out

if __name__ == "__main__":
    test_decode()
    test_recalls()
    print("Both CLI branches passed.")
