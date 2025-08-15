import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function ProcessAuditTrail({ valuationId }: { valuationId: string }) {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('market_search_audit')
        .select('*')
        .eq('valuation_id', valuationId)
        .order('created_at', { ascending: true });
      setRows(data ?? []);
    })();
  }, [valuationId]);

  if (!rows.length) return null;

  return (
    <div className="rounded-2xl border p-4 space-y-3">
      <div className="font-semibold">Process Audit Trail</div>
      {rows.map((r) => (
        <div key={r.id} className="grid md:grid-cols-6 gap-3 text-sm border rounded-xl p-3">
          <div className="col-span-2">
            <div className="font-medium truncate">{r.source || 'Unknown source'}</div>
            <div className="text-xs text-muted-foreground break-all">{r.listing_url}</div>
          </div>
          <div>
            <div>API</div>
            <div className="text-xs">{r.api_ok ? 'OK' : 'Fail'} {r.api_http_status ? `(${r.api_http_status})` : ''}</div>
          </div>
          <div>
            <div>Tier / Quality</div>
            <div className="text-xs">{r.trust_tier ?? '-'} / {r.quality_score ?? '-'}</div>
          </div>
          <div>
            <div>Included?</div>
            <div className="text-xs">{r.included_in_comp_set ? 'Yes' : 'No'}</div>
          </div>
          <div>
            <div>Reason</div>
            <div className="text-xs">{r.exclusion_reason ?? '-'}</div>
          </div>
        </div>
      ))}
    </div>
  );
}