# ============================================================
# bump-version.ps1
# Incrementa la version patch en package.json y android/app/build.gradle
# Uso: .\scripts\bump-version.ps1 [-ProjectPath "C:\Users\...\INTERSOFTI"]
# ============================================================

param(
    [string]$ProjectPath = "."
)

$ErrorActionPreference = "Stop"
Push-Location $ProjectPath

try {
    $pkgPath = "package.json"
    $gradlePath = "android/app/build.gradle"

    if (-not (Test-Path $pkgPath)) { throw "No se encontro $pkgPath" }
    if (-not (Test-Path $gradlePath)) { throw "No se encontro $gradlePath. Ejecuta 'npx cap add android' primero." }

    # Leer version actual de package.json
    $pkg = Get-Content $pkgPath -Raw
    $match = [regex]::Match($pkg, '"version":\s*"(\d+)\.(\d+)\.(\d+)"')
    if (-not $match.Success) { throw "No se pudo parsear la version de package.json" }

    $major = [int]$match.Groups[1].Value
    $minor = [int]$match.Groups[2].Value
    $patch = [int]$match.Groups[3].Value + 1
    $newVersion = "$major.$minor.$patch"

    # Actualizar package.json
    $pkg = $pkg -replace '"version":\s*"\d+\.\d+\.\d+"', "`"version`": `"$newVersion`""
    $pkg | Set-Content $pkgPath -NoNewline

    # Actualizar build.gradle
    $gradle = Get-Content $gradlePath -Raw
    $gradle = $gradle -replace 'versionName "\d+\.\d+\.\d+"', "versionName `"$newVersion`""
    $vcMatch = [regex]::Match($gradle, 'versionCode (\d+)')
    if ($vcMatch.Success) {
        $newCode = [int]$vcMatch.Groups[1].Value + 1
        $gradle = $gradle -replace 'versionCode \d+', "versionCode $newCode"
    }
    $gradle | Set-Content $gradlePath -NoNewline

    Write-Host "Version bump: $newVersion (versionCode $newCode)" -ForegroundColor Green
}
finally {
    Pop-Location
}
