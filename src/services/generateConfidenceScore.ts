/**
 * Centralized confidence scoring system for valuations
 * Provides consistent, auditable confidence calculation
 */

export interface ConfidenceScoreParams {
  base?: number; // Base confidence score (default 45)
  hasExactVinMatch: boolean;
  listingCount: number;
  certifiedListingCount?: number;
  trustedSources?: string[];
  trustScore?: number; // 0-1 scale from market search agent
}

export interface ConfidenceScoreResult {
  score: number;
  explanation: string[];
  breakdown: {
    base: number;
    exactVinMatch: number;
    multipleListings: number;
    certifiedListings: number;
    trustedSources: number;
    trustScoreBonus: number;
    total: number;
    capped: boolean;
  };
}

// High-trust domains for source verification
const HIGH_TRUST_DOMAINS = [
  'carmax.com',
  'cargurus.com',
  'autotrader.com',
  'cars.com',
  'carfax.com',
  'edmunds.com',
  'kbb.com',
  'truecar.com',
  'vroom.com',
  'shift.com'
];

/**
 * Generate confidence score based on market data quality and listing sources
 */
export function generateConfidenceScore(params: ConfidenceScoreParams): ConfidenceScoreResult {
  const {
    base = 45,
    hasExactVinMatch,
    listingCount,
    certifiedListingCount = 0,
    trustedSources = [],
    trustScore = 0.5
  } = params;

  const explanation: string[] = [];
  const breakdown = {
    base,
    exactVinMatch: 0,
    multipleListings: 0,
    certifiedListings: 0,
    trustedSources: 0,
    trustScoreBonus: 0,
    total: base,
    capped: false
  };

  let score = base;

  // +20 for exact VIN match (highest priority)
  if (hasExactVinMatch) {
    const boost = 20;
    score += boost;
    breakdown.exactVinMatch = boost;
    explanation.push('Confidence boosted for exact VIN match.');
    console.log(`📈 Confidence: +${boost} for exact VIN match`);
  }

  // +10 for multiple listings (market validation)
  if (listingCount >= 2) {
    const boost = 10;
    score += boost;
    breakdown.multipleListings = boost;
    explanation.push(`Multiple market listings found (${listingCount}).`);
    console.log(`📈 Confidence: +${boost} for ${listingCount} listings`);
  }

  // +5 for certified listings (quality signal)
  if (certifiedListingCount > 0) {
    const boost = 5;
    score += boost;
    breakdown.certifiedListings = boost;
    explanation.push(`${certifiedListingCount} certified listing${certifiedListingCount > 1 ? 's' : ''} found.`);
    console.log(`📈 Confidence: +${boost} for ${certifiedListingCount} certified listings`);
  }

  // +5 for high-trust domain sources
  const trustedDomains = trustedSources.filter(source => 
    HIGH_TRUST_DOMAINS.some(domain => source.toLowerCase().includes(domain))
  );
  
  if (trustedDomains.length > 0) {
    const boost = 5;
    score += boost;
    breakdown.trustedSources = boost;
    const domainNames = trustedDomains
      .map(source => {
        const match = HIGH_TRUST_DOMAINS.find(domain => source.toLowerCase().includes(domain));
        return match?.split('.')[0].toUpperCase();
      })
      .filter(Boolean)
      .join(', ');
    explanation.push(`Listings found from high-trust source${trustedDomains.length > 1 ? 's' : ''}: ${domainNames}`);
    console.log(`📈 Confidence: +${boost} for trusted domains: ${domainNames}`);
  }

  // Additional trust score bonus (up to +5 based on search quality)
  if (trustScore > 0.7) {
    const boost = Math.round((trustScore - 0.7) * 16.67); // Max +5 when trustScore = 1.0
    score += boost;
    breakdown.trustScoreBonus = boost;
    if (boost > 0) {
      explanation.push(`High-quality market data detected.`);
      console.log(`📈 Confidence: +${boost} for high trust score (${(trustScore * 100).toFixed(0)}%)`);
    }
  }

  breakdown.total = score;

  // Cap at 95% maximum
  if (score > 95) {
    breakdown.capped = true;
    score = 95;
    explanation.push('Confidence capped at maximum 95%.');
    console.log(`🧢 Confidence capped at 95% (was ${breakdown.total})`);
  }

  // Add baseline explanation
  if (explanation.length === 0) {
    explanation.push(`Base confidence of ${base}% applied.`);
  }

  console.log('🎯 Final Confidence Score:', {
    score: `${score}%`,
    factors: breakdown,
    explanations: explanation
  });

  return {
    score,
    explanation,
    breakdown
  };
}

/**
 * Helper function to extract trusted domains from source URLs
 */
export function extractTrustedSources(sources: string[]): string[] {
  return sources.filter(source => 
    HIGH_TRUST_DOMAINS.some(domain => 
      source.toLowerCase().includes(domain)
    )
  );
}