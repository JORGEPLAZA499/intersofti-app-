# ============================================================
# rebuild-test.ps1
# Recompila la app Android en modo debug e instala en todos los
# dispositivos/emuladores conectados.
# Uso: .\scripts\rebuild-test.ps1 [-ProjectPath "C:\Users\...\INTERSOFTI"]
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
    Log "Limpiando entorno..."
    $env:NODE_ENV = "production"
    $env:CI = "false"

    Log "Sincronizando con GitHub..."
    git fetch origin
    git reset --hard origin/main
    git clean -fd

    Log "Instalando dependencias..."
    npm install

    Log "Bumpeando version..."
    powershell -ExecutionPolicy Bypass -File .\scripts\bump-version.ps1 -ProjectPath $ProjectPath

    Log "Compilando web..."
    npm run build

    Log "Sincronizando Capacitor Android..."
    npx cap sync android

    Log "Compilando APK debug..."
    .\android\gradlew :app:assembleDebug -p android

    $apk = "android/app/build/outputs/apk/debug/app-debug.apk"
    if (-not (Test-Path $apk)) { throw "No se genero el APK en $apk" }

    Log "Buscando dispositivos/emuladores..."
    $devices = adb devices | Select-String -Pattern "^\S+\s+device$" | ForEach-Object { ($_ -split "\s+")[0] }

    if (-not $devices) {
        Write-Host ">>> No se encontraron dispositivos conectados. Inicia el emulador o conecta un dispositivo." -ForegroundColor Yellow
    } else {
        foreach ($d in $devices) {
            Log "Instalando en $d..."
            adb -s $d install -r $apk
        }
    }

    Log "Listo. Verifica Ajustes > Sobre la app para confirmar la nueva version." -ForegroundColor Green
}
finally {
    Pop-Location
}
