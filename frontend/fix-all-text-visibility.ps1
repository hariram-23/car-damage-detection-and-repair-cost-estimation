# PowerShell script to fix ALL text visibility issues

$files = Get-ChildItem -Path "src" -Filter "*.jsx" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Replace light/invisible text colors with dark visible ones
    $content = $content -replace "text-dark/70", "text-gray-700"
    $content = $content -replace "text-dark/60", "text-gray-600"
    $content = $content -replace "text-dark/50", "text-gray-500"
    $content = $content -replace 'text-dark"', 'text-gray-900"'
    $content = $content -replace "text-dark ", "text-gray-900 "
    $content = $content -replace "text-dark}", "text-gray-900}"
    
    # Fix primary color references to use darker green
    $content = $content -replace "#A5C89E", "#16A34A"
    $content = $content -replace "#D8E983", "#84CC16"
    $content = $content -replace "#FFFBB1", "#FDE047"
    $content = $content -replace "#AEB877", "#65A30D"
    $content = $content -replace "#2C3E2E", "#1F2937"
    
    # Ensure all style color properties use dark colors
    $content = $content -replace "color: '#6B7280'", "color: '#374151'"
    $content = $content -replace "color: '#1F2937'", "color: '#111827'"
    
    Set-Content -Path $file.FullName -Value $content
}

Write-Host "All text visibility issues fixed!"
