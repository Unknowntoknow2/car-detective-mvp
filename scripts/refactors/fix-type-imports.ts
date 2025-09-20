import { Project } from "ts-morph";
import path from "path";

const project = new Project({
  tsConfigFilePath: path.join(process.cwd(), "tsconfig.json"),
  skipAddingFilesFromTsConfig: true,
});

project.addSourceFilesAtPaths(["src/**/*.{ts,tsx}", "apps/**/*.{ts,tsx}"]);

// Correct the wrong imports - these should be from types, not components
const CORRECTIONS: Record<string, string> = {
  // Service layer types should come from types, not components
  "ValuationApiService": "@/services/ValuationApiService",
  "ValuationRequest": "@/types/vehicleData", 
  "AuditLog": "@/types/vehicleData",
  "SourceStatus": "@/types/vehicleData",
  "EnhancedValuationParams": "@/types/vehicleData",
  "FinalValuationResult": "@/types/vehicleData", 
  "ValuationParams": "@/types/vehicleData",
};

// Types that should come from vehicleData.ts  
const TYPE_IMPORTS = [
  "ValuationResult",
  "UnifiedValuationResult", 
  "EnhancedValuationResult",
  "ValuationRequest",
  "AuditLog",
  "SourceStatus",
  "EnhancedValuationParams",
  "FinalValuationResult",
  "ValuationParams"
];

let changed = 0;

for (const sf of project.getSourceFiles()) {
  const filePath = sf.getFilePath();
  let fileChanged = false;

  for (const importDecl of sf.getImportDeclarations()) {
    const moduleSpec = importDecl.getModuleSpecifierValue();
    
    // Fix incorrect component imports - these should be type imports
    if (moduleSpec === "@/components/valuation/valuation-core/ValuationResult") {
      const namedImports = importDecl.getNamedImports();
      
      if (namedImports.length > 0) {
        // Replace with types/vehicleData import
        console.log(`Fixing ${filePath}: moving types from valuation-core to vehicleData`);
        importDecl.setModuleSpecifier("@/types/vehicleData");
        fileChanged = true;
      }
    }
    
    // Fix specific service imports  
    for (const [type, correctPath] of Object.entries(CORRECTIONS)) {
      if (moduleSpec === "@/components/valuation/valuation-core/ValuationResult") {
        const namedImports = importDecl.getNamedImports();
        for (const namedImport of namedImports) {
          if (namedImport.getName() === "ValuationApiService") {
            // This should come from services, not types
            console.log(`Fixing ${filePath}: moving ValuationApiService to services`);
            // Create separate import for service
            sf.addImportDeclaration({
              moduleSpecifier: "@/services/ValuationApiService",
              namedImports: ["ValuationApiService"]
            });
            namedImport.remove();
            fileChanged = true;
          }
        }
      }
    }

    // Fix UnifiedValuationResult component imports in utils (should be type imports)
    if (moduleSpec === "@/components/valuation/UnifiedValuationResult" && 
        (filePath.includes("/utils/") || filePath.includes("/services/"))) {
      console.log(`Fixing ${filePath}: changing UnifiedValuationResult to type import`);
      importDecl.setModuleSpecifier("@/types/vehicleData");
      fileChanged = true;
    }

    // Fix EnhancedValuationResult component imports in utils (should be type imports)  
    if (moduleSpec === "@/components/valuation/result/EnhancedValuationResult" && 
        filePath.includes("/utils/")) {
      console.log(`Fixing ${filePath}: changing EnhancedValuationResult to type import`);
      importDecl.setModuleSpecifier("@/types/vehicleData");
      fileChanged = true;
    }
  }

  if (fileChanged) {
    changed++;
  }
}

if (changed > 0) {
  project.saveSync();
  console.log(`\n✅ Fixed imports in ${changed} files`);
} else {
  console.log("✅ No import corrections needed.");
}