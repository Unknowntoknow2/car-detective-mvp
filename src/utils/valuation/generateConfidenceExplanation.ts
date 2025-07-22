export function generateConfidenceExplanation(
  confidenceScore: number,
  marketListingsCount: number = 0,
  exactVinMatch: boolean = false,
  sources: string[] = []
): string {
  if (confidenceScore >= 85) {
    return `High confidence valuation based on ${marketListingsCount} market listings from ${sources.length} sources${exactVinMatch ? ' with exact VIN match' : ''}.`;
  } else if (confidenceScore >= 70) {
    return `Good confidence valuation with ${marketListingsCount} comparable listings${exactVinMatch ? ' including exact VIN match' : ''}.`;
  } else if (confidenceScore >= 50) {
    return `Moderate confidence valuation${marketListingsCount > 0 ? ` based on ${marketListingsCount} listings` : ' using fallback pricing model'}.`;
  } else {
    return `Limited confidence valuation${marketListingsCount === 0 ? ' using estimated pricing model due to limited market data' : ` with only ${marketListingsCount} comparable listings`}.`;
  }
}