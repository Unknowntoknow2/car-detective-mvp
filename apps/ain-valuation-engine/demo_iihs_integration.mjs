#!/usr/bin/env node

/**
 * IIHS Integration Demo - PR A (Section 2)
 * 
 * Demonstrates:
 * 1. IIHS edge function capabilities
 * 2. Database upsert functionality 
 * 3. Data retrieval and analysis
 * 4. Award level classification
 */

async function demoIIHSIntegration() {
    console.log('🏆 IIHS Integration Demo - Section 2 PR A\n');

    const baseUrl = 'http://127.0.0.1:54321';

    // Demo 1: IIHS Edge Function
    console.log('1️⃣ IIHS Edge Function - Sample Data Retrieval');
    console.log('   Request: 2023 Toyota Camry XLE\n');
    
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
        
        console.log('   📊 IIHS Rating Results:');
        console.log(`   Program: ${data.program}`);
        console.log(`   Vehicle: ${data.make} ${data.model} ${data.trim}`);
        console.log(`   Model Year: ${data.model_year}`);
        
        if (data.crashworthiness) {
            console.log('\n   🛡️ Crashworthiness Tests:');
            Object.entries(data.crashworthiness).forEach(([test, rating]) => {
                console.log(`     ${test.replace(/_/g, ' ')}: ${rating}`);
            });
        }
        
        if (data.crash_prevention) {
            console.log('\n   🚨 Crash Prevention:');
            Object.entries(data.crash_prevention).forEach(([feature, value]) => {
                if (feature !== 'superior_award') {
                    console.log(`     ${feature.replace(/_/g, ' ')}: ${value}`);
                }
            });
        }
        
        console.log(`\n   💡 Headlights: ${data.headlights}`);
        console.log(`   🏆 Top Safety Pick: ${data.top_safety_pick ? 'Yes' : 'No'}`);
        console.log(`   🥇 Top Safety Pick+: ${data.top_safety_pick_plus ? 'Yes' : 'No'}`);
        
        const awardLevel = data.top_safety_pick_plus ? 'TOP SAFETY PICK+' : 
                          data.top_safety_pick ? 'TOP SAFETY PICK' : 'No Award';
        console.log(`   🎖️ Award Level: ${awardLevel}`);
        
    } catch (error) {
        console.log('   ❌ Error:', error.message);
    }

    // Demo 2: Database Upsert
    console.log('\n\n2️⃣ Database Upsert - New Vehicle Rating');
    console.log('   Adding: 2023 BMW X5 M50i\n');
    
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
                    make: 'BMW',
                    model: 'X5',
                    trim: 'M50i',
                    crashworthiness: {
                        "small_overlap_front": "Good",
                        "moderate_overlap_front": "Good",
                        "side_impact": "Good",
                        "roof_strength": "Good",
                        "head_restraints": "Good"
                    },
                    crash_prevention: {
                        "vehicle_to_vehicle": "Superior",
                        "vehicle_to_pedestrian": "Advanced",
                        "superior_award": true
                    },
                    headlights: "Acceptable",
                    top_safety_pick: true,
                    top_safety_pick_plus: false,
                    source: 'DEMO_INTEGRATION'
                }
            })
        });

        const result = await response.json();
        
        if (result.success) {
            console.log('   ✅ Successfully stored IIHS rating');
            console.log(`   Vehicle: ${result.make} ${result.model} ${result.trim || ''}`);
            console.log(`   Operation: ${result.operation}`);
            console.log(`   Year: ${result.model_year}`);
        } else {
            console.log('   ❌ Storage failed:', result.error);
        }
        
    } catch (error) {
        console.log('   ❌ Error:', error.message);
    }

    // Demo 3: IIHS Details Function
    console.log('\n\n3️⃣ IIHS Details Lookup');
    console.log('   Querying: 2023 Subaru Outback Limited\n');
    
    try {
        const response = await fetch(`${baseUrl}/rest/v1/rpc/get_iihs_details`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
            },
            body: JSON.stringify({
                p_year: 2023,
                p_make: 'Subaru',
                p_model: 'Outback',
                p_trim: 'Limited'
            })
        });

        const data = await response.json();
        
        if (data.found) {
            console.log('   📋 IIHS Details Found:');
            console.log(`   Vehicle: ${data.make} ${data.model} ${data.trim || 'All Trims'}`);
            console.log(`   Award Level: ${data.award_level}`);
            console.log(`   TSP: ${data.top_safety_pick ? 'Yes' : 'No'}`);
            console.log(`   TSP+: ${data.top_safety_pick_plus ? 'Yes' : 'No'}`);
            console.log(`   Headlights: ${data.headlights}`);
            console.log(`   Data Age: ${Math.floor(data.data_age_days)} days`);
            console.log(`   Source: ${data.source}`);
        } else {
            console.log('   📋 No IIHS data found');
            console.log(`   Search: ${data.search_criteria?.make} ${data.search_criteria?.model}`);
        }
        
    } catch (error) {
        console.log('   ❌ Error:', error.message);
    }

    // Demo 4: All IIHS Records
    console.log('\n\n4️⃣ All IIHS Records in Database');
    console.log('   Current IIHS ratings stored:\n');
    
    try {
        const response = await fetch(`${baseUrl}/rest/v1/iihs_ratings?select=make,model,trim,model_year,top_safety_pick,top_safety_pick_plus,headlights&order=make,model`, {
            headers: { 
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
            }
        });

        const records = await response.json();
        
        if (records.length > 0) {
            records.forEach((record, index) => {
                const awardBadge = record.top_safety_pick_plus ? '🥇 TSP+' : 
                                  record.top_safety_pick ? '🏆 TSP' : '⭐ Rated';
                                  
                console.log(`   ${index + 1}. ${awardBadge} ${record.make} ${record.model} ${record.trim || ''} (${record.model_year})`);
                console.log(`      Headlights: ${record.headlights}`);
            });
        } else {
            console.log('   No IIHS records found in database');
        }
        
    } catch (error) {
        console.log('   ❌ Error:', error.message);
    }

    console.log('\n\n✨ IIHS Integration Demo Complete!');
    console.log('🎯 PR A (IIHS Ratings Ingestion) - Section 2 Implementation Ready');
    console.log('\n📋 Key Features Demonstrated:');
    console.log('   • IIHS web scraping simulation');
    console.log('   • Database upsert with validation');
    console.log('   • Award level classification');
    console.log('   • Detailed data retrieval');
    console.log('   • Comprehensive data storage');
    
    return true;
}

// Run demo
demoIIHSIntegration().then(() => {
    console.log('\n🚀 Ready to continue with Section 2 - PR B (OEM Features)!');
});
