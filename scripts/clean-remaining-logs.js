#!/usr/bin/env node

const fs = require('fs');

// List of files with console.log that need to be cleaned
const filesToClean = [
  'src/components/followup/TabbedFollowUpForm.tsx',
  'src/components/followup/inputs/ConditionSelector.tsx',
  'src/components/followup/tabs/ConditionTab.tsx',
  'src/components/lookup/form-parts/EnhancedVehicleSelector.tsx',
  'src/components/premium/BuyCreditsModal.tsx',
  'src/components/premium/VehicleDataInfo.tsx',
  'src/components/premium/form/PremiumValuationForm.tsx',
  'src/components/premium/form/steps/AccidentHistoryStep.tsx',
  'src/components/premium/form/steps/MaintenanceHistoryStep.tsx',
  'src/components/premium/lookup/plate/EnhancedPlateForm.tsx',
  'src/components/premium/sections/valuation-tabs/CarfaxReportTab.tsx',
  'src/components/premium/sections/valuation-tabs/TabContent.tsx',
  'src/components/professional/ProfessionalResultsPage.tsx',
  'src/components/result/useValuationId.ts',
  'src/components/ui/UpgradeCTA.tsx',
  'src/components/ui/combobox.tsx',
  'src/components/valuation/RerunValuationButton.tsx',
  'src/components/valuation/UnifiedValuationResult.tsx',
  'src/components/valuation/market-trend/hooks/useForecastData.ts',
  'src/components/valuation/premium/EmailReportSection.tsx',
  'src/components/valuation/premium/PDFDownloadSection.tsx',
  'src/contexts/ValuationContext.tsx',
];

function cleanFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Replace all console.log with logger.log
  content = content.replace(/console\.log\s*\(/g, 'logger.log(');
  
  // Replace all console.info with logger.log
  content = content.replace(/console\.info\s*\(/g, 'logger.log(');
  
  // Remove debugger statements
  content = content.replace(/^\s*debugger;\s*$/gm, '');
  
  // Add logger import if logger.log is used but import doesn't exist
  if (content.includes('logger.log(') && !content.includes("from '@/lib/logger'")) {
    // Find the last import statement
    const lines = content.split('\n');
    let lastImportIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ')) {
        lastImportIndex = i;
      }
    }
    
    if (lastImportIndex >= 0) {
      lines.splice(lastImportIndex + 1, 0, "import { logger } from '@/lib/logger';");
      content = lines.join('\n');
    }
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Cleaned: ${filePath}`);
    return true;
  } else {
    console.log(`ℹ️  No changes needed: ${filePath}`);
    return false;
  }
}

console.log('🧹 Cleaning remaining console.log statements...');

let cleanedCount = 0;
for (const file of filesToClean) {
  try {
    if (cleanFile(file)) {
      cleanedCount++;
    }
  } catch (error) {
    console.error(`❌ Error cleaning ${file}:`, error.message);
  }
}

console.log(`\n🎉 Cleanup complete! Cleaned ${cleanedCount} files.`);
console.log('\n📋 Run verification commands:');
console.log('git grep -n "console\.log(" -- "src" && echo "FOUND" || echo "OK"');
console.log('git grep -n "import\.meta\.env\.VITE_" -- "src" && echo "FOUND" || echo "OK"');
console.log('git grep -n "localhost:" -- "src" && echo "FOUND" || echo "OK"');