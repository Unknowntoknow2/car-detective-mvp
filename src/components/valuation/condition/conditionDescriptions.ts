
// Detailed descriptions for each condition rating item at different levels
// These follow industry standards like KBB, NADA, and auction guidelines

// Helper to get the appropriate description based on score
export function getConditionDescription(id: string, score: number): string {
  const conditionLevel = getConditionLevel(score);
  return conditionDescriptions[id]?.[conditionLevel] || defaultDescriptions[conditionLevel];
}

// Map score to condition level
function getConditionLevel(score: number): ConditionLevel {
  if (score <= 20) return 'poor';
  if (score <= 40) return 'fair';
  if (score <= 60) return 'good';
  if (score <= 80) return 'veryGood';
  return 'excellent';
}

type ConditionLevel = 'poor' | 'fair' | 'good' | 'veryGood' | 'excellent';

// Default descriptions if specific item descriptions are not available
const defaultDescriptions: Record<ConditionLevel, string> = {
  poor: 'Significant damage or wear requiring repair. Greatly affects functionality.',
  fair: 'Noticeable wear and tear with some issues that may need attention.',
  good: 'Normal wear for age and miles. Generally functional with minor imperfections.',
  veryGood: 'Better than average condition with minimal wear. Well-maintained.',
  excellent: 'Like-new condition with no significant defects. Exceptionally well-maintained.',
};

