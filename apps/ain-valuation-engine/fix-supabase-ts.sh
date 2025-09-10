#!/bin/bash

# Find all Supabase function index.ts files
FUNCTION_FILES=$(find /workspaces/ain-valuation-engine/supabase/functions -name "index.ts" -type f)

for file in $FUNCTION_FILES; do
    echo "Fixing TypeScript issues in: $file"
    
    # Add @ts-ignore comments for common Deno imports
    sed -i 's|^import { serve } from "https://deno.land/std@|// @ts-ignore - Deno remote imports\n&|' "$file"
    sed -i 's|^import { createClient } from "https://esm.sh/@supabase/supabase-js@|// @ts-ignore - Deno remote imports\n&|' "$file"
    
    # Fix serve function parameter typing
    sed -i 's|serve(async (req)|serve(async (req: Request)|g' "$file"
    sed -i 's|serve((req)|serve((req: Request)|g' "$file"
    
done

echo "TypeScript fixes applied to all Supabase functions!"
