import path from 'path';
import fg from 'fast-glob';
import { Project, SyntaxKind } from 'ts-morph';

const repo = process.cwd();
const project = new Project({ tsConfigFilePath: path.join(repo, 'tsconfig.json') });

// Only browser code
const files = fg.sync(['src/**/*.{ts,tsx}','!src/scripts/**'], { dot:false });
project.addSourceFilesAtPaths(files);

let changed = 0;

for (const sf of project.getSourceFiles()) {
  let fileChanged = false;

  // 1) process.env.* => import.meta.env.*
  sf.forEachDescendant(node => {
    if (node.getKind() === SyntaxKind.PropertyAccessExpression) {
      const pae = node.asKind(SyntaxKind.PropertyAccessExpression)!;
      const txt = pae.getText();
      if (txt.startsWith('process.env.')) {
        pae.replaceWithText(txt.replace(/^process\.env\./, 'import.meta.env.'));
        fileChanged = true;
      }
    }
  });

  // 2) NodeJS.Timeout => ReturnType<typeof setTimeout>
  const originalText = sf.getFullText();
  const newText = originalText.replace(/\bNodeJS\.Timeout\b/g, 'ReturnType<typeof setTimeout>');
  if (originalText !== newText) {
    sf.replaceWithText(newText);
    fileChanged = true;
  }

  // 3) If "React." identifier appears but no import, add "import * as React from 'react'"
  const usesReactNs = /\bReact\./.test(sf.getFullText());
  const hasReactImport = sf.getImportDeclarations().some(d => d.getModuleSpecifierValue() === 'react');
  if (usesReactNs && !hasReactImport) {
    sf.insertStatements(0, `import * as React from 'react';`);
    fileChanged = true;
  }

  if (fileChanged) changed++;
}

project.saveSync();
console.log(`Changed ${changed} file(s).`);