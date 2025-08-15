export function getConfidenceForResult(r: { method: string; confidence_score: number }) {
  const cap = r.method === 'fallback_pricing' ? 0.60
           : r.method === 'market_based'     ? 0.85
           : 0.70;

  const finalConfidence = Math.min(r.confidence_score, cap);
  let label: 'Low'|'Medium'|'High' = finalConfidence >= 0.80 ? 'High' : finalConfidence >= 0.60 ? 'Medium' : 'Low';
  if (r.method === 'fallback_pricing' && label === 'High') label = 'Medium';
  return { finalConfidence, label };
}