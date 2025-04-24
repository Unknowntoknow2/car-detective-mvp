
interface ZipTier {
  zips: string[];
  adjustment: number;
}

export function getZipAdjustment(zip: string, basePrice: number): number {
  const zipTiers: ZipTier[] = [
    {
      zips: ['90210', '10001', '60611', '94102', '98101'],
      adjustment: 0.03
    },
    {
      zips: ['78572', '30401', '63115', '35203', '59101'],
      adjustment: -0.02
    }
  ];

  const tier = zipTiers.find(t => t.zips.includes(zip));
  return tier ? basePrice * tier.adjustment : 0;
}
