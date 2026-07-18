# ============================================================
#  INTERSOFTI - Sync local desde ZIP de Lovable
# ============================================================
#  Uso:
#    1. Descarga el ZIP desde Lovable (Code Editor -> Download codebase)
#    2. Deja el ZIP en tu carpeta Descargas (Downloads)
#    3. Cierra Android Studio
#    4. Ejecuta desde PowerShell:
#         cd "C:\Users\GAMING F15\Desktop"
#         powershell -ExecutionPolicy Bypass -File .\INTERSOFTI\scripts\sync-local.ps1
# ============================================================

$ErrorActionPreference = "Stop"
$Desktop = "C:\Users\GAMING F15\Desktop"
$ProjectDir = Join-Path $Desktop "INTERSOFTI"
$BackupDir = Join-Path $Desktop "_intersofti_backup"
$DownloadsDir = Join-Path $HOME "Downloads"

# Si el script se ejecuta desde INTERSOFTI, Windows puede mantener ese archivo
# abierto e impedir borrar la carpeta. Relanzarlo desde TEMP elimina el bloqueo.
$CurrentScript = $MyInvocation.MyCommand.Path
$TempScript = Join-Path $env:TEMP "intersofti-sync-local.ps1"
if ($CurrentScript -and
    $CurrentScript.StartsWith($ProjectDir, [System.StringComparison]::OrdinalIgnoreCase) -and
    -not $env:INTERSOFTI_SYNC_FROM_TEMP) {
    Copy-Item $CurrentScript $TempScript -Force
    $env:INTERSOFTI_SYNC_FROM_TEMP = "1"
    & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $TempScript
    exit $LASTEXITCODE
}

Write-Host "`n[1/8] Buscando ZIP mas reciente en Descargas..." -ForegroundColor Cyan
$Zip = Get-ChildItem -Path $DownloadsDir -Filter "*intersofti*.zip" -ErrorAction SilentlyContinue |
       Sort-Object LastWriteTime -Descending | Select-Object -First 1
if (-not $Zip) {
    $Zip = Get-ChildItem -Path $DownloadsDir -Filter "*.zip" |
           Sort-Object LastWriteTime -Descending | Select-Object -First 1
}
if (-not $Zip) { throw "No se encontro ningun ZIP en $DownloadsDir" }
Write-Host "    Usando: $($Zip.Name) ($([math]::Round($Zip.Length/1MB,1)) MB)" -ForegroundColor Green

Write-Host "`n[2/8] Respaldando keystore y build.gradle firmado..." -ForegroundColor Cyan
if (Test-Path $BackupDir) { Remove-Item -Recurse -Force $BackupDir }
New-Item -ItemType Directory -Path $BackupDir | Out-Null

$KeystorePath = Join-Path $ProjectDir "intersofti.jks"
$GradlePath = Join-Path $ProjectDir "android\app\build.gradle"
$CapConfigPath = Join-Path $ProjectDir "capacitor.config.ts"

if (Test-Path $KeystorePath)  { Copy-Item $KeystorePath  $BackupDir\ -Force; Write-Host "    OK intersofti.jks" -ForegroundColor Green }
if (Test-Path $GradlePath)    { Copy-Item $GradlePath    $BackupDir\ -Force; Write-Host "    OK build.gradle" -ForegroundColor Green }
if (Test-Path $CapConfigPath) { Copy-Item $CapConfigPath $BackupDir\ -Force; Write-Host "    OK capacitor.config.ts" -ForegroundColor Green }

Write-Host "`n[3/8] Borrando carpeta vieja..." -ForegroundColor Cyan
# Windows no permite borrar una carpeta que sea el directorio actual del propio
# PowerShell. Salimos siempre del proyecto antes de intentar reemplazarlo.
Set-Location $Desktop
if (Test-Path $ProjectDir) {
    try { Remove-Item -Recurse -Force $ProjectDir }
    catch { throw "No se puede borrar $ProjectDir. Motivo: $($_.Exception.Message)" }
}

Write-Host "`n[4/8] Extrayendo ZIP nuevo..." -ForegroundColor Cyan
$TempExtract = Join-Path $Desktop "_intersofti_extract"
if (Test-Path $TempExtract) { Remove-Item -Recurse -Force $TempExtract }
Expand-Archive -Path $Zip.FullName -DestinationPath $TempExtract
# El ZIP suele contener una subcarpeta - detectala
$Inner = Get-ChildItem $TempExtract -Directory | Select-Object -First 1
if ($Inner -and -not (Test-Path (Join-Path $TempExtract "package.json"))) {
    Move-Item $Inner.FullName $ProjectDir
    Remove-Item -Recurse -Force $TempExtract
} else {
    Move-Item $TempExtract $ProjectDir
}
Write-Host "    Codigo extraido en $ProjectDir" -ForegroundColor Green

Write-Host "`n[5/8] Restaurando keystore y config firmada..." -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path (Join-Path $ProjectDir "android\app") | Out-Null
if (Test-Path (Join-Path $BackupDir "intersofti.jks"))     { Copy-Item (Join-Path $BackupDir "intersofti.jks")     $KeystorePath  -Force; Write-Host "    OK intersofti.jks" -ForegroundColor Green }
if (Test-Path (Join-Path $BackupDir "build.gradle"))       { Copy-Item (Join-Path $BackupDir "build.gradle")       $GradlePath    -Force; Write-Host "    OK build.gradle firmado" -ForegroundColor Green }
if (Test-Path (Join-Path $BackupDir "capacitor.config.ts")) { Copy-Item (Join-Path $BackupDir "capacitor.config.ts") $CapConfigPath -Force; Write-Host "    OK capacitor.config.ts" -ForegroundColor Green }

Set-Location $ProjectDir

Write-Host "`n[6/8] npm install..." -ForegroundColor Cyan
npm install
npm install --save-dev @capacitor/assets 2>$null

Write-Host "`n[7/8] Regenerando iconos + build web..." -ForegroundColor Cyan
if (-not (Test-Path (Join-Path $ProjectDir "android"))) {
    Write-Host "    Anadiendo plataforma Android..." -ForegroundColor Yellow
    npx cap add android
}
if (Test-Path (Join-Path $ProjectDir "resources\icon.png")) {
    npx @capacitor/assets generate --android
}
npm run build

Write-Host "`n[8/8] npx cap sync android..." -ForegroundColor Cyan
npx cap sync android

Write-Host "`n==============================================" -ForegroundColor Green
Write-Host " LISTO. Abre Android Studio:" -ForegroundColor Green
Write-Host " File -> Open -> $ProjectDir\android" -ForegroundColor Green
Write-Host " Build -> Rebuild Project -> Run (Play button)" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green
