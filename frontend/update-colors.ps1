# PowerShell script to update color scheme across all JSX files

$files = Get-ChildItem -Path "src/pages" -Filter "*.jsx" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Replace color classes
    $content = $content -replace 'bg-dark(?!-)', 'bg-light-bg'
    $content = $content -replace 'bg-dark-light', 'bg-white/80'
    $content = $content -replace 'text-gray-400', 'text-dark/70'
    $content = $content -replace 'text-gray-500', 'text-dark/50'
    $content = $content -replace 'border-gray-700', 'border-gray-300'
    $content = $content -replace 'border-gray-800', 'border-primary/20'
    $content = $content -replace 'bg-gray-700', 'bg-gray-200'
    $content = $content -replace 'bg-gray-800', 'bg-gray-200'
    $content = $content -replace 'cyber-button', 'nature-button'
    $content = $content -replace 'cyber-border', 'nature-border'
    $content = $content -replace 'text-white', 'text-dark'
    $content = $content -replace 'hover:text-primary', 'hover:text-primary'
    $content = $content -replace 'bg-black/70', 'bg-dark/70'
    
    Set-Content -Path $file.FullName -Value $content
}

Write-Host "Color scheme updated successfully!"
