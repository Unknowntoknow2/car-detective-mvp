#!/usr/bin/env node

/**
 * Console Log Cleanup Script
 * 
 * Removes console.log statements while preserving console.warn and console.error
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

function cleanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Remove console.log statements (but keep warn/error)
  let cleaned = content
    // Remove standalone console.log lines
    .replace(/^\s*console\.log\([^)\]*\);\s*$/gm, '')
    // Remove console.log in expressions but keep the rest
    .replace(/console\.log\([^)\]*\),?\s*/g, '')
    // Remove console.info statements
    .replace(/^\s*console\.info\([^)\]*\);\s*$/gm, '')
    // Remove console.debug statements
    .replace(/^\s*console\.debug\([^)\]*\);\s*$/gm, '')
    // Remove debugger statements
    .replace(/^\s*debugger;\s*$/gm, '')
    // Remove TODO comments about removing before prod
    .replace(/^\s*\/\/ TODO:.*remove.*prod.*$/gmi, '');
  
  // Only write if changes were made
  if (cleaned !== content) {
    fs.writeFileSync(filePath, cleaned);
    console.log(`✅ Cleaned: ${filePath}`);
    return true;
  }
  
  return false;
}

function main() {
  const srcPattern = 'src/**/*.{ts,tsx,js,jsx}';
  const files = glob.sync(srcPattern);
  
  let totalCleaned = 0;
  
  files.forEach(file => {
    if (cleanFile(file)) {
      totalCleaned++;
    }
  });
  
  console.log(`\n🧹 Console cleanup complete: ${totalCleaned} files modified`);
  
  // Verify no console.log remains
  const remaining = [];
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, index) => {
      if (line.match(/console\.log\s*\(/)) {
        remaining.push(`${file}:${index + 1}: ${line.trim()}`);
      }
    });
  });
  
  if (remaining.length > 0) {
    console.warn(`\n⚠️  ${remaining.length} console.log statements still found:`);
    remaining.forEach(item => console.warn(`   ${item}`));
  } else {
    console.log('✅ No console.log statements found');
  }
}

if (require.main === module) {
  main();
}
