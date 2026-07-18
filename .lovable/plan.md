## Diagnóstico

En `/esim-status`, al tocar el input del ICCID, la "tarjeta blanca gigante" que aparece junto al teclado de Android **no forma parte de tu app** — es el panel de **autofill de Chrome / Gboard** (sugerencias de contraseñas / tarjetas / datos guardados). Chrome lo dispara porque el `<Input>` del ICCID no declara ningún `autoComplete`, `inputMode` ni `name` neutro, así que el WebView lo trata como un campo de formulario "genérico" y muestra el panel de autofill del sistema, que en Android ocupa casi toda la mitad superior de la pantalla sobre el teclado.

Secundariamente, el layout usa `min-h-screen` (100vh estático). Cuando Android abre el teclado con `adjustResize`, el viewport se encoge pero `100vh` no, así que la sección queda más alta que la pantalla visible, empujando el input y agravando la sensación de "todo se rompe".

## Cambios (solo `src/pages/EsimStatus.tsx`)

**1. Desactivar el panel de autofill de Android en el input del ICCID**

Añadir al `<Input>` (línea 459):
- `autoComplete="off"`
- `autoCorrect="off"`
- `autoCapitalize="none"`
- `spellCheck={false}`
- `inputMode="text"` (ICCID puede tener letras/números; mantiene teclado normal pero evita clasificarlo como campo sensible)
- `name="esim-iccid"` (nombre neutro, no reconocible como tarjeta/contraseña/teléfono)
- `enterKeyHint="search"` (mejora la tecla de acción del teclado)

Esto elimina el panel blanco de sugerencias de Chrome/Gboard.

**2. Layout resistente al teclado**

- Cambiar `min-h-screen` por `min-h-[100svh]` en la sección raíz (línea 426) para que respete el viewport pequeño cuando aparece el teclado.
- Hacer scroll del input a la vista al enfocar (en `onFocus`, junto al `setInputFocused(true)`), usando `e.currentTarget.scrollIntoView({ block: 'center', behavior: 'smooth' })` con un pequeño `setTimeout` de ~250ms para esperar a que el teclado termine de abrir.

**3. Ocultar también los flotantes durante el foco (opcional, mejora visual)**

El `WhatsAppFloat` y `VersionFooter` no causan la tarjeta blanca, pero pueden quedar sobrepuestos si el teclado los empuja. Como ya existe el estado `inputFocused`, no necesito tocarlos aquí; se pueden dejar como están.

## Verificación

- Reload en `/esim-status`, tocar el input → ya **no** debe aparecer el rectángulo blanco de autofill; solo el teclado.
- El input queda visible sobre el teclado (por `scrollIntoView` + `100svh`).
- La versión web/desktop se comporta igual que antes (estas props son inertes en escritorio).

Sin cambios en lógica ni en otros archivos.