#!/bin/bash

# Script to find all frontend/UI files in a TypeScript/React/Node project
# Run from project root

echo "🔍 Searching for all frontend/UI related files..."
echo "================================================="

# Create temporary files to store results
TEMP_DIR=$(mktemp -d)
TEMP_FILES="$TEMP_DIR/all_files.txt"

# 1. Find all files in typical frontend/UI directories
echo "📁 Finding files in frontend/UI directories..."
find src/ apps/ -type d \( -name "components" -o -name "ui" -o -name "pages" -o -name "views" \) -exec find {} -type f \; 2>/dev/null >> "$TEMP_FILES"

# 2. Find all files with "UI", "View", or "Page" in their filename (case-insensitive)
echo "📄 Finding files with UI/View/Page in filename..."
find src/ apps/ -type f | grep -Ei '(ui|view|page)' >> "$TEMP_FILES"

# 3. Find all files that import React (most likely frontend)
echo "⚛️  Finding files that import React..."
grep -ril "import React" src/ apps/ 2>/dev/null >> "$TEMP_FILES"

# 4. Find all files that import from "@/components" or "@/ui" (if using alias)
echo "🔗 Finding files with component/ui imports..."
grep -ril 'from .\?/components' src/ apps/ 2>/dev/null >> "$TEMP_FILES"
grep -ril 'from .\?/ui' src/ apps/ 2>/dev/null >> "$TEMP_FILES"

# 5. Find all files containing JSX/TSX syntax (angle brackets, basic heuristic)
echo "🏷️  Finding files with JSX/TSX syntax..."
grep -ril --include="*.tsx" --include="*.jsx" '<[A-Za-z]' src/ apps/ 2>/dev/null >> "$TEMP_FILES"

# 6. Find all .tsx and .jsx files (almost always frontend)
echo "📋 Finding all .tsx and .jsx files..."
find src/ apps/ -type f \( -name "*.tsx" -o -name "*.jsx" \) 2>/dev/null >> "$TEMP_FILES"

# 7. Find all files importing frontend libraries (shadcn, radix, MUI, etc)
echo "📦 Finding files importing frontend libraries..."
grep -rilE "from ['\"](@shadcn|@radix|@mui|antd|chakra|react-bootstrap|lucide-react|sonner|react-router-dom)" src/ apps/ 2>/dev/null >> "$TEMP_FILES"

# 8. Find files referencing common UI components
echo "🧩 Finding files referencing UI components..."
grep -rilE 'Button|Input|Card|Modal|Dialog|Select|Tabs|Dropdown' src/ apps/ 2>/dev/null >> "$TEMP_FILES"

# 9. Find CSS/Style files
echo "🎨 Finding CSS and style files..."
find src/ apps/ -type f \( -name "*.css" -o -name "*.scss" -o -name "*.sass" -o -name "*.less" \) 2>/dev/null >> "$TEMP_FILES"

# 10. Find files with "style" or "theme" in name
echo "🎭 Finding style and theme files..."
find src/ apps/ -type f | grep -Ei '(style|theme)' 2>/dev/null >> "$TEMP_FILES"

# Sort, deduplicate, and count
echo ""
echo "🧹 Processing results..."
FINAL_LIST="$TEMP_DIR/frontend_files_final.txt"
sort "$TEMP_FILES" | uniq > "$FINAL_LIST"

# Count and display results
TOTAL_COUNT=$(wc -l < "$FINAL_LIST")
echo ""
echo "📊 SUMMARY"
echo "=========="
echo "Total unique frontend/UI files found: $TOTAL_COUNT"
echo ""

# Display categorized results
echo "📂 CATEGORIZED RESULTS:"
echo "-----------------------"

echo ""
echo "🏗️  PAGES ($(grep -c '/pages/' "$FINAL_LIST")):"
grep '/pages/' "$FINAL_LIST" | head -10
if [ $(grep -c '/pages/' "$FINAL_LIST") -gt 10 ]; then
    echo "   ... and $(($(grep -c '/pages/' "$FINAL_LIST") - 10)) more page files"
fi

echo ""
echo "🧩 COMPONENTS ($(grep -c '/components/' "$FINAL_LIST")):"
grep '/components/' "$FINAL_LIST" | head -10
if [ $(grep -c '/components/' "$FINAL_LIST") -gt 10 ]; then
    echo "   ... and $(($(grep -c '/components/' "$FINAL_LIST") - 10)) more component files"
fi

echo ""
echo "🎨 UI LIBRARY ($(grep -c '/ui/' "$FINAL_LIST")):"
grep '/ui/' "$FINAL_LIST" | head -10
if [ $(grep -c '/ui/' "$FINAL_LIST") -gt 10 ]; then
    echo "   ... and $(($(grep -c '/ui/' "$FINAL_LIST") - 10)) more UI files"
fi

echo ""
echo "🎭 STYLES ($(grep -Ec '\.(css|scss|sass|less)$' "$FINAL_LIST")):"
grep -E '\.(css|scss|sass|less)$' "$FINAL_LIST"

echo ""
echo "📋 FILE TYPES BREAKDOWN:"
echo "------------------------"
echo "TypeScript React (.tsx): $(grep -c '\.tsx$' "$FINAL_LIST")"
echo "JavaScript React (.jsx): $(grep -c '\.jsx$' "$FINAL_LIST")"
echo "TypeScript (.ts):        $(grep -c '\.ts$' "$FINAL_LIST")"
echo "JavaScript (.js):        $(grep -c '\.js$' "$FINAL_LIST")"
echo "CSS files:               $(grep -c '\.css$' "$FINAL_LIST")"
echo "SCSS files:              $(grep -c '\.scss$' "$FINAL_LIST")"
echo "Other files:             $(echo "$TOTAL_COUNT - $(grep -cE '\.(tsx|jsx|ts|js|css|scss)$' "$FINAL_LIST")" | bc)"

echo ""
echo "📄 COMPLETE LIST saved to: $FINAL_LIST"
echo ""
echo "💡 USAGE EXAMPLES:"
echo "------------------"
echo "View complete list: cat $FINAL_LIST"
echo "Copy to clipboard:  cat $FINAL_LIST | xclip -selection clipboard"
echo "Count by directory: cat $FINAL_LIST | cut -d'/' -f1-3 | sort | uniq -c"

# Save final list to project root for easy access
cp "$FINAL_LIST" "./frontend-files-list.txt"
echo "📁 List also copied to: ./frontend-files-list.txt"

# Clean up
# rm -rf "$TEMP_DIR"

echo ""
echo "✅ Frontend file search complete!"