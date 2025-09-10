// @ts-ignore - Deno remote imports
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface GoldenVin {
  id: string;
  vin: string;
  test_category: string;
  expected_results: any;
  description: string;
  priority: number;
  manufacturer: string;
  model_year: number;
  make: string;
  model: string;
  complexity_score: number;
}

interface TestRunRequest {
  run_type?: 'manual' | 'scheduled' | 'ci_cd' | 'regression' | 'performance';
  test_categories?: string[];
  max_priority?: number;
  environment?: 'development' | 'staging' | 'production';
  vin_filter?: string;
  git_commit_hash?: string;
  trigger_source?: string;
}

interface TestResult {
  golden_vin_id: string;
  vin: string;
  test_name: string;
  test_type: string;
  status: 'passed' | 'failed' | 'skipped' | 'error' | 'timeout';
  expected_result: any;
  actual_result: any;
  execution_time_ms: number;
  error_message?: string;
  error_code?: string;
  confidence_score?: number;
  accuracy_score?: number;
  performance_score?: number;
  metadata?: any;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { run_type = 'manual', test_categories, max_priority = 4, environment = 'production', vin_filter, git_commit_hash, trigger_source }: TestRunRequest = await req.json()

    console.log(`Starting QA test run - Type: ${run_type}, Environment: ${environment}`)

    // Create test run record
    const testRunStart = Date.now()
    const { data: testRun, error: testRunError } = await supabaseClient
      .from('qa_test_runs')
      .insert({
        run_type,
        environment,
        trigger_source,
        git_commit_hash,
        configuration: {
          test_categories,
          max_priority,
          vin_filter
        }
      })
      .select()
      .single()

    if (testRunError) {
      throw new Error(`Failed to create test run: ${testRunError.message}`)
    }

    console.log(`Created test run: ${testRun.id}`)

    // Fetch golden VINs based on criteria
    let query = supabaseClient
      .from('golden_vins')
      .select('*')
      .eq('is_active', true)
      .lte('priority', max_priority)

    if (test_categories && test_categories.length > 0) {
      query = query.in('test_category', test_categories)
    }

    if (vin_filter) {
      query = query.eq('vin', vin_filter)
    }

    const { data: goldenVins, error: goldenVinsError } = await query.order('priority').order('complexity_score')

    if (goldenVinsError) {
      throw new Error(`Failed to fetch golden VINs: ${goldenVinsError.message}`)
    }

    console.log(`Fetched ${goldenVins.length} golden VINs for testing`)

    // Execute tests for each golden VIN
    const testResults: TestResult[] = []
    let passedTests = 0
    let failedTests = 0
    let skippedTests = 0

    for (const goldenVin of goldenVins) {
      console.log(`Testing VIN: ${goldenVin.vin}`)

      // Test 1: VIN Decoder Test
      const decoderResult = await runVinDecoderTest(supabaseClient, goldenVin)
      testResults.push(decoderResult)
      updateTestCounts(decoderResult.status)

      // Test 2: Safety Data Test (if expected results include safety data)
      if (goldenVin.expected_results?.safety) {
        const safetyResult = await runSafetyDataTest(supabaseClient, goldenVin)
        testResults.push(safetyResult)
        updateTestCounts(safetyResult.status)
      }

      // Test 3: Market Intelligence Test (if expected results include market data)
      if (goldenVin.expected_results?.market_intelligence) {
        const marketResult = await runMarketIntelligenceTest(supabaseClient, goldenVin)
        testResults.push(marketResult)
        updateTestCounts(marketResult.status)
      }

      // Test 4: Valuation Test (if expected results include valuation data)
      if (goldenVin.expected_results?.valuation) {
        const valuationResult = await runValuationTest(supabaseClient, goldenVin)
        testResults.push(valuationResult)
        updateTestCounts(valuationResult.status)
      }

      // Test 5: Performance Test (response time)
      const performanceResult = await runPerformanceTest(supabaseClient, goldenVin)
      testResults.push(performanceResult)
      updateTestCounts(performanceResult.status)
    }

    function updateTestCounts(status: string) {
      switch (status) {
        case 'passed':
          passedTests++
          break
        case 'failed':
        case 'error':
        case 'timeout':
          failedTests++
          break
        case 'skipped':
          skippedTests++
          break
      }
    }

    // Insert all test results
    const { error: resultsError } = await supabaseClient
      .from('qa_test_results')
      .insert(testResults.map(result => ({
        test_run_id: testRun.id,
        ...result
      })))

    if (resultsError) {
      console.error('Failed to insert test results:', resultsError)
    }

    // Update test run with final results
    const totalExecutionTime = Date.now() - testRunStart
    const totalTests = testResults.length
    
