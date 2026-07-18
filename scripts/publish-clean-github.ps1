# ============================================================
# INTERSOFTI - Publicar snapshot limpio en un repositorio GitHub
# ============================================================
# Crea un historial Git NUEVO desde el codigo actual.
# No modifica el proyecto original ni las firmas Android.
#
# Uso:
#   powershell -NoProfile -ExecutionPolicy Bypass -File `
#     .\scripts\publish-clean-github.ps1 `
#     -RepoUrl "https://github.com/USUARIO/REPOSITORIO.git"
# ============================================================

param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern('^https://github\.com/[^/]+/[^/]+(?:\.git)?$')]
    [string]$RepoUrl,

    [string]$SourceDir = (Split-Path $PSScriptRoot -Parent)
)

$ErrorActionPreference = "Stop"
$SourceDir = (Resolve-Path $SourceDir).Path
$WorkDir = Join-Path $env:TEMP ("intersofti-github-clean-" + [guid]::NewGuid().ToString("N"))
$LocationChanged = $false

function Invoke-Git {
    param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Arguments)
    & git @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "Git fallo: git $($Arguments -join ' ')"
    }
}

try {
    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
        throw "Git no esta instalado o no esta disponible en PATH. Instala Git for Windows y vuelve a ejecutar."
    }

    Write-Host "`n[1/7] Preparando copia temporal segura..." -ForegroundColor Cyan
    New-Item -ItemType Directory -Path $WorkDir | Out-Null

    $ExcludedDirectories = @('.git', 'node_modules', 'dist', 'android', '.idea', '.vscode')
    $ExcludedFiles = @('*.jks', '*.keystore', '*.p12', 'key.properties', 'local.properties', '.env', '.env.*')
    $RoboArgs = @($SourceDir, $WorkDir, '/E', '/NFL', '/NDL', '/NJH', '/NJS', '/NP', '/R:1', '/W:1', '/XD') +
                $ExcludedDirectories + @('/XF') + $ExcludedFiles
    & robocopy @RoboArgs | Out-Null
    if ($LASTEXITCODE -gt 7) {
        throw "No se pudo crear la copia temporal (robocopy code $LASTEXITCODE)."
    }

    Write-Host "[2/7] Comprobando que no existan archivos mayores de 95 MB..." -ForegroundColor Cyan
    $LargeFiles = Get-ChildItem -Path $WorkDir -Recurse -File |
        Where-Object { $_.Length -gt 95MB } |
        Select-Object FullName, Length
    if ($LargeFiles) {
        $Details = ($LargeFiles | ForEach-Object {
            "  - $($_.FullName.Replace($WorkDir, '.')) ($([math]::Round($_.Length / 1MB, 1)) MB)"
        }) -join "`n"
        throw "Se encontraron archivos demasiado grandes:`n$Details`nNo se publico nada."
    }

    Write-Host "[3/7] Creando historial Git limpio..." -ForegroundColor Cyan
    Push-Location $WorkDir
    $LocationChanged = $true
    Invoke-Git init -b main

    $GitName = (& git config --global user.name 2>$null)
    $GitEmail = (& git config --global user.email 2>$null)
    if (-not $GitName) { Invoke-Git config user.name "INTERSOFTI" }
    if (-not $GitEmail) { Invoke-Git config user.email "JORGEPLAZA499@users.noreply.github.com" }

    Write-Host "[4/7] Preparando archivos (sin claves ni configuracion local)..." -ForegroundColor Cyan
    Invoke-Git add --all

    $ForbiddenTracked = (& git ls-files) | Where-Object {
        $_ -match '(^|/)(\.env(?:\..*)?|key\.properties|local\.properties)$' -or
        $_ -match '\.(jks|keystore|p12)$'
    }
    if ($ForbiddenTracked) {
        throw "Proteccion activada: hay archivos sensibles preparados para publicar: $($ForbiddenTracked -join ', ')"
    }

    Write-Host "[5/7] Creando primer commit..." -ForegroundColor Cyan
    Invoke-Git commit -m "Initial clean snapshot"

    Write-Host "[6/7] Conectando con GitHub..." -ForegroundColor Cyan
    Invoke-Git remote add origin $RepoUrl

    Write-Host "[7/7] Subiendo a GitHub..." -ForegroundColor Cyan
    & git push -u origin main
    if ($LASTEXITCODE -ne 0) {
        throw "GitHub rechazo el push. Confirma que el repositorio este vacio y que hayas iniciado sesion con Git Credential Manager. No se ha forzado ni sobrescrito ningun repositorio."
    }

    Write-Host "`nLISTO: snapshot limpio publicado en $RepoUrl" -ForegroundColor Green
    Write-Host "Los MP4 pesados, .env y firmas Android no fueron incluidos." -ForegroundColor Green
}
finally {
    if ($LocationChanged) { Pop-Location -ErrorAction SilentlyContinue }
    if (Test-Path $WorkDir) {
        Remove-Item -Path $WorkDir -Recurse -Force -ErrorAction SilentlyContinue
    }
}