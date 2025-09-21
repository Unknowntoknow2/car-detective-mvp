import type { TitleStatus, RecallEntry, TitleHistoryResult, RecallCheckResult } from '@/types/valuation';

/**
 * NICB VINCheck API Service for Title Status
 * Uses NICB's free VINCheck service to detect stolen vehicles and title issues
 */
export async function lookupTitleStatus(vin: string): Promise<TitleHistoryResult | null> {
  if (!vin || vin.length !== 17) {
    console.warn('🚨 [TITLE_CHECK] Invalid VIN provided:', vin);
    return null;
  }

  try {

    const response = await fetch('https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/fetch_nicb_vincheck', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsdHhxcXphdHR4b2d4dHFyZ2d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NTYxMjYsImV4cCI6MjA2MTAzMjEyNn0.kUPmsyUdpcpnPLHWlnP7vODQiRgzCrWjOBfLib3lpvY'
      },
      body: JSON.stringify({ vin })
    });

    if (!response.ok) {
      console.error('❌ [TITLE_CHECK] NICB API error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();

    // Parse NICB response and determine title status
    let status: TitleStatus = 'clean';
    let confidence = 0.8;
    const details: any = {};

    if (data.theft_record) {
      status = 'theft_recovery';
      confidence = 0.9;
      details.damageTypes = ['theft'];
    } else if (data.total_loss_record) {
      status = 'salvage';
      confidence = 0.9;
      details.damageTypes = ['collision', 'total_loss'];
    } else if (data.status === 'salvage') {
      status = 'salvage';
      confidence = 0.85;
      details.damageTypes = ['collision'];
    } else {
      status = 'clean';
      confidence = 0.95;
    }

    return {
      status,
      confidence,
      source: 'nicb',
      lastChecked: new Date().toISOString(),
      details: Object.keys(details).length > 0 ? details : undefined
    };

  } catch (error) {
    console.error('❌ [TITLE_CHECK] Service error:', error);
    return null;
  }
}

/**
 * NHTSA Recall API Service for Open Recalls
 * Uses NHTSA VPIC API to check for unresolved safety recalls
 */
export async function lookupOpenRecalls(vin: string): Promise<RecallCheckResult | null> {
  if (!vin || vin.length !== 17) {
    console.warn('🚨 [RECALL_CHECK] Invalid VIN provided:', vin);
    return null;
  }

  try {

    // Call NHTSA recalls edge function
    const response = await fetch(
      'https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/fetch_nhtsa_recalls',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsdHhxcXphdHR4b2d4dHFyZ2d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NTYxMjYsImV4cCI6MjA2MTAzMjEyNn0.kUPmsyUdpcpnPLHWlnP7vODQiRgzCrWjOBfLib3lpvY'
        },
        body: JSON.stringify({ vin })
      }
    );

    if (!response.ok) {
      console.error('❌ [RECALL_CHECK] NHTSA API error:', response.status);
      return null;
    }

    const data = await response.json();
    
    if (data.error) {
      console.warn('🚨 [RECALL_CHECK] NHTSA service error:', data.error);
      return null;
    }

    const recalls: RecallEntry[] = data.recalls || [];
    const unresolved = recalls.filter(recall => !recall.isResolved);


    return {
      recalls,
      unresolved,
      totalRecalls: recalls.length,
      unresolvedCount: unresolved.length,
      lastChecked: data.lastChecked || new Date().toISOString(),
      source: 'nhtsa'
    };

  } catch (error) {
    console.error('❌ [RECALL_CHECK] Service error:', error);
    return null;
  }
}

/**
 * Parse NHTSA recall data into structured format
 */
function parseNHTSARecalls(data: any, vin: string): RecallEntry[] {
  const recalls: RecallEntry[] = [];
  
  try {
    // NHTSA recall data structure varies, implement robust parsing
    const recallResults = data.Results || [];
    
    recallResults.forEach((result: any, index: number) => {
      if (result.Variable?.toLowerCase().includes('recall')) {
        recalls.push({
          id: `nhtsa_${vin}_${index}`,
          description: result.Value || 'Recall information available - check with manufacturer',
          riskLevel: determineRiskLevel(result.Value || ''),
          issuedDate: new Date().toISOString(), // NHTSA doesn't always provide dates
          isResolved: false, // Conservative approach - assume unresolved
          component: extractComponent(result.Value || ''),
          consequence: extractConsequence(result.Value || '')
        });
      }
    });

    // Add mock recalls for testing purposes (remove in production)
    if (import.meta.env.NODE_ENV === 'development' && recalls.length === 0) {
      recalls.push({
        id: `test_recall_${vin}`,
        description: 'Airbag deployment sensor may malfunction',
        riskLevel: 'high',
        issuedDate: '2023-06-15T00:00:00Z',
        isResolved: false,
        component: 'Airbag System',
        consequence: 'Increased risk of injury in collision'
      });
    }

  } catch (error) {
    console.error('❌ [RECALL_CHECK] Error parsing NHTSA data:', error);
  }

  return recalls;
}

/**
 * Determine recall risk level from description
 */
function determineRiskLevel(description: string): 'low' | 'medium' | 'high' | 'critical' {
  const desc = description.toLowerCase();
  
  if (desc.includes('fire') || desc.includes('explosion') || desc.includes('brake') || desc.includes('steering')) {
    return 'critical';
  }
  
  if (desc.includes('airbag') || desc.includes('seatbelt') || desc.includes('crash')) {
    return 'high';
  }
  
  if (desc.includes('light') || desc.includes('warning') || desc.includes('display')) {
    return 'medium';
  }
  
  return 'low';
}

/**
 * Extract component from recall description
 */
function extractComponent(description: string): string | undefined {
  const components = ['engine', 'transmission', 'brake', 'airbag', 'fuel', 'electrical', 'steering'];
  const desc = description.toLowerCase();
  
  for (const component of components) {
    if (desc.includes(component)) {
      return component.charAt(0).toUpperCase() + component.slice(1);
    }
  }
  
  return undefined;
}

/**
 * Extract consequence from recall description
 */
function extractConsequence(description: string): string | undefined {
  if (description.length > 100) {
    // Extract first sentence or first 100 chars
    const sentence = description.split('.')[0];
    return sentence.length < 150 ? sentence : description.substring(0, 100) + '...';
  }
  
  return description;
}