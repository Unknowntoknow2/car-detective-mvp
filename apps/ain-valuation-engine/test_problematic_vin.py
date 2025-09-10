#!/usr/bin/env python3
"""
Test the problematic VIN with our complete data flow
"""

import requests
import json

def test_vin_4T1C31AK0LU533615():
    vin = '4T1C31AK0LU533615'
    print(f'🧪 Testing VIN: {vin}')
    print('='*50)
    
    # Step 1: Test NHTSA API directly
    print('\n1️⃣ NHTSA API Direct Test:')
    url = f'https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/{vin}?format=json'
    response = requests.get(url)
    nhtsa_data = response.json()
    
    print(f'   Status: {response.status_code}')
    print(f'   Results: {len(nhtsa_data.get("Results", []))} items')
    
    if nhtsa_data.get('Results'):
        result = nhtsa_data['Results'][0]
        print(f'   ErrorCode: {result.get("ErrorCode")}')
        print(f'   Make: {result.get("Make")}')
        print(f'   Model: {result.get("Model")}')
        print(f'   Year: {result.get("ModelYear")}')
    
    # Step 2: Test our edge function format
    print('\n2️⃣ Edge Function Format Test:')
    edge_response = {
        'decodedData': nhtsa_data['Results']
    }
    print(f'   Edge response structure: {list(edge_response.keys())}')
    print(f'   DecodedData length: {len(edge_response["decodedData"])}')
    
    # Step 3: Test frontend extraction
    print('\n3️⃣ Frontend Extraction Test:')
    
    def getValue(value, defaultValue='Unknown'):
        if value is None:
            return defaultValue
        if isinstance(value, str) and value.strip() == '':
            return defaultValue
        return value
    
    def extractVehicleInfo(decodedData):
        if not decodedData or not isinstance(decodedData, list) or len(decodedData) == 0:
            return None
        
        data = decodedData[0]
        
        return {
            'make': getValue(data.get('Make')),
            'model': getValue(data.get('Model')),
            'modelYear': getValue(data.get('ModelYear')),
            'vehicleType': getValue(data.get('VehicleType')),
            'bodyClass': getValue(data.get('BodyClass')),
            'manufacturer': getValue(data.get('Manufacturer')),
            'errorCode': data.get('ErrorCode'),
            'errorText': data.get('ErrorText')
        }
    
    vehicleInfo = extractVehicleInfo(edge_response['decodedData'])
    
    if vehicleInfo:
        print('   ✅ Extraction successful!')
        for key, value in vehicleInfo.items():
            status = '❌' if value == 'Unknown' else '✅'
            print(f'   {status} {key}: {value}')
        
        unknown_count = sum(1 for v in vehicleInfo.values() if v == 'Unknown')
        print(f'\n   📊 Summary: {len(vehicleInfo) - unknown_count}/{len(vehicleInfo)} fields populated')
        
        if unknown_count == 0:
            print('   🎉 SUCCESS: All fields populated correctly!')
        else:
            print(f'   ⚠️  WARNING: {unknown_count} fields are Unknown')
    else:
        print('   ❌ Extraction failed!')
    
    # Step 4: Quality assessment
    print('\n4️⃣ Quality Assessment Test:')
    
    def assessDataQuality(vehicleInfo):
        if not vehicleInfo:
            return {'score': 0, 'issues': ['No data available']}
        
        issues = []
        score = 100
        
        if vehicleInfo.get('errorCode') and vehicleInfo['errorCode'] != '0':
            errorCode = int(vehicleInfo['errorCode'])
            if errorCode == 1:
                issues.append('Check digit validation failed')
                score -= 20
            elif errorCode == 8:
                issues.append('Limited data available from NHTSA')
                score -= 10
        
        return {
            'score': max(0, score),
            'grade': 'A' if score >= 80 else 'B' if score >= 60 else 'C' if score >= 40 else 'D',
            'issues': issues if issues else ['No issues detected'],
            'isReliable': score >= 60
        }
    
    quality = assessDataQuality(vehicleInfo)
    print(f'   Score: {quality["score"]}/100 (Grade: {quality["grade"]})')
    print(f'   Reliable: {quality["isReliable"]}')
    print(f'   Issues: {", ".join(quality["issues"])}')
    
    print('\n' + '='*50)
    print('🎯 CONCLUSION:')
    if vehicleInfo and sum(1 for v in vehicleInfo.values() if v == 'Unknown') == 0:
        print('✅ VIN 4T1C31AK0LU533615 should work perfectly in frontend!')
        print('✅ All data fields populated correctly')
        print('✅ No "Unknown" values expected')
    else:
        print('❌ Issues found in data flow')

if __name__ == '__main__':
    test_vin_4T1C31AK0LU533615()