    const { error: updateError } = await supabaseClient
      .from('qa_test_runs')
      .update({
        status: failedTests > 0 ? 'failed' : 'completed',
        total_tests: totalTests,
        passed_tests: passedTests,
        failed_tests: failedTests,
        skipped_tests: skippedTests,
        execution_time_ms: totalExecutionTime,
        completed_at: new Date().toISOString(),
        detailed_results: {
          summary: {
            total_vins_tested: goldenVins.length,
            pass_rate: totalTests > 0 ? (passedTests / totalTests) * 100 : 0,
            avg_execution_time_per_test: totalTests > 0 ? totalExecutionTime / totalTests : 0
          },
          test_results: testResults.slice(0, 10) // Include first 10 for summary
        }
      })
      .eq('id', testRun.id)

    if (updateError) {
      console.error('Failed to update test run:', updateError)
    }

    // Log operational metrics
    await logOperationalMetric(supabaseClient, 'qa_test_execution_time', totalExecutionTime, 'ms', 'performance', 'qa_test_runner')
    await logOperationalMetric(supabaseClient, 'qa_test_pass_rate', totalTests > 0 ? (passedTests / totalTests) * 100 : 0, 'percentage', 'accuracy', 'qa_test_runner')
    await logOperationalMetric(supabaseClient, 'qa_test_coverage', goldenVins.length, 'count', 'usage', 'qa_test_runner')

    console.log(`QA test run completed - Passed: ${passedTests}, Failed: ${failedTests}, Skipped: ${skippedTests}`)

