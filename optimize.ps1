Write-Host "🚀 LANCEMENT DE L'OPTIMISATION RUST..." -ForegroundColor Green

# 1. OPTIMISATION HTML (supprime les espaces et commentaires)
Get-ChildItem -Recurse -Filter *.html | ForEach-Object {
    minify-html --output $_.FullName $_.FullName
    Write-Host "✅ HTML optimisé :" $_.Name
}

# 2. OPTIMISATION CSS (si tu as un fichier css/style.css)
if (Test-Path "css/style.css") {
    # minify-html fait aussi le CSS, mais on le fait directement
    minify-html --output css/style.css css/style.css
    Write-Host "✅ CSS optimisé"
}

# 3. OPTIMISATION JAVASCRIPT (réduction de 40% du poids)
Get-ChildItem -Recurse -Filter *.js -Exclude *.min.js | ForEach-Object {
    minify-js -o $_.FullName $_.FullName
    Write-Host "✅ JS optimisé :" $_.Name
}

# 4. OPTIMISATION DES IMAGES PNG (réduction de 30% sans perte)
Get-ChildItem -Recurse -Filter *.png | ForEach-Object {
    oxipng -o 4 --strip all $_.FullName
    Write-Host "✅ PNG optimisé :" $_.Name
}

# 5. CONVERSION DES JPG EN WEBP (gain de poids ÉNORME)
Get-ChildItem -Recurse -Filter *.jpg,*.jpeg | ForEach-Object {
    $output = $_.FullName -replace '\.jpe?g$', '.webp'
    webp -q 80 $_.FullName -o $output
    Write-Host "✅ JPG converti en WEBP :" $_.Name
}

Write-Host "🎉 OPTIMISATION TERMINEE !." -ForegroundColor Green