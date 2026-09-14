# SPEC 03 — Auth: Login y Activar Cuenta

> **Estado:** implementado
> **Depende de:** Ninguna
> **Fecha:** 2026-09-14
> **Objetivo:** Implementar las pantallas de login (`/login`) y activación de cuenta (`/activar-cuenta`) como páginas standalone sin sidebar, replicando el estilo visual idéntico de los mockups, sin autenticación real ni base de datos.

## Alcance

**Incluye:**
- Ruta `/login` que renderiza el formulario de inicio de sesión según `referencias/pantallas/login.dc.html`.
- Ruta `/activar-cuenta` que renderiza el formulario de activación de cuenta según `referencias/pantallas/activar-cuenta.dc.html`.
- El formulario de login contiene **solo email + contraseña** (sin selector de rol Personal/Familia).
- Layout standalone sin sidebar para ambas páginas.
- Navegación visual entre páginas (enlaces que apuntan a las rutas correctas pero no son funcionales más allá de la navegación básica entre login ↔ activar-cuenta).
- Login siempre navega a `/` (feed staff) al enviar el formulario.
- Fidelidad visual idéntica al mockup: gradientes, colores, tipografías Fredoka/Nunito, espaciados, iconos SVG inline.
- **Idioma del código:** todo el código interno en inglés. Solo textos visibles en pantalla en español.

**No incluye (fuera de scope):**
- Autenticación real, sesiones, manejo de tokens.
- Base de datos ni persistencia de ningún tipo.
- Selector de rol (Personal/Familia) — se omite del login.
- Sidebar o layout de dashboard en estas páginas.
- Lógica de validación de formularios (campos son solo visuales por ahora).
- Envío real de formularios (el botón "Iniciar sesión" navega a `/`, el de "Activar mi cuenta" navega a `/`).
- Responsive / versión móvil.
- Recuperación de contraseña ("¿Olvidaste tu contraseña?" es solo visual).
- Pantallas de error, loading states, o feedback de validación.

## Modelo de datos

No se introducen estructuras de datos nuevas. Esta feature es puramente visual y no define datos nuevos.

## Plan de implementación

Cada paso deja la app compilando y visualizable.

1. **Ruta `/login` — página standalone:** Crear `app/login/page.tsx` que renderiza el login según `login.dc.html`: layout de dos columnas (panel izquierdo con gradiente `#F2937A`, logo, tagline, branding "OpenDayCare"; panel derecho con formulario de email + contraseña, enlace "¿Olvidaste tu contraseña?" visual, botón "Iniciar sesión" que navega a `/`, y enlace visual "Activá tu cuenta" que apunta a `/activar-cuenta`). Sin sidebar. Los campos email y contraseña están prellenados con los valores del mockup (`caro@opendaycare.com` y placeholder `••••••••`).
2. **Ruta `/activar-cuenta` — página standalone:** Crear `app/activar-cuenta/page.tsx` que renderiza la activación según `activar-cuenta.dc.html`: layout centrado standalone, logo con gradiente, título "Bienvenida a OpenDayCare", tarjeta con info del niño invitado (Mateo · Sala Soles), campos de código de invitación (`7K4P9`), email (`lucia.fernandez@gmail.com`), crear contraseña, checkbox de autorización de fotos (marcado por defecto), botón "Activar mi cuenta" que navega a `/`, y enlace visual "¿Ya tenés cuenta? Iniciar sesión" que apunta a `/login`.
3. **Verificación visual:** Comparar `/login` contra `referencias/pantallas/login.dc.html` y `/activar-cuenta` contra `referencias/pantallas/activar-cuenta.dc.html` para confirmar fidelidad.

## Criterios de aceptación

- [x] Existe `app/login/page.tsx` renderizando el formulario de login standalone.
- [x] La ruta `/login` se ve visualmente idéntica a `login.dc.html` (panel izquierdo con gradiente, formulario a la derecha).
- [x] El formulario de login tiene solo campo email + campo contraseña (sin selector de rol).
- [x] El botón "Iniciar sesión" navega a `/` (feed staff).
- [x] El enlace "Activá tu cuenta" apunta a `/activar-cuenta`.
- [x] Existe `app/activar-cuenta/page.tsx` renderizando el formulario de activación standalone.
- [x] La ruta `/activar-cuenta` se ve visualmente idéntica a `activar-cuenta.dc.html`.
- [x] El formulario de activación tiene: código de invitación, email, crear contraseña, checkbox de autorización.
- [x] El botón "Activar mi cuenta" navega a `/`.
- [x] El enlace "¿Ya tenés cuenta? Iniciar sesión" apunta a `/login`.
- [x] Ambas páginas son standalone (sin sidebar del dashboard).
- [x] Los textos visibles están en español (idénticos al mockup) pero todo el código interno usa identificadores en inglés.
- [x] No se añaden dependencias nuevas de runtime.
- [x] `npm run lint` y `npx tsc --noEmit` pasan sin errores.
- [x] `npm run build` compila correctamente.

## Decisiones tomadas y descartadas

- **Sin selector de rol (tomado):** Se omite el bloque "INGRESO COMO" (Personal/Familia) del login, tal como indicó el usuario. Se descarta implementar el selector por no ser requerido.
- **Páginas standalone (tomado):** Login y activar-cuenta no usan el sidebar del dashboard. Se descarta usar el layout compartido del dashboard para mantener la interfaz de autenticación limpia y enfocada.
- **Navegación visual solamente (tomado):** Los enlaces entre login ↔ activar-cuenta apuntan a las rutas correctas pero no hay lógica de autenticación. Se descarta añadir validación o feedback de error.
- **Sin lógica de formularios (tomado):** Los campos están prellenados con valores del mockup. Se descarta añadir useState, validación o manejo de submit por estar fuera del alcance.
- **Fidelidad visual exacta (tomada):** Se replican gradientes, colores, tipografías y espaciados del mockup. Se descarta simplificar o adaptar estilos.
- **Login siempre a feed staff (tomado):** Sin selector de rol, el destino es siempre `/`. Se descarta lógica condicional de navegación.

## Riesgos identificados

- **Navegación básica sin autenticación:** Las páginas navegan entre sí y al feed, pero no hay protección de rutas. Cualquier usuario puede acceder directamente a `/` sin autenticación. Se mitiga como aceptable dado que la autenticación real es scope de otro spec.
- **Layout standalone vs. global:** Si `app/layout.tsx` ya tiene estilos o estructura que afecta a todas las páginas, podría interferir con el diseño standalone. Se mitiga verificando que el layout global no inyecte sidebar o estilos incompatibles.





