
// Utility to help identify duplicate code patterns in the codebase
export interface DuplicatePattern {
  type: 'component' | 'function' | 'type' | 'import' | 'similar-logic';
  files: string[];
  description: string;
  severity: 'high' | 'medium' | 'low';
  suggestion?: string;
}

export function detectDuplicates(): DuplicatePattern[] {
  const duplicates: DuplicatePattern[] = [];

  // Component duplicates
  duplicates.push({
    type: 'component',
    files: [
      'src/components/lookup/manual/ManualEntryForm.tsx',
      'src/components/lookup/UnifiedManualEntryForm.tsx'
    ],
    description: 'Similar manual entry form components with overlapping functionality',
    severity: 'high',
    suggestion: 'Consolidate into a single reusable component'
  });

  duplicates.push({
    type: 'component',
    files: [
      'src/components/lookup/UnifiedVinLookup.tsx',
      'src/components/lookup/VinForm.tsx',
      'src/components/lookup/vin/StandardVinLookupForm.tsx'
    ],
    description: 'Multiple VIN lookup components with similar functionality',
    severity: 'high',
    suggestion: 'Create a single unified VIN lookup component'
  });

  duplicates.push({
    type: 'component',
    files: [
      'src/components/lookup/UnifiedPlateLookup.tsx',
      'src/components/lookup/PlateDecoderForm.tsx',
      'src/components/lookup/plate/PlateLookupForm.tsx'
    ],
    description: 'Multiple plate lookup components',
    severity: 'medium',
    suggestion: 'Unify plate lookup functionality'
  });

  // Type duplicates
  duplicates.push({
    type: 'type',
    files: [
      'src/types/follow-up-answers.ts',
      'src/types/accident-details.ts'
    ],
    description: 'AccidentDetails type defined in both files',
    severity: 'medium',
    suggestion: 'Keep only one definition and import where needed'
  });

  // Similar utility functions
  duplicates.push({
    type: 'function',
    files: [
      'src/utils/normalization/normalizeListings.ts',
      'src/utils/normalization/normalizeListing.ts'
    ],
    description: 'Similar listing normalization logic',
    severity: 'medium',
    suggestion: 'Consider merging or clarifying the distinction'
  });

  // Similar hooks
  duplicates.push({
    type: 'function',
    files: [
      'src/hooks/useValuationHistory.ts',
      'src/hooks/useSavedValuations.ts'
    ],
    description: 'Both hooks deal with valuation data management',
    severity: 'medium',
    suggestion: 'Consider if these can be unified or if they serve distinct purposes'
  });

  // Premium components
  duplicates.push({
    type: 'component',
    files: [
      'src/components/premium/PremiumTabs.tsx',
      'src/components/premium/premium-core/PremiumTabs.tsx'
    ],
    description: 'Two PremiumTabs components in different locations',
    severity: 'high',
    suggestion: 'Consolidate into one component and update imports'
  });

  // Layout/UI duplicates
  duplicates.push({
    type: 'component',
    files: [
      'src/components/ui/loading-component.tsx',
      'src/components/ui/loading-button.tsx',
      'src/components/ui/spinner.tsx'
    ],
    description: 'Multiple loading-related components',
    severity: 'low',
    suggestion: 'Consider if all are needed or can be consolidated'
  });

  // Condition selector duplicates
  duplicates.push({
    type: 'component',
    files: [
      'src/components/lookup/ConditionSelectorSegmented.tsx',
      'src/components/common/ConditionSelector.tsx'
    ],
    description: 'Multiple condition selector components',
    severity: 'medium',
    suggestion: 'Unify condition selection UI'
  });

  return duplicates;
}

export function generateDuplicateReport(): string {
  const duplicates = detectDuplicates();
  
  let report = '# Duplicate Code Analysis Report\n\n';
  
  const highSeverity = duplicates.filter(d => d.severity === 'high');
  const mediumSeverity = duplicates.filter(d => d.severity === 'medium');
  const lowSeverity = duplicates.filter(d => d.severity === 'low');

  if (highSeverity.length > 0) {
    report += '## 🔴 High Priority Duplicates\n\n';
    highSeverity.forEach(dup => {
      report += `### ${dup.description}\n`;
      report += `**Type:** ${dup.type}\n`;
      report += `**Files:**\n`;
      dup.files.forEach(file => report += `- ${file}\n`);
      if (dup.suggestion) report += `**Suggestion:** ${dup.suggestion}\n`;
      report += '\n';
    });
  }

  if (mediumSeverity.length > 0) {
    report += '## 🟡 Medium Priority Duplicates\n\n';
    mediumSeverity.forEach(dup => {
      report += `### ${dup.description}\n`;
      report += `**Type:** ${dup.type}\n`;
      report += `**Files:**\n`;
      dup.files.forEach(file => report += `- ${file}\n`);
      if (dup.suggestion) report += `**Suggestion:** ${dup.suggestion}\n`;
      report += '\n';
    });
  }

  if (lowSeverity.length > 0) {
    report += '## 🟢 Low Priority Duplicates\n\n';
    lowSeverity.forEach(dup => {
      report += `### ${dup.description}\n`;
      report += `**Type:** ${dup.type}\n`;
      report += `**Files:**\n`;
      dup.files.forEach(file => report += `- ${file}\n`);
      if (dup.suggestion) report += `**Suggestion:** ${dup.suggestion}\n`;
      report += '\n';
    });
  }

  report += `\n## Summary\n`;
  report += `- **Total duplicates found:** ${duplicates.length}\n`;
  report += `- **High priority:** ${highSeverity.length}\n`;
  report += `- **Medium priority:** ${mediumSeverity.length}\n`;
  report += `- **Low priority:** ${lowSeverity.length}\n`;

  return report;
}
