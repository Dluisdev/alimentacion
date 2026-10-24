# Script para ejecutar pruebas del proyecto Alimentación
# Ejecuta este archivo haciendo clic derecho → "Ejecutar con PowerShell"

# Agregar Node.js al PATH
$env:PATH += ";C:\Program Files\nodejs"

Write-Host "🧪 Ejecutando pruebas del proyecto Alimentación..." -ForegroundColor Cyan
Write-Host ""

& "C:\Program Files\nodejs\npm.cmd" run test

Write-Host ""
Write-Host "✅ Pruebas completadas" -ForegroundColor Green