
export interface DealerOffer {
  id: string;
  offer_amount: number;
  message?: string;
  dealer_id: string;
  created_at: string;
}

export interface ScoredOffer extends DealerOffer {
  delta: number;
  score: number;
  summary: string;
  recommendation: 'excellent' | 'good' | 'fair' | 'below_market';
}

export function scoreDealerOffers({
  valuationPrice,
  offers,
  userZip
}: {
  valuationPrice: number;
  offers: DealerOffer[];
  userZip?: string;
}) {
  return offers.map((offer): ScoredOffer => {
    const delta = offer.offer_amount - valuationPrice;
    const percentageDiff = (delta / valuationPrice) * 100;
    
    // Calculate base score (0-100)
    let score = Math.max(0, 100 - Math.abs(percentageDiff) * 2);
    
    // Determine recommendation category
    let recommendation: ScoredOffer['recommendation'];
    if (percentageDiff >= 5) {
      recommendation = 'excellent';
      score = Math.min(100, score + 15); // Boost for above-market offers
    } else if (percentageDiff >= 0) {
      recommendation = 'good';
      score = Math.min(100, score + 5);
    } else if (percentageDiff >= -5) {
      recommendation = 'fair';
    } else {
      recommendation = 'below_market';
      score = Math.max(0, score - 10); // Penalty for low offers
    }

    const summary = delta >= 0
      ? `This dealer is offering $${delta.toLocaleString()} **above** your valuation.`
      : `This dealer is offering $${Math.abs(delta).toLocaleString()} **below** your valuation.`;

    return {
      ...offer,
      delta,
      score: Math.round(score),
      summary,
      recommendation
    };
  });
}

export function getBestOffer(scoredOffers: ScoredOffer[]): ScoredOffer | null {
  if (!scoredOffers.length) return null;
  
  return scoredOffers.reduce((best, current) => 
    current.score > best.score ? current : best
  );
}

export function getOfferInsights(scoredOffers: ScoredOffer[], valuationPrice: number) {
  if (!scoredOffers.length) return null;

  const bestOffer = getBestOffer(scoredOffers);
  const averageOffer = scoredOffers.reduce((sum, offer) => sum + offer.offer_amount, 0) / scoredOffers.length;
  const totalOffers = scoredOffers.length;
  
  return {
    bestOffer,
    averageOffer: Math.round(averageOffer),
    totalOffers,
    valuationPrice,
    marketPosition: bestOffer ? (
      bestOffer.delta > 0 ? 'above_market' : 
      bestOffer.delta === 0 ? 'at_market' : 'below_market'
    ) : null
  };
}
