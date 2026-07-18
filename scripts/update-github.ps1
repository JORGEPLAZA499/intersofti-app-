# ============================================================
# update-github.ps1
# Sincroniza el ZIP más reciente de Lovable (Descargas) con
# la carpeta local INTERSOFTI y sube todo al repo de GitHub.
#
# Uso:
#   .\scripts\update-github.ps1
#   .\scripts\update-github.ps1 -RepoUrl "https://github.com/JORGEPLAZA499/intersofti-app-.git"
#
# Requisitos:
#   - ZIP descargado desde Lovable en la carpeta Descargas
#   - git instalado y autenticado con GitHub
# ============================================================

param(
    [string]$RepoUrl = "https://github.com/JORGEPLAZA499/intersofti-app-.git",
    [string]$ProjectPath = "$env:USERPROFILE\Desktop\INTERSOFTI",
    [string]$DownloadsPath = "$env:USERPROFILE\Downloads"
)

$ErrorActionPreference = "Stop"

function Log($msg, $color = "Cyan") {
    Write-Host ""
    Write-Host ">>> $msg" -ForegroundColor $color
}

# ------------------------------------------------------------
# 1. Localizar el ZIP más reciente en Descargas
# ------------------------------------------------------------
Log "Buscando ZIP más reciente en Descargas..."
$zip = Get-ChildItem -Path $DownloadsPath -Filter "*.zip" |
       Where-Object { $_.Name -match "INTERSOFTI|lovable|project" } |
       Sort-Object LastWriteTime -Descending |
       Select-Object -First 1

if (-not $zip) {
    $zip = Get-ChildItem -Path $DownloadsPath -Filter "*.zip" |
           Sort-Object LastWriteTime -Descending |
           Select-Object -First 1
}

if (-not $zip) {
    Write-Host "ERROR: No se encontró ningún ZIP en $DownloadsPath" -ForegroundColor Red
    exit 1
}
Write-Host "ZIP encontrado: $($zip.FullName)" -ForegroundColor Green

# ------------------------------------------------------------
# 2. Backup del keystore y archivos sensibles
# ------------------------------------------------------------
Log "Haciendo backup del keystore (.jks) y firmas locales..."
$backupDir = "$env:USERPROFILE\Desktop\INTERSOFTI_BACKUP"
if (Test-Path $backupDir) { Remove-Item $backupDir -Recurse -Force }
New-Item -ItemType Directory -Path $backupDir | Out-Null

$patterns = @("*.jks", "*.keystore", "keystore.properties", "local.properties", ".env.local")
foreach ($p in $patterns) {
    if (Test-Path $ProjectPath) {
        Get-ChildItem -Path $ProjectPath -Recurse -Filter $p -ErrorAction SilentlyContinue | ForEach-Object {
            $rel = $_.FullName.Substring($ProjectPath.Length).TrimStart("\")
            $dest = Join-Path $backupDir $rel
            New-Item -ItemType Directory -Path (Split-Path $dest) -Force | Out-Null
            Copy-Item $_.FullName $dest -Force
            Write-Host "  backup: $rel" -ForegroundColor DarkGray
        }
    }
}

# ------------------------------------------------------------
# 3. Extraer ZIP a temporal y localizar la raíz real
# ------------------------------------------------------------
Log "Extrayendo ZIP a temporal..."
$tempDir = "$env:TEMP\intersofti_extract_$(Get-Random)"
New-Item -ItemType Directory -Path $tempDir | Out-Null
Expand-Archive -Path $zip.FullName -DestinationPath $tempDir -Force

$root = Get-ChildItem -Path $tempDir -Recurse -Filter "package.json" |
        Where-Object { $_.FullName -notmatch "node_modules" } |
        Select-Object -First 1
if (-not $root) {
    Write-Host "ERROR: No se encontró package.json en el ZIP" -ForegroundColor Red
    exit 1
}
$sourceRoot = Split-Path $root.FullName
Write-Host "Raíz del proyecto: $sourceRoot" -ForegroundColor Green

# ------------------------------------------------------------
# 4. Reemplazar contenido de INTERSOFTI
# ------------------------------------------------------------
Log "Reemplazando contenido en $ProjectPath..."
if (Test-Path $ProjectPath) {
    Get-ChildItem -Path $ProjectPath -Force | Where-Object { $_.Name -ne ".git" } | Remove-Item -Recurse -Force
} else {
    New-Item -ItemType Directory -Path $ProjectPath | Out-Null
}
robocopy $sourceRoot $ProjectPath /E /NFL /NDL /NJH /NJS /NC /NS | Out-Null

# ------------------------------------------------------------
# 5. Restaurar firmas
# ------------------------------------------------------------
Log "Restaurando keystore y firmas..."
if (Test-Path $backupDir) {
    robocopy $backupDir $ProjectPath /E /NFL /NDL /NJH /NJS /NC /NS | Out-Null
}

# ------------------------------------------------------------
# 6. Push a GitHub (historial limpio)
# ------------------------------------------------------------
Log "Publicando en GitHub: $RepoUrl"
Set-Location $ProjectPath

if (Test-Path ".git") { Remove-Item ".git" -Recurse -Force }

# .gitignore mínimo para evitar archivos pesados
$gitignore = @"
node_modules/
dist/
build/
android/app/build/
android/build/
android/.gradle/
*.aab
*.apk
*.jks
*.keystore
keystore.properties
local.properties
.env.local
.env
*.log
.DS_Store
"@
Set-Content -Path ".gitignore" -Value $gitignore -Encoding UTF8

git init | Out-Null
git branch -M main
git add .
git -c user.email="lovable@intersofti.com" -c user.name="JORGEPLAZA499" commit -m "Full project snapshot" | Out-Null
git remote add origin $RepoUrl
git push --force origin main

Log "LISTO ✅  Repositorio actualizado en GitHub" "Green"
Write-Host "URL: $RepoUrl" -ForegroundColor Green
