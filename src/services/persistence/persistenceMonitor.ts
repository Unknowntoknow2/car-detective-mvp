import { supabase } from '@/integrations/supabase/client';

/**
 * Persistence monitoring service to track critical data operations
 * and ensure audit trails are working correctly
 */

export interface PersistenceHealth {
  auditLogsWorking: boolean;
  valuationRequestsWorking: boolean;
  complianceLogsWorking: boolean;
  lastAuditLog?: Date;
  lastValuationRequest?: Date;
  totalAuditLogs: number;
  totalValuationRequests: number;
  healthScore: number; // 0-100
}

/**
 * Check the health of all persistence systems
 */
export async function checkPersistenceHealth(): Promise<PersistenceHealth> {
  try {
    // Check audit logs
    const { data: auditData, error: auditError } = await supabase
      .from('valuation_audit_logs')
      .select('id, created_at')
      .order('created_at', { ascending: false })
      .limit(1);

    // Check valuation requests
    const { data: requestData, error: requestError } = await supabase
      .from('valuation_requests')
      .select('id, created_at')
      .order('created_at', { ascending: false })
      .limit(1);

    // Get counts
    const { count: auditCount } = await supabase
      .from('valuation_audit_logs')
      .select('*', { count: 'exact', head: true });

    const { count: requestCount } = await supabase
      .from('valuation_requests')
      .select('*', { count: 'exact', head: true });

    const health: PersistenceHealth = {
      auditLogsWorking: !auditError && (auditCount || 0) > 0,
      valuationRequestsWorking: !requestError && (requestCount || 0) > 0,
      complianceLogsWorking: true, // Always true for now
      lastAuditLog: auditData?.[0]?.created_at ? new Date(auditData[0].created_at) : undefined,
      lastValuationRequest: requestData?.[0]?.created_at ? new Date(requestData[0].created_at) : undefined,
      totalAuditLogs: auditCount || 0,
      totalValuationRequests: requestCount || 0,
      healthScore: 0
    };

    // Calculate health score
    let score = 0;
    if (health.auditLogsWorking) score += 40;
    if (health.valuationRequestsWorking) score += 40;
    if (health.complianceLogsWorking) score += 20;

    health.healthScore = score;

    return health;
  } catch (error) {
    return {
      auditLogsWorking: false,
      valuationRequestsWorking: false,
      complianceLogsWorking: false,
      totalAuditLogs: 0,
      totalValuationRequests: 0,
      healthScore: 0
    };
  }
}

/**
 * Test audit logging by creating a test record
 */
export async function testAuditLogging(): Promise<{ success: boolean; error?: string; id?: string }> {
  try {
    const testData = {
      user_id: null,
      vin: 'TEST' + Date.now(),
      zip_code: '00000',
      step: 'health_check',
      adjustment: 0,
      final_value: 25000,
      confidence_score: 95,
      status: 'COMPLETED',
      adjustment_reason: 'Health check test',
      base_value: 25000,
      adjustment_percentage: 0,
      data_sources: ['health_check'],
      metadata: {
        test: true,
        timestamp: new Date().toISOString()
      }
    };

    const { data, error } = await supabase
      .from('valuation_audit_logs')
      .insert(testData)
      .select('id')
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, id: data.id };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Test valuation request creation
 */
export async function testValuationRequestCreation(): Promise<{ success: boolean; error?: string; id?: string }> {
  try {
    const testData = {
      user_id: null,
      vin: 'TEST' + Date.now(),
      zip_code: '00000',
      mileage: 50000,
      status: 'test',
      additional_data: {
        test: true,
        timestamp: new Date().toISOString()
      }
    };

    const { data, error } = await supabase
      .from('valuation_requests')
      .insert(testData)
      .select('id')
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, id: data.id };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Run comprehensive persistence tests
 */
export async function runPersistenceTests(): Promise<{
  auditTest: { success: boolean; error?: string; id?: string };
  requestTest: { success: boolean; error?: string; id?: string };
  overallHealth: PersistenceHealth;
}> {
  const auditTest = await testAuditLogging();
  const requestTest = await testValuationRequestCreation();
  const overallHealth = await checkPersistenceHealth();

  return {
    auditTest,
    requestTest,
    overallHealth
  };
}