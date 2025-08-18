#!/usr/bin/env node

/**
 * Test IIHS Integration (PR A - Section 2)
 * 
 * Tests:
 * 1. IIHS edge function with sample data
 * 2. Database upsert RPC function
 * 3. Vehicle profiles view integration
 * 4. IIHS data retrieval function
 */

async function testIIHSIntegration() {
    console.log('🔍 Testing IIHS Integration (PR A - Section 2)...\n');

    const baseUrl = 'http://127.0.0.1:54321';
    let passedTests = 0;
    let totalTests = 0;

    // Test 1: IIHS Edge Function
    console.log('Test 1: IIHS Edge Function');
    totalTests++;
    
    try {
        const response = await fetch(`${baseUrl}/functions/v1/iihs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                year: 2023,
                make: 'Toyota',
                model: 'Camry',
                trim: 'XLE'
            })
        });

        const data = await response.json();
        
        if (data.program === 'IIHS' && data.top_safety_pick_plus === true) {
            console.log('✅ IIHS function returns correct sample data');
            console.log(`   Award: Top Safety Pick+ = ${data.top_safety_pick_plus}`);
            console.log(`   Headlights: ${data.headlights}`);
            passedTests++;
        } else {
            console.log('❌ IIHS function data format incorrect');
            console.log('   Response:', JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.log('❌ IIHS function request failed:', error.message);
    }

    // Test 2: Database RPC Function
    console.log('\nTest 2: Database RPC Function');
    totalTests++;
    
    try {
        const response = await fetch(`${baseUrl}/rest/v1/rpc/rpc_upsert_iihs`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
            },
            body: JSON.stringify({
                p_payload: {
                    program: 'IIHS',
                    model_year: 2023,
                    make: 'Honda',
                    model: 'Accord',
                    trim: 'Sport',
                    crashworthiness: {
                        "small_overlap_front": "Good",
                        "moderate_overlap_front": "Good",
                        "side_impact": "Good",
                        "roof_strength": "Good",
                        "head_restraints": "Good"
                    },
                    crash_prevention: {
                        "vehicle_to_vehicle": "Superior",
                        "vehicle_to_pedestrian": "Superior",
                        "superior_award": true
                    },
                    headlights: "Good",
                    top_safety_pick: false,
                    top_safety_pick_plus: true,
                    source: 'TEST_INTEGRATION'
                }
            })
        });

        const data = await response.json();
        
        if (data.success === true && data.make === 'HONDA') {
            console.log('✅ RPC upsert function works correctly');
            console.log(`   Operation: ${data.operation}`);
            console.log(`   Vehicle: ${data.make} ${data.model}`);
            passedTests++;
        } else {
            console.log('❌ RPC upsert function failed');
            console.log('   Response:', JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.log('❌ RPC function request failed:', error.message);
    }

    // Test 3: Vehicle Profiles View Integration
    console.log('\nTest 3: Vehicle Profiles View Integration');
    totalTests++;
    
    try {
        const response = await fetch(`${baseUrl}/rest/v1/vehicle_profiles?select=*&model_year=eq.2023&make=eq.TOYOTA&model=eq.CAMRY&limit=1`, {
            headers: { 
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
            }
        });

        const data = await response.json();
        
        if (data.length > 0 && data[0].iihs_top_safety_pick_plus !== undefined) {
            console.log('✅ Vehicle profiles view includes IIHS data');
            console.log(`   IIHS Top Safety Pick+: ${data[0].iihs_top_safety_pick_plus}`);
            console.log(`   IIHS Headlights: ${data[0].iihs_headlights}`);
            console.log(`   Computed Safety Score: ${data[0].computed_safety_score}`);
            passedTests++;
        } else {
            console.log('❌ Vehicle profiles view missing IIHS columns');
            console.log('   Response:', JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.log('❌ Vehicle profiles view request failed:', error.message);
    }

    // Test 4: IIHS Details Function
    console.log('\nTest 4: IIHS Details Function');
    totalTests++;
    
    try {
        const response = await fetch(`${baseUrl}/rest/v1/rpc/get_iihs_details`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
            },
            body: JSON.stringify({
                p_year: 2023,
                p_make: 'Toyota',
                p_model: 'Camry',
                p_trim: 'XLE'
            })
        });

        const data = await response.json();
        
        if (data.found === true && data.award_level === 'TOP_SAFETY_PICK_PLUS') {
            console.log('✅ IIHS details function works correctly');
            console.log(`   Award Level: ${data.award_level}`);
            console.log(`   Data Age: ${data.data_age_days} days`);
            passedTests++;
        } else {
            console.log('❌ IIHS details function failed');
            console.log('   Response:', JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.log('❌ IIHS details function request failed:', error.message);
    }

    // Summary
    console.log('\n📊 Test Summary:');
    console.log(`✅ Passed: ${passedTests}/${totalTests} tests`);
    
    if (passedTests === totalTests) {
        console.log('🎉 All IIHS integration tests passed!');
        console.log('✨ PR A (IIHS Ratings) - Section 2 is ready!');
        return true;
    } else {
        console.log('⚠️  Some tests failed. Check implementation.');
        return false;
    }
}

// Run tests
testIIHSIntegration().then(success => {
    process.exit(success ? 0 : 1);
});
