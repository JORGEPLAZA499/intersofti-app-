# Regenera los iconos adaptativos de Android usando el logo oficial INTERSOFTI.
# El foreground tiene el globo centrado al 60% con padding de seguridad para
# evitar que la mascara redonda del launcher Android lo recorte.
# Uso:  cd C:\Users\GAMING F15\Desktop\INTERSOFTI
#       .\scripts\regenerate-android-icons.ps1
$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

Write-Host "[1/5] Verificando assets en resources/..." -ForegroundColor Cyan
$required = @("resources/icon.png", "resources/icon-foreground.png", "resources/icon-background.png")
foreach ($f in $required) {
    if (-not (Test-Path $f)) {
        throw "Falta el asset: $f"
    }
}

Write-Host "[2/5] Instalando dependencias de Capacitor Assets..." -ForegroundColor Cyan
npm install

Write-Host "[3/5] Generando iconos Android con @capacitor/assets..." -ForegroundColor Cyan
npx @capacitor/assets generate --android

Write-Host "[4/5] Sincronizando plataforma Android..." -ForegroundColor Cyan
npx cap sync android

Write-Host "[5/5] Iconos regenerados. Desinstala la app anterior para limpiar caché del launcher:" -ForegroundColor Green
Write-Host "       adb uninstall com.intersofti.esim" -ForegroundColor Yellow
Write-Host "       Luego recompila e instala con tu rebuild habitual." -ForegroundColor Yellow
