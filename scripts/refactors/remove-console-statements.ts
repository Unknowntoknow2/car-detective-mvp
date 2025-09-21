import { Project, SyntaxKind, CallExpression } from 'ts-morph';
import fg from 'fast-glob';
import { resolve } from 'path';

const project = new Project({
  tsConfigFilePath: resolve('tsconfig.json'),
});

// Find all TypeScript/JavaScript files in src
const files = fg.sync([
  'src/**/*.{ts,tsx,js,jsx}',
  'apps/**/src/**/*.{ts,tsx,js,jsx}'
], {
  ignore: [
    'node_modules/**',
    'dist/**',
    '**/*.test.*',
    '**/*.spec.*',
    '**/test/**',
    '**/tests/**',
    '**/__tests__/**'
  ]
});

let totalRemovals = 0;

console.log(`🔍 Scanning ${files.length} files for console.log statements...`);

files.forEach(filePath => {
  try {
    const sourceFile = project.addSourceFileAtPath(filePath);
    let fileRemovals = 0;
    
    // Find all console.log, console.warn, console.error, console.info, console.debug calls
    const callExpressions = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
    
    callExpressions.forEach((callExpr: CallExpression) => {
      const expression = callExpr.getExpression();
      
      if (expression.getKind() === SyntaxKind.PropertyAccessExpression) {
        const propAccess = expression.asKindOrThrow(SyntaxKind.PropertyAccessExpression);
        const object = propAccess.getExpression();
        const property = propAccess.getName();
        
        // Check if it's a console method call
        if (object.getText() === 'console' && 
            ['log', 'warn', 'error', 'info', 'debug'].includes(property)) {
          
          // Get the statement containing this console call
          const statement = callExpr.getFirstAncestorByKind(SyntaxKind.ExpressionStatement);
          
          if (statement) {
            // Remove the entire statement
            statement.remove();
            fileRemovals++;
            totalRemovals++;
          }
        }
      }
    });
    
    if (fileRemovals > 0) {
      sourceFile.saveSync();
      console.log(`  ✅ Removed ${fileRemovals} console statements from ${filePath}`);
    }
    
  } catch (error) {
    console.warn(`  ⚠️  Error processing ${filePath}:`, error.message);
  }
});

console.log(`\n🎉 Cleanup complete! Removed ${totalRemovals} console statements from production code.`);
console.log('💡 This ensures clean production builds with no debug artifacts.');