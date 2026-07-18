# ============================================================
# rebuild.ps1
# Pipeline completo de rebuild para Play Store (.aab).
# Uso (desde C:\Users\GAMING F15\Desktop\INTERSOFTI):
#   .\rebuild.ps1
# ============================================================

param(
    [string]$ProjectPath = "$env:USERPROFILE\Desktop\INTERSOFTI"
)

$ErrorActionPreference = "Stop"

function Log($msg, $color = "Cyan") {
    Write-Host ""
    Write-Host ">>> $msg" -ForegroundColor $color
}

Push-Location $ProjectPath

try {
    Log "Limpiando variables de entorno..." "DarkCyan"
    $env:NODE_ENV = "production"
    $env:CI = "false"
    Remove-Item Env:\VITE_* -ErrorAction SilentlyContinue

    Log "Sincronizando con GitHub (main)..." "DarkCyan"
    git fetch origin
    git reset --hard origin/main
    git clean -fd

    Log "Instalando dependencias..." "DarkCyan"
    npm install

    Log "Bumpeando version..." "DarkCyan"
    powershell -ExecutionPolicy Bypass -File .\scripts\bump-version.ps1 -ProjectPath $ProjectPath

    Log "Compilando web (dist/)..." "DarkCyan"
    npm run build

    if (-not (Test-Path "dist\index.html")) {
        throw "La carpeta dist/ no se genero correctamente. Revisa los errores de build."
    }

    Log "Verificando dist\release-build.json..." "Yellow"
    if (Test-Path "dist\release-build.json") {
        $releaseInfo = Get-Content "dist\release-build.json" -Raw | ConvertFrom-Json
        Write-Host "    version: $($releaseInfo.version)" -ForegroundColor Green
        Write-Host "    buildTime: $($releaseInfo.buildTime)" -ForegroundColor Green
    } else {
        Write-Host "    ADVERTENCIA: dist\release-build.json no existe. Continua, pero verifica manualmente." -ForegroundColor Yellow
    }

    Log "Sincronizando Capacitor Android..." "DarkCyan"
    npx cap sync android

    $gradle = ".\android\gradlew.bat"
    if (-not (Test-Path $gradle)) {
        throw "No se encontro $gradle. Ejecuta 'npx cap open android' una vez para que Android Studio genere el wrapper."
    }

    Log "Compilando Android App Bundle (.aab) release..." "DarkCyan"
    & $gradle :app:bundleRelease -p android

    $aab = "android/app/build/outputs/bundle/release/app-release.aab"
    if (-not (Test-Path $aab)) {
        throw "No se genero el AAB en $aab"
    }

    $size = (Get-Item $aab).Length / 1MB
    Log "AAB generado: $aab ($([math]::Round($size,2)) MB)" "Green"

    Log "Opcional: compilar APK debug para emulador/dispositivo..." "DarkCyan"
    & $gradle :app:assembleDebug -p android

    $apk = "android/app/build/outputs/apk/debug/app-debug.apk"
    if (Test-Path $apk) {
        Log "APK debug generado: $apk" "Green"
        $devices = adb devices | Select-String -Pattern "^\S+\s+device$" | ForEach-Object { ($_ -split "\s+")[0] }
        if ($devices) {
            foreach ($d in $devices) {
                Log "Instalando debug APK en $d..." "DarkCyan"
                adb -s $d install -r $apk
            }
        } else {
            Write-Host ">>> No hay dispositivos conectados. Inicia el emulador o conecta uno." -ForegroundColor Yellow
        }
    }

    Log "LISTO. Abre Android Studio en la carpeta android/ si necesitas firmar/finalizar." "Green"
    Write-Host "    Recuerda: antes de abrir Android Studio verifica dist\release-build.json" -ForegroundColor Yellow
}
finally {
    Pop-Location
}
