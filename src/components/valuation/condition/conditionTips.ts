
// Value improvement tips based on condition categories at different levels
// Provides specific, actionable advice to improve vehicle value

export function getImprovementTips(id: string, score: number): string | null {
  // Only provide tips for items below 80 (Very Good)
  if (score >= 80) return null;
  
  const conditionLevel = getConditionRangeForTips(score);
  return improvementTips[id]?.[conditionLevel] || generalTips[conditionLevel];
}

// Map score to simplified condition level for tips
function getConditionRangeForTips(score: number): TipRange {
  if (score <= 20) return 'poor';
  if (score <= 40) return 'fair';
  if (score <= 60) return 'good';
  return 'veryGood';
}

type TipRange = 'poor' | 'fair' | 'good' | 'veryGood';

// Default general tips for each condition range
const generalTips: Record<TipRange, string> = {
  poor: 'Consider addressing critical repairs before valuation. Even basic improvements can significantly increase value.',
  fair: 'Professional detailing and minor repairs could increase value by 5-10%. Focus on most visible issues first.',
  good: 'Addressing minor issues and documenting maintenance history could add 2-5% to your valuation.',
  veryGood: 'Minor cosmetic touch-ups and complete service records could boost your vehicle to "Excellent" condition.',
};

// Specific improvement tips for each item at different condition levels
const improvementTips: Record<string, Partial<Record<TipRange, string>>> = {
  // Exterior items
  'exterior-paint': {
    poor: 'A professional paint correction or even partial repaint could add 10-15% to exterior value.',
    fair: 'Paint touch-up and professional buffing could add 5-8% to your vehicle's appearance value.',
    good: 'Professional detailing with paint correction can add 2-4% to vehicle value.',
    veryGood: 'A final polish and paint sealant application can perfect your finish for maximum value.',
  },
  'exterior-body': {
    poor: 'Addressing major dents and body damage can increase value by 15-20%, often exceeding repair costs.',
    fair: 'Paintless dent removal service (typically $300-500) can add $500-1,000 to vehicle value.',
    good: 'Fixing minor dings (often $100-200) can add $300-500 to perceived value.',
    veryGood: 'Addressing even minor imperfections can help achieve "Excellent" rating and premium pricing.',
  },
  'exterior-glass': {
    poor: 'Windshield replacement (often covered by insurance) can prevent failed inspections and add significant value.',
    fair: 'Professional chip repair (typically $50-100) prevents further damage and improves appearance.',
    good: 'Polishing minor scratches in glass can improve clarity and overall impression.',
    veryGood: 'Ensuring all glass is pristine helps achieve an "Excellent" overall condition rating.',
  },
  'exterior-lights': {
    poor: 'Replacing damaged lights improves safety, passing inspection, and can add 3-5% to exterior value.',
    fair: 'Headlight restoration kits ($20-30) can dramatically improve appearance and night visibility.',
    good: 'Polishing slightly hazed headlights can improve appearance and lighting performance.',
    veryGood: 'Ensuring all lights are perfect enhances safety appeal and overall condition rating.',
  },
  'exterior-trim': {
    poor: 'Replacing missing or damaged trim pieces significantly improves first impressions and perceived care.',
    fair: 'Trim restoration products ($15-30) can revive faded plastic and add perceived value.',
    good: 'Detailing trim and applying protectant creates a well-maintained appearance that appeals to buyers.',
    veryGood: 'Ensuring all trim is perfect contributes to achieving maximum "Excellent" condition rating.',
  },

  // Interior items
  'interior-seats': {
    poor: 'Professional upholstery repair for major damage can add 10-15% to interior value.',
    fair: 'Seat cleaning and minor repair (typically $100-300) can add $500+ to perceived value.',
    good: 'Professional interior detailing ($150-250) creates a fresh, well-maintained appearance.',
    veryGood: 'Leather conditioning or fabric protection can preserve current condition and prevent deterioration.',
  },
  'interior-dash': {
    poor: 'Repairing broken controls and cracked surfaces significantly improves functionality and appearance.',
    fair: 'Dashboard restoration products ($20-50) can revive faded surfaces and reduce visible wear.',
    good: 'Thorough interior detailing with proper protectants prevents future damage and UV fading.',
    veryGood: 'Addressing even minor imperfections can elevate your interior to showroom condition.',
  },
  'interior-carpet': {
    poor: 'Professional carpet cleaning or replacement dramatically improves interior impression and odor.',
    fair: 'Deep carpet extraction cleaning ($75-150) can remove embedded stains and dirt.',
    good: 'Thorough carpet cleaning and stain treatment refreshes overall interior appearance.',
    veryGood: 'Adding new floor mats ($50-150) can preserve carpet condition and enhance appearance.',
  },
  'interior-headliner': {
    poor: 'Headliner repair or replacement eliminates a major negative that can decrease offers by 5-10%.',
    fair: 'Professional headliner cleaning or minor repair prevents future sagging and deterioration.',
    good: 'Thorough cleaning removes minor stains and maintains a clean interior appearance.',
    veryGood: 'Fabric protectant helps maintain current condition and prevents future staining.',
  },
  'interior-electronics': {
    poor: 'Repairing critical electronic systems is essential for proper valuation and functionality.',
    fair: 'Addressing minor electrical issues improves functionality and prevents buyer concerns.',
    good: 'Software updates and ensuring all features work properly enhances perceived value.',
    veryGood: 'Documenting all functioning features helps achieve maximum valuation.',
  },

  // Mechanical items
  'mechanical-engine': {
    poor: 'Basic engine repairs and oil leaks should be addressed to avoid severe undervaluation.',
    fair: 'Fresh oil change, tune-up, and fixing minor leaks can increase value and buyer confidence.',
    good: 'Completing all scheduled maintenance and keeping records adds significant perceived value.',
    veryGood: 'Detailing engine bay and documenting service history maximizes mechanical value assessment.',
  },
  'mechanical-transmission': {
    poor: 'Addressing transmission issues is crucial - problems here can decrease offers by 20-30%.',
    fair: 'Transmission service and addressing minor issues prevents further deterioration.',
    good: 'Fluid change and minor adjustments can improve shifting and overall impression.',
    veryGood: 'Documented transmission service adds peace of mind and helps achieve premium valuation.',
  },
  'mechanical-suspension': {
    poor: 'Replacing worn suspension components improves safety, comfort, and prevents severe devaluation.',
    fair: 'Addressing noises and worn components improves drive quality and buyer confidence.',
    good: 'Alignment and minor suspension tuning ensures proper handling and tire wear.',
    veryGood: 'Documenting recent suspension work helps achieve "Excellent" mechanical rating.',
  },
  'mechanical-brakes': {
    poor: 'Brake system repairs are essential for safety and prevent significant devaluation.',
    fair: 'Brake pad replacement and resurfacing rotors improves stopping performance and eliminates noise.',
    good: 'Fresh brake fluid and inspection ensures proper performance and safety rating.',
    veryGood: 'Documenting recent brake service helps achieve maximum mechanical condition rating.',
  },
  'mechanical-electrical': {
    poor: 'Addressing electrical failures prevents diagnostic concerns and significant devaluation.',
    fair: 'Battery replacement and electrical repairs ensure reliable operation and buyer confidence.',
    good: 'Testing electrical systems and replacing weak components prevents future issues.',
    veryGood: 'Ensuring all electrical components function perfectly helps achieve premium valuation.',
  },

  // Tires & wheels items
  'tires-tread': {
    poor: 'New tires ($600-1000) can return 80-100% of their cost in improved vehicle valuation.',
    fair: 'Replacing tires approaching wear limits prevents buyer negotiation and safety concerns.',
    good: 'Tire rotation and proper inflation ensures even wear and maximum remaining tread life.',
    veryGood: 'Professional tire cleaning and dressing enhances appearance and perceived care.',
  },
  'tires-wheels': {
    poor: 'Wheel repair or replacement significantly improves appearance and prevents tire damage.',
    fair: 'Professional wheel repair (typically $100-150 per wheel) can restore appearance and function.',
    good: 'Wheel cleaning and touch-up can improve appearance and perceived vehicle care.',
    veryGood: 'Professional wheel detailing and protection maintains a like-new appearance.',
  },
  'tires-matching': {
    poor: 'Matching tires improves safety, handling, and prevents significant devaluation.',
    fair: 'Having matching tires prevents buyer concerns about alignment and maintenance history.',
    good: 'Ensuring even wear across all tires suggests proper alignment and maintenance.',
    veryGood: 'Documenting tire age, brand, and maintenance history helps achieve premium valuation.',
  },
};
