# Script para iniciar el servidor del proyecto Alimentación
# Ejecuta este archivo haciendo clic derecho → "Ejecutar con PowerShell"

# Agregar Node.js al PATH
$env:PATH += ";C:\Program Files\nodejs"

Write-Host "🚀 Iniciando servidor Alimentación..." -ForegroundColor Cyan
Write-Host ""

& "C:\Program Files\nodejs\npm.cmd" run dev