// Specific descriptions for each item at each condition level
const conditionDescriptions: Record<string, Record<ConditionLevel, string>> = {
  // Exterior items
  'exterior-paint': {
    poor: 'Major fading, peeling, or damage. Multiple deep scratches or rust spots visible.',
    fair: 'Visible scratches, chips, fading, or minor rust. May need touch-up or buffing.',
    good: 'Generally good appearance with minor scratches or chips. No significant fading.',
    veryGood: 'Shiny finish with very few small scratches. No significant defects or fading.',
    excellent: 'Like-new paint with deep shine. No visible scratches, chips, or imperfections.',
  },
  'exterior-body': {
    poor: 'Multiple dents, dings, or damage requiring body work and panel replacement.',
    fair: 'Several small dents or dings. May have had minor body repairs or filler.',
    good: 'Few minor dings or door dents. No major damage or repairs visible.',
    veryGood: 'Very minor imperfections that do not affect appearance from most angles.',
    excellent: 'No dents, dings, or body damage. Panels align perfectly with proper gaps.',
  },
  'exterior-glass': {
    poor: 'Cracked windshield or windows. Multiple chips or scratches that impair vision.',
    fair: 'Minor chips or scratches that may need repair. No cracks in main viewing area.',
    good: 'Glass is intact with possibly a few tiny chips. No cracks or major scratches.',
    veryGood: 'Clear glass with no noticeable chips or scratches. All windows operate properly.',
    excellent: 'Perfect glass throughout with no chips, scratches, or cloudiness. Like new.',
  },
  'exterior-lights': {
    poor: 'Multiple lights non-functional or cracked. Significant fogging or water intrusion.',
    fair: 'Some fogginess or minor cracks. All lights functional but may need restoration.',
    good: 'Lights clear and functional. Minor hazing may be present but does not affect output.',
    veryGood: 'Clear lenses with no cracks. Minimal to no fogging or discoloration.',
    excellent: 'Crystal clear lenses with no yellowing or fogging. Perfect light output.',
  },
  'exterior-trim': {
    poor: 'Missing pieces, heavy fading, or damaged trim. Chrome pitted or severely degraded.',
    fair: 'Faded, scratched, or minor damage to trim. Chrome showing slight pitting.',
    good: 'Most trim intact with minor fading. Chrome generally good with minor imperfections.',
    veryGood: 'Trim and moldings well-preserved with minimal wear. Chrome bright and clean.',
    excellent: 'All trim pieces perfect with no fading. Chrome bright and flawless.',
  },

  // Interior items
  'interior-seats': {
    poor: 'Torn, heavily worn, or stained upholstery. May have holes, rips, or damage requiring repair.',
    fair: 'Visible wear on surfaces, minor tears, or multiple stains that need cleaning.',
    good: 'Normal wear for age. May have minor stains but no tears or significant damage.',
    veryGood: 'Very clean with minimal wear patterns. No stains, tears, or damage.',
    excellent: 'Like-new condition. No wear patterns, stains, or damage visible.',
  },
  'interior-dash': {
    poor: 'Cracked dashboard, broken controls, or heavy wear. Multiple items not functioning.',
    fair: 'Visible wear on surfaces, some fading, or minor damage. Controls mostly functional.',
    good: 'Normal wear with perhaps minor scratches. All controls function properly.',
    veryGood: 'Well-maintained with minimal wear. No cracks, warping, or fading.',
    excellent: 'Pristine condition with no visible wear. All surfaces and controls perfect.',
  },
  'interior-carpet': {
    poor: 'Heavy staining, wear-through, or damage that needs replacement or major repair.',
    fair: 'Visible staining or moderate wear. May need professional cleaning.',
    good: 'Normal wear for age. Minor stains possible but no major damage or wear-through.',
    veryGood: 'Clean with minimal wear or staining. Well-maintained appearance.',
    excellent: 'Like-new condition with no visible stains, wear, or damage.',
  },
  'interior-headliner': {
    poor: 'Sagging, stained, or torn headliner. May have water damage or be detached in areas.',
    fair: 'Minor sagging or staining. May show early signs of degradation but intact.',
    good: 'Generally good condition with minimal sagging. May have very minor stains.',
    veryGood: 'Clean with no sagging or staining. All trim properly attached and undamaged.',
    excellent: 'Perfect headliner with no blemishes, stains, or signs of wear.',
  },
  'interior-electronics': {
    poor: 'Multiple systems not working. Screen damage, broken switches, or failed electronics.',
    fair: 'Minor issues with some features. Most systems work but may have intermittent problems.',
    good: 'All essential systems work properly. May have minor issues with non-critical features.',
    veryGood: 'All electronics function as designed with no known issues or glitches.',
    excellent: 'All systems perform perfectly. No issues with displays, audio, or controls.',
  },

  // Mechanical items
  'mechanical-engine': {
    poor: 'Rough running, smoking, leaking, or making unusual noises. Needs significant repair.',
    fair: 'Runs but may have minor issues. Some leaks or unusual noises that need attention.',
    good: 'Starts and runs properly. No major leaks, smoke, or unusual noises.',
    veryGood: 'Strong performance with no leaks or issues. Regular maintenance fully up to date.',
    excellent: 'Perfect running condition. No leaks, noises, or issues. Recent service documented.',
  },
  'mechanical-transmission': {
    poor: 'Slipping, hard shifting, grinding, or delayed engagement. Leaks or noises present.',
    fair: 'Shifts with occasional hesitation or firmness. May have minor leaks or noises.',
    good: 'Shifts properly under most conditions. No significant leaks or unusual noises.',
    veryGood: 'Smooth shifting in all gears. No leaks, hesitation, or abnormal behavior.',
    excellent: 'Perfect shifting performance. No leaks, noises, or issues whatsoever.',
  },
  'mechanical-suspension': {
    poor: 'Excessive bouncing, bottoming out, or unusual noises. Major component failure.',
    fair: 'Some squeaks or looseness. May have worn bushings or minor component wear.',
    good: 'Generally good ride quality. No major noises or handling issues.',
    veryGood: 'Responsive handling with no unusual noises. All components in good condition.',
    excellent: 'Perfect ride and handling. All components appear new or recently serviced.',
  },
  'mechanical-brakes': {
    poor: 'Significant grinding, pulsating, or reduced stopping power. Needs immediate repair.',
    fair: 'Brakes functioning but showing wear. May have minor noise or slight pulsation.',
    good: 'Brakes stop properly with no significant noise or vibration. Normal wear for miles.',
    veryGood: 'Strong braking with no noise or issues. Pads and components show minimal wear.',
    excellent: 'Like-new braking performance. Recent service documented or visible.',
  },
  'mechanical-electrical': {
    poor: 'Multiple electrical failures. Battery, alternator, or major systems not working.',
    fair: 'Some electrical issues present. Battery may show weakness or charging issues.',
    good: 'All essential electrical systems working. No warning lights or major issues.',
    veryGood: 'All electrical components function properly. Battery tests good, no issues.',
    excellent: 'Perfect electrical system operation. New or like-new battery condition.',
  },

  // Tires & wheels items
  'tires-tread': {
    poor: 'Very low tread (2/32" or less). Unsafe or illegal tread depth on multiple tires.',
    fair: 'Low but legal tread depth (3-4/32"). Will need replacement soon.',
    good: 'Adequate tread depth (5-6/32"). Wear is even with significant life remaining.',
    veryGood: 'Good tread depth (7-8/32"). Significant tire life remaining with even wear.',
    excellent: 'Nearly new tread depth (9/32" or more). Minimal to no signs of wear.',
  },
  'tires-wheels': {
    poor: 'Severely damaged, bent, or corroded wheels. Multiple wheels need replacement.',
    fair: 'Noticeable curb rash, scratches, or minor damage. Wheels structurally sound.',
    good: 'Generally good condition with minor cosmetic blemishes. No structural issues.',
    veryGood: 'Very minor blemishes if any. Wheels are straight with no significant damage.',
    excellent: 'Perfect or near-perfect condition. No visible damage, scratches, or corrosion.',
  },
  'tires-matching': {
    poor: 'Mismatched brands, sizes, or types. Significant wear differences between tires.',
    fair: 'Same size but may be different brands or models. Wear patterns somewhat uneven.',
    good: 'Matching size and similar brands/models. Wear patterns reasonably consistent.',
    veryGood: 'Matching brand and model on all corners. Very consistent wear patterns.',
    excellent: 'Perfectly matched set with identical wear and appearance. Same age and brand.',
  },
};