    return new Response(
      JSON.stringify({
        success: true,
        test_run_id: testRun.id,
        summary: {
          total_tests: totalTests,
          passed_tests: passedTests,
          failed_tests: failedTests,
          skipped_tests: skippedTests,
          execution_time_ms: totalExecutionTime,
          pass_rate: totalTests > 0 ? Math.round((passedTests / totalTests) * 100 * 100) / 100 : 0,
          golden_vins_tested: goldenVins.length
        },
        status: failedTests > 0 ? 'failed' : 'completed'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('QA test runner error:', error)
    
    return new Response(
      JSON.stringify({
        error: error.message,
        details: 'QA test execution failed'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

// Test execution functions
async function runVinDecoderTest(supabaseClient: any, goldenVin: GoldenVin): Promise<TestResult> {
  const testStart = Date.now()
  
  try {
    // Call the VIN decoder edge function
    const { data, error } = await supabaseClient.functions.invoke('decode-vin', {
      body: { vin: goldenVin.vin }
    })

    const executionTime = Date.now() - testStart

    if (error) {
      return {
        golden_vin_id: goldenVin.id,
        vin: goldenVin.vin,
        test_name: 'VIN Decoder',
        test_type: 'decoder',
        status: 'error',
        expected_result: goldenVin.expected_results?.decoder,
        actual_result: null,
        execution_time_ms: executionTime,
        error_message: error.message,
        error_code: 'DECODER_ERROR'
      }
    }

    // Compare results with expected
    const expected = goldenVin.expected_results?.decoder
    const actual = data

    let status: 'passed' | 'failed' = 'passed'
    let accuracy = 1.0

    if (expected) {
      // Compare key fields
      const keyFields = ['make', 'model', 'year', 'trim', 'engine', 'transmission']
      let matches = 0
      
      for (const field of keyFields) {
        if (expected[field] && actual[field]) {
          if (expected[field].toLowerCase() === actual[field].toLowerCase()) {
            matches++
          }
        }
      }
      
      accuracy = matches / keyFields.length
      status = accuracy >= 0.8 ? 'passed' : 'failed'
    }

    return {
      golden_vin_id: goldenVin.id,
      vin: goldenVin.vin,
      test_name: 'VIN Decoder',
      test_type: 'decoder',
      status,
      expected_result: expected,
      actual_result: actual,
      execution_time_ms: executionTime,
      accuracy_score: accuracy,
      performance_score: executionTime < 1000 ? 1.0 : Math.max(0, 1.0 - (executionTime - 1000) / 5000)
    }
  } catch (error) {
    return {
      golden_vin_id: goldenVin.id,
      vin: goldenVin.vin,
      test_name: 'VIN Decoder',
      test_type: 'decoder',
      status: 'error',
      expected_result: goldenVin.expected_results?.decoder,
      actual_result: null,
      execution_time_ms: Date.now() - testStart,
      error_message: error.message,
      error_code: 'DECODER_EXCEPTION'
    }
  }
}

async function runSafetyDataTest(supabaseClient: any, goldenVin: GoldenVin): Promise<TestResult> {
  const testStart = Date.now()
  
  try {
    // Query IIHS safety data
    const { data, error } = await supabaseClient
      .from('iihs_ratings_enhanced')
      .select('*')
      .eq('vin', goldenVin.vin)
      .single()

    const executionTime = Date.now() - testStart

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      return {
        golden_vin_id: goldenVin.id,
        vin: goldenVin.vin,
        test_name: 'Safety Data Retrieval',
        test_type: 'safety',
        status: 'error',
        expected_result: goldenVin.expected_results?.safety,
        actual_result: null,
        execution_time_ms: executionTime,
        error_message: error.message,
        error_code: 'SAFETY_DATA_ERROR'
      }
    }

    // Compare with expected safety results
    const expected = goldenVin.expected_results?.safety
    const actual = data

    let status: 'passed' | 'failed' = 'passed'
    let accuracy = 1.0

    if (expected && actual) {
      // Compare safety ratings
      const ratingFields = ['overall_rating', 'frontal_crash_rating', 'side_crash_rating']
      let matches = 0
      
      for (const field of ratingFields) {
        if (expected[field] && actual[field]) {
          if (expected[field] === actual[field]) {
            matches++
          }
        }
      }
      
      accuracy = matches / ratingFields.length
      status = accuracy >= 0.7 ? 'passed' : 'failed'
    } else if (expected && !actual) {
      status = 'failed'
      accuracy = 0
    }

    return {
      golden_vin_id: goldenVin.id,
      vin: goldenVin.vin,
      test_name: 'Safety Data Retrieval',
      test_type: 'safety',
      status,
      expected_result: expected,
      actual_result: actual,
      execution_time_ms: executionTime,
      accuracy_score: accuracy,
      performance_score: executionTime < 500 ? 1.0 : Math.max(0, 1.0 - (executionTime - 500) / 2000)
    }
  } catch (error) {
    return {
      golden_vin_id: goldenVin.id,
      vin: goldenVin.vin,
      test_name: 'Safety Data Retrieval',
      test_type: 'safety',
      status: 'error',
      expected_result: goldenVin.expected_results?.safety,
      actual_result: null,
      execution_time_ms: Date.now() - testStart,
      error_message: error.message,
      error_code: 'SAFETY_TEST_EXCEPTION'
    }
  }
}

async function runMarketIntelligenceTest(supabaseClient: any, goldenVin: GoldenVin): Promise<TestResult> {
  const testStart = Date.now()
  
  try {
    // Call market intelligence edge function
    const { data, error } = await supabaseClient.functions.invoke('market-signals', {
      body: { 
        vin: goldenVin.vin,
        year: goldenVin.model_year,
        make: goldenVin.make,
        model: goldenVin.model
      }
    })

    const executionTime = Date.now() - testStart

    if (error) {
      return {
        golden_vin_id: goldenVin.id,
        vin: goldenVin.vin,
        test_name: 'Market Intelligence',
        test_type: 'market',
        status: 'error',
        expected_result: goldenVin.expected_results?.market_intelligence,
        actual_result: null,
        execution_time_ms: executionTime,
        error_message: error.message,
        error_code: 'MARKET_INTELLIGENCE_ERROR'
      }
    }

    // Validate market intelligence data structure
    const expected = goldenVin.expected_results?.market_intelligence
    const actual = data

    let status: 'passed' | 'failed' = 'passed'
    let accuracy = 1.0

    if (expected && actual) {
      // Check for required fields and reasonable values
      const requiredFields = ['market_score', 'market_temperature', 'sales_momentum', 'consumer_interest']
      let validFields = 0
      
      for (const field of requiredFields) {
        if (actual[field] !== undefined && actual[field] !== null) {
          validFields++
        }
      }
      
      accuracy = validFields / requiredFields.length
      status = accuracy >= 0.75 ? 'passed' : 'failed'
    }

    return {
      golden_vin_id: goldenVin.id,
      vin: goldenVin.vin,
      test_name: 'Market Intelligence',
      test_type: 'market',
      status,
      expected_result: expected,
      actual_result: actual,
      execution_time_ms: executionTime,
      accuracy_score: accuracy,
      performance_score: executionTime < 2000 ? 1.0 : Math.max(0, 1.0 - (executionTime - 2000) / 8000)
    }
  } catch (error) {
    return {
      golden_vin_id: goldenVin.id,
      vin: goldenVin.vin,
      test_name: 'Market Intelligence',
      test_type: 'market',
      status: 'error',
      expected_result: goldenVin.expected_results?.market_intelligence,
      actual_result: null,
      execution_time_ms: Date.now() - testStart,
      error_message: error.message,
      error_code: 'MARKET_TEST_EXCEPTION'
    }
  }
}

async function runValuationTest(supabaseClient: any, goldenVin: GoldenVin): Promise<TestResult> {
  const testStart = Date.now()
  
  try {
    // Call enhanced valuation edge function
    const { data, error } = await supabaseClient.functions.invoke('enhanced-valuation', {
      body: { 
        vin: goldenVin.vin,
        year: goldenVin.model_year,
        make: goldenVin.make,
        model: goldenVin.model
      }
    })

    const executionTime = Date.now() - testStart

    if (error) {
      return {
        golden_vin_id: goldenVin.id,
        vin: goldenVin.vin,
        test_name: 'Enhanced Valuation',
        test_type: 'valuation',
        status: 'error',
        expected_result: goldenVin.expected_results?.valuation,
        actual_result: null,
        execution_time_ms: executionTime,
        error_message: error.message,
        error_code: 'VALUATION_ERROR'
      }
    }

    // Validate valuation results
    const expected = goldenVin.expected_results?.valuation
    const actual = data

    let status: 'passed' | 'failed' = 'passed'
    let accuracy = 1.0

    if (expected && actual) {
      // Check if valuation is within expected range
      const expectedValue = expected.adjusted_value || expected.base_value
      const actualValue = actual.adjusted_value || actual.base_value
      
      if (expectedValue && actualValue) {
        const percentDifference = Math.abs(actualValue - expectedValue) / expectedValue
        accuracy = Math.max(0, 1.0 - percentDifference)
        status = percentDifference <= 0.15 ? 'passed' : 'failed' // Within 15% tolerance
      }
    }

    return {
      golden_vin_id: goldenVin.id,
      vin: goldenVin.vin,
      test_name: 'Enhanced Valuation',
      test_type: 'valuation',
      status,
      expected_result: expected,
      actual_result: actual,
      execution_time_ms: executionTime,
      accuracy_score: accuracy,
      performance_score: executionTime < 3000 ? 1.0 : Math.max(0, 1.0 - (executionTime - 3000) / 10000)
    }
  } catch (error) {
    return {
      golden_vin_id: goldenVin.id,
      vin: goldenVin.vin,
      test_name: 'Enhanced Valuation',
      test_type: 'valuation',
      status: 'error',
      expected_result: goldenVin.expected_results?.valuation,
      actual_result: null,
      execution_time_ms: Date.now() - testStart,
      error_message: error.message,
      error_code: 'VALUATION_TEST_EXCEPTION'
    }
  }
}

async function runPerformanceTest(supabaseClient: any, goldenVin: GoldenVin): Promise<TestResult> {
  const testStart = Date.now()
  
  try {
    // Test overall system performance with a comprehensive call
    const { data, error } = await supabaseClient.functions.invoke('decode-vin', {
      body: { vin: goldenVin.vin, include_safety: true, include_market: true }
    })

    const executionTime = Date.now() - testStart

    if (error) {
      return {
        golden_vin_id: goldenVin.id,
        vin: goldenVin.vin,
        test_name: 'Performance Test',
        test_type: 'integration',
        status: 'error',
        expected_result: { max_response_time_ms: 5000 },
        actual_result: { response_time_ms: executionTime },
        execution_time_ms: executionTime,
        error_message: error.message,
        error_code: 'PERFORMANCE_ERROR'
      }
    }

    // Performance scoring based on response time
    const expectedMaxTime = goldenVin.expected_results?.performance?.max_response_time_ms || 5000
    const performanceScore = executionTime <= expectedMaxTime ? 1.0 : Math.max(0, 1.0 - (executionTime - expectedMaxTime) / expectedMaxTime)
    const status = executionTime <= expectedMaxTime ? 'passed' : 'failed'

    return {
      golden_vin_id: goldenVin.id,
      vin: goldenVin.vin,
      test_name: 'Performance Test',
      test_type: 'integration',
      status,
      expected_result: { max_response_time_ms: expectedMaxTime },
      actual_result: { response_time_ms: executionTime, data_size_bytes: JSON.stringify(data).length },
      execution_time_ms: executionTime,
      performance_score: performanceScore,
      metadata: {
        complexity_score: goldenVin.complexity_score,
        data_completeness: data ? Object.keys(data).length : 0
      }
    }
  } catch (error) {
    return {
      golden_vin_id: goldenVin.id,
      vin: goldenVin.vin,
      test_name: 'Performance Test',
      test_type: 'integration',
      status: 'error',
      expected_result: { max_response_time_ms: 5000 },
      actual_result: null,
      execution_time_ms: Date.now() - testStart,
      error_message: error.message,
      error_code: 'PERFORMANCE_TEST_EXCEPTION'
    }
  }
}

// Helper function to log operational metrics
async function logOperationalMetric(
  supabaseClient: any,
  metricName: string,
  metricValue: number,
  metricUnit: string,
  category: string,
  sourceComponent: string
) {
  try {
    await supabaseClient.rpc('add_operational_metric', {
      p_metric_name: metricName,
      p_metric_value: metricValue,
      p_metric_unit: metricUnit,
      p_category: category,
      p_source_component: sourceComponent
    })
  } catch (error) {
    console.error('Failed to log operational metric:', error)
  }
}
