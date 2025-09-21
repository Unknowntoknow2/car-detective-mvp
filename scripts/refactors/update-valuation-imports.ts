import { Project, SyntaxKind } from "ts-morph";
import path from "path";
import fs from "fs";

const ROOT = process.cwd();
const project = new Project({
  tsConfigFilePath: path.join(ROOT, "tsconfig.json"),
  skipAddingFilesFromTsConfig: true,
});

// Include src + apps so we can rewrite everywhere
const globs = [
  "src/**/*.{ts,tsx,js,jsx}",
  "apps/**/*.{ts,tsx,js,jsx}"
];

globs.forEach((g) => project.addSourceFilesAtPaths(g));

const TARGETS: Record<string,string> = {
  "ValuationResultCard": "@/components/valuation/ValuationResultCard",
  "UnifiedValuationResult": "@/components/valuation/UnifiedValuationResult",
  "EnhancedValuationResult": "@/components/valuation/result/EnhancedValuationResult",
  // Legacy display component should resolve to UnifiedValuationResult
  "ValuationResultsDisplay": "@/components/valuation/UnifiedValuationResult",
  "ValuationResult": "@/components/valuation/valuation-core/ValuationResult",
};

let changed = 0;

for (const sf of project.getSourceFiles()) {
  let fileChanged = false;
  const filePath = sf.getFilePath();
  
  // Skip processing our own canonical files to avoid self-imports
  if (filePath.includes("/components/valuation/")) {
    continue;
  }

  const imports = sf.getImportDeclarations();
  for (const im of imports) {
    const spec = im.getModuleSpecifierValue();
    const named = im.getNamedImports().map(n => n.getName());

    // If import path includes legacy segments or component names, normalize
    const includesLegacy =
      /apps\/ain-valuation-engine|components\/result|_archive|\.backup/i.test(spec) ||
      named.some(n => n in TARGETS);

    if (!includesLegacy) continue;

    // If any target symbol is present, re-point the import
    for (const n of named) {
      if (TARGETS[n]) {
        console.log(`Updating ${filePath}: ${n} from "${spec}" to "${TARGETS[n]}"`);
        im.setModuleSpecifier(TARGETS[n]);
        fileChanged = true;
      }
    }

    // Fallback: if path string itself references legacy result UI, try mapping by filename
    if (!fileChanged) {
      if (/ValuationResultCard/.test(spec) && !spec.includes("@/components/valuation/")) {
        console.log(`Updating ${filePath}: path "${spec}" to "${TARGETS["ValuationResultCard"]}"`);
        im.setModuleSpecifier(TARGETS["ValuationResultCard"]);
        fileChanged = true;
      } else if (/ValuationResultsDisplay/.test(spec)) {
        console.log(`Updating ${filePath}: path "${spec}" to "${TARGETS["ValuationResultsDisplay"]}"`);
        im.setModuleSpecifier(TARGETS["ValuationResultsDisplay"]);
        fileChanged = true;
      } else if (/UnifiedValuationResult/.test(spec) && !spec.includes("@/components/valuation/")) {
        console.log(`Updating ${filePath}: path "${spec}" to "${TARGETS["UnifiedValuationResult"]}"`);
        im.setModuleSpecifier(TARGETS["UnifiedValuationResult"]);
        fileChanged = true;
      }
    }
  }

  if (fileChanged) {
    changed++;
  }
}

if (changed > 0) {
  project.saveSync();
  console.log(`\n✅ Updated imports in ${changed} files`);
} else {
  console.log("✅ No valuation-result imports needed updates.");
}