import { SupabaseClient } from '@supabase/supabase-js';

export interface Adjustment { name: string; amount: number; reason: string; source: string; }

export async function computeAdjustments(profile: any, weights: Record<string, number>): Promise<Adjustment[]> {
  const adj: Adjustment[] = [];
  // Recalls
  const openCount = profile.open_recall_count ?? 0;
  const per = weights['adj.recall_per_open_pct'] ?? -1;
  const cap = weights['adj.recall_cap_pct'] ?? -3;
  const recallAdj = Math.max(openCount * per, cap);
  if (openCount > 0) {
    adj.push({ name: 'Open Recalls', amount: recallAdj, reason: `${openCount} open recalls`, source: 'NHTSA Recalls' });
  }
  // TODO: Add IIHS, OEM, Complaints, Market adjusters using profile fields.
  return adj;
}
