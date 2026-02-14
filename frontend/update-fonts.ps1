# PowerShell script to update fonts across all JSX files

$files = Get-ChildItem -Path "src" -Filter "*.jsx" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Update heading classes to use font-display
    $content = $content -replace 'className="text-4xl font-bold', 'className="text-4xl font-display font-extrabold'
    $content = $content -replace 'className="text-5xl font-bold', 'className="text-5xl font-display font-extrabold'
    $content = $content -replace 'className="text-6xl font-bold', 'className="text-6xl font-display font-extrabold'
    $content = $content -replace 'className="text-3xl font-bold', 'className="text-3xl font-display font-bold'
    $content = $content -replace 'className="text-2xl font-bold', 'className="text-2xl font-display font-bold'
    $content = $content -replace 'className="text-xl font-bold', 'className="text-xl font-display font-bold'
    $content = $content -replace 'className="text-lg font-bold', 'className="text-lg font-display font-bold'
    
    # Update specific patterns
    $content = $content -replace '<h1 className="([^"]*?)font-bold', '<h1 className="$1font-display font-extrabold'
    $content = $content -replace '<h2 className="([^"]*?)font-bold', '<h2 className="$1font-display font-bold'
    $content = $content -replace '<h3 className="([^"]*?)font-bold', '<h3 className="$1font-display font-bold'
    
    Set-Content -Path $file.FullName -Value $content
}

Write-Host "Font updates completed successfully!"
