
import csv
import json
import logging
from vin_decoder_abstraction import decode_and_map, CANONICAL_FIELDS

# Configure logging
logging.basicConfig(filename="vin_decode.log", level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

def run_golden_vin_tests():
    golden_vins = [
        "4T1R11AK4RU878557",  # Toyota Camry
        "1HGCM82633A004352",  # Honda Accord
        "1FTFW1ET1EFA12345",  # Ford F-150
        "WDBRF40J33F123456",  # Mercedes-Benz C-Class
        "JH4KA9650MC123456",  # Acura Legend (classic)
        "WAUZZZ8K9AA123456",  # Audi A4 (EU format)
        "JHMCM56557C404453",  # Honda Accord (Asia)
        "1C4RJFAG0FC123456",  # Jeep Grand Cherokee
        "2G1WF52E759123456",  # Chevrolet Impala
        "3VWFE21C04M000001",  # Volkswagen Jetta (Mexico)
        "4T1C11AK3PU162087"   # Toyota Camry (real, recent)
    ]
    results = []
    for vin in golden_vins:
        result = decode_and_map(vin)
        # Log decode attempt and result
        logging.info(json.dumps({"VIN": vin, "result": result}))
        # Field completeness
        completeness = sum(1 for v in result.values() if v not in (None, "", "Not Applicable", "0")) / len(CANONICAL_FIELDS)
        print(f"VIN: {vin} | Success: {'error' not in result} | Field completeness: {completeness:.0%}")
        if 'error' in result:
            print(f"  Error: {result['error']}")
        results.append({"VIN": vin, **result})
    # Write results to CSV
    with open("golden_vin_results.csv", "w", newline="") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=["VIN"] + CANONICAL_FIELDS)
        writer.writeheader()
        writer.writerows(results)
    print("Golden VIN test results written to golden_vin_results.csv")

if __name__ == "__main__":
    run_golden_vin_tests()
