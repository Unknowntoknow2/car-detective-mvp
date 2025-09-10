#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Function to find all TypeScript/JavaScript files in src
function findSourceFiles() {
  return glob.sync('src/**/*.{ts,tsx,js,jsx}', { 
    ignore: ['src/**/*.d.ts', 'src/**/*.test.*', 'src/**/*.spec.*']
  });
}

// Function to clean console.log statements from a file
function cleanFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Track if logger import is needed
  let needsLoggerImport = false;
  
  // Replace console.log with logger.log
  content = content.replace(/console\.log\s*\(/g, (match) => {
    needsLoggerImport = true;
    return 'logger.log(';
  });
  
  // Replace console.info with logger.log  
  content = content.replace(/console\.info\s*\(/g, (match) => {
    needsLoggerImport = true;
    return 'logger.log(';
  });
  
  // Remove debugger statements
  content = content.replace(/^\s*debugger;\s*$/gm, '');
  
  // Add logger import if needed and not already present
  if (needsLoggerImport && !content.includes("from '@/lib/logger'")) {
    // Find the last import statement
    const importLines = content.split('\n');
    let lastImportIndex = -1;
    
    for (let i = 0; i < importLines.length; i++) {
      if (importLines[i].trim().startsWith('import ')) {
        lastImportIndex = i;
      }
    }
    
    if (lastImportIndex >= 0) {
      importLines.splice(lastImportIndex + 1, 0, "import { logger } from '@/lib/logger';");
      content = importLines.join('\n');
    }
  }
  
  // Only write if content changed
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Cleaned: ${filePath}`);
    return true;
  }
  
  return false;
}

// Main execution
function main() {
  console.log('🧹 Starting mass console.log cleanup...');
  
  const sourceFiles = findSourceFiles();
  let cleanedCount = 0;
  
  for (const file of sourceFiles) {
    try {
      if (cleanFile(file)) {
        cleanedCount++;
      }
    } catch (error) {
      console.error(`❌ Error cleaning ${file}:`, error.message);
    }
  }
  
  console.log(`\n🎉 Cleanup complete! Cleaned ${cleanedCount} files.`);
  console.log('📋 Run verification: npm run verify:production');
}

// Check if glob is available
try {
  require('glob');
  main();
} catch (error) {
  console.log('Installing glob dependency...');
  require('child_process').execSync('npm install glob --save-dev', { stdio: 'inherit' });
  main();
}