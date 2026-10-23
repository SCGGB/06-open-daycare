# SPEC 10 — Auth real: login con email/contraseña y protección de rutas

> **Estado:** Aprobado
> **Depende de:** SPEC 03 (pantallas de login/activar-cuenta), SPEC 09 (tabla `users` y RLS)
> **Fecha:** 2026-10-23
> **Objetivo:** Implementar el login real contra Supabase con email y contraseña, proteger todas las rutas salvo `/login` y `/activar-cuenta`, y agregar logout.

## Alcance

**Incluye:**
- Login real con `supabase.auth.signInWithPassword` (solo email + contraseña) ejecutado en una Server Action.
- Persistencia de sesión mediante cookies con los helpers existentes de `@supabase/ssr`.
- Protección global de rutas en `proxy.ts` (Next 16): `/login` y `/activar-cuenta` públicas; el resto requiere sesión.
- Redirección a `/login?next=<ruta>` cuando falta sesión y retorno a la ruta intentada después del login.
- Redirección de usuarios ya autenticados que visitan `/login`.
- Helper server-side `requireUser()` con `getClaims()` como segunda defensa en páginas protegidas.
- Validación de que el perfil en `public.users` exista y tenga `status = 'active'` al iniciar sesión.
- Feedback de error inline y estado pendiente en el botón del formulario.
- Logout funcional en el botón de salida del `Sidebar`.
- Eliminar los valores prefijados del mockup en el formulario de login.

**No incluye (fuera de scope):**
- Activación real de cuentas (`/activar-cuenta` sigue siendo visual, según SPEC 03).
- Recuperación de contraseña (“¿Olvidaste tu contraseña?” sigue visual).
- Registro, invitaciones, códigos de activación o alta de usuarios.
- OAuth, magic links, MFA o confirmación de email.
- Enrutamiento o UI según rol (`staff`, `parent`, `admin`).
- Reemplazar la identidad hardcodeada del `Sidebar` (“Caro Giménez · Maestra · Soles”).
- Autorización por rol a nivel de página o Server Action.
- Cambios de esquema, RLS o migraciones.
- Tests automatizados (el repo no tiene test runner).

## Modelo de datos

Esta feature no crea tablas, columnas ni migraciones. Solo lee:

```ts
// Fila de public.users consultada después del sign-in
{ id: string; status: "pending" | "active" }

// Claims verificados con supabase.auth.getClaims()
{ sub: string; email?: string }
```

La cookie de sesión (`sb-<project_ref>-auth-token`) la gestiona `@supabase/ssr`; el proxy es el único punto que la refresca y la escribe.

## Plan de implementación

Cada paso deja la app compilando y navegable.

1. **Server Actions de auth.** Crear `app/actions/auth.ts` con `"use server"`:
   - `login(prevState, formData)`: valida email/contraseña no vacíos, llama `signInWithPassword`, consulta `public.users.status` del usuario autenticado y, si no hay fila o no es `active`, ejecuta `signOut()` y devuelve `{ error: "Tu cuenta está pendiente de activación." }`. Si todo está bien, redirige a `next` validado o a `/`.
   - `logout()`: llama `signOut()` y redirige a `/login`.
   - `next` solo se acepta si empieza con `/` y no con `//`; cualquier otro valor cae a `/`.
2. **Formulario de login real.** Crear `app/login/LoginForm.tsx` como Client Component con `useActionState` y actualizar `app/login/page.tsx` para renderizarlo. Mantener el diseño y branding actuales de `login.dc.html`, pero con:
   - inputs `name="email"` y `name="password"` vacíos, `required`, `autoComplete` correcto;
   - hidden input con `next` leído desde `searchParams` (Promise en Next 16);
   - mensaje inline con `role="alert"` cuando hay error;
   - botón deshabilitado y texto “Ingresando...” mientras `pending`.
3. **Helper server-side.** Crear `utils/supabase/auth.ts` con `requireUser()`: crea el cliente de servidor, llama `getClaims()` y redirige a `/login` si no hay claims válidos. Devuelve `{ id, email }`.
4. **Aplicar el helper.** Convertir en `async` y llamar `await requireUser()` al inicio de `app/page.tsx`, `app/kids/page.tsx` y `app/kids/[childId]/page.tsx`.
5. **Protección global en proxy.** Ajustar `utils/supabase/proxy.ts` para devolver el resultado de `getClaims()` junto al response con cookies refrescadas. En `proxy.ts` (raíz):
   - definir públicas exactas `/login` y `/activar-cuenta`;
   - sin sesión en ruta privada: redirigir a `/login` (para `/`) o `/login?next=<path+query>`;
   - con sesión en `/login`: redirigir a `next` validado o `/`;
   - al redirigir, copiar las cookies del response de Supabase y los headers `cache-control`, `expires` y `pragma`.
6. **Logout en Sidebar.** Reemplazar el `<a href="#">` del ícono de salida en `app/components/Sidebar.tsx` por un `<form action={logout}>` con un `<button type="submit">`, conservando estilos y el title “Cerrar sesión”.
7. **Verificación.** Ejecutar `npm run lint`, `npx tsc --noEmit` y `npm run build`; probar los flujos manuales con `scg@gmail.com` / `SCG123`.

## Criterios de aceptación

- [ ] Iniciar sesión con `scg@gmail.com` / `SCG123` establece la cookie `sb-<project_ref>-auth-token` y navega a `/`.
- [ ] Recargar `/` después del login mantiene la sesión (el proxy refresca la cookie).
- [ ] Una contraseña incorrecta muestra “Email o contraseña incorrectos.” inline y no deja sesión activa.
- [ ] Los campos vacíos no permiten el envío (`required`).
- [ ] Sin sesión, `/` redirige a `/login`; `/kids` redirige a `/login?next=/kids`.
- [ ] Después de un login originado en `/login?next=/kids`, el usuario aterriza en `/kids`.
- [ ] Un `next` externo (`https://...`) o protocol-relative (`//...`) se ignora y se redirige a `/`.
- [ ] Sin sesión, `/login` y `/activar-cuenta` cargan normalmente y sus enlaces siguen funcionando.
- [ ] Con sesión activa, visitar `/login` redirige a `/` (o al `next` válido).
- [ ] `app/page.tsx`, `app/kids/page.tsx` y `app/kids/[childId]/page.tsx` llaman `requireUser()`.
- [ ] El botón de logout del Sidebar cierra sesión, limpia las cookies y redirige a `/login`.
- [ ] Después del logout, navegar directo a `/` vuelve a redirigir a `/login`.
- [ ] La Server Action de login cierra la sesión y devuelve el mensaje de cuenta pendiente cuando el perfil no existe o `status != 'active'` (verificado por revisión de código; esta entrega no incluye fixture `pending`).
- [ ] No se agregan archivos en `supabase/migrations/` ni cambia el esquema remoto.
- [ ] `npm run lint`, `npx tsc --noEmit` y `npm run build` pasan sin errores.

## Decisiones tomadas y descartadas

- **Server Action para el login (tomado):** las credenciales y las cookies quedan del lado servidor, y el redirect se resuelve en el mismo request. Se descarta el browser client porque obliga a manejar errores, loading y redirect en el cliente.
- **Proxy + `requireUser()` (tomado):** el proxy hace el chequeo optimista y `requireUser()` es defensa en profundidad. Next y Supabase advierten que el proxy por sí solo no alcanza para proteger datos.
- **`getClaims()` en servidor (tomado):** verifica la firma del token en cada llamada. Se descarta `getSession()` en servidor porque lee la cookie sin revalidar.
- **Públicas solo `/login` y `/activar-cuenta` (tomado):** todo lo demás exige sesión. Se descarta dejar `/` público o proteger la activación.
- **Retorno con `next` validado (tomado):** mejora la UX cuando el proxy interrumpe una navegación. Se descarta enviar siempre a `/` y se descarta confiar en `next` sin validación.
- **Chequeo de `status` solo en el login (tomado):** evita una query extra por request. Se descarta validar `status` en `requireUser()` y en cada página.
- **Logout incluido (tomado):** el botón ya existía como visual y cierra el ciclo de sesión. Se descarta postergarlo a otro spec.
- **Sidebar con identidad real (descartado):** se mantiene “Caro Giménez · Maestra · Soles” hardcodeado. Mostrar el usuario real merece su propio spec de perfil.
- **Enrutamiento por rol (descartado):** hoy solo existe el feed staff; `parent`/`admin` se resolverán cuando existan sus pantallas.
- **Activación real y recuperación de contraseña (descartadas):** dependen de invitaciones y flujos de email; quedan en specs futuros.
- **Sin migraciones (tomado):** no hay cambios de esquema ni seeds nuevos; se reutiliza `scg@gmail.com` del SPEC 09.
- **Fixture `pending` (descartado por decisión del usuario):** no se crea un usuario pendiente de prueba; el camino queda implementado pero sin verificación end-to-end.

## Riesgos identificados

| Riesgo | Mitigación |
| --- | --- |
| Un cambio de `status` a `pending` durante una sesión activa no se detecta hasta el próximo login | Aceptado en este spec; si se vuelve requisito, agregar el chequeo en `requireUser()` o una DAL. |
| El bloqueo de cuentas pendientes no se prueba end-to-end al no haber fixture | Se valida por revisión de código y con `SELECT` de solo lectura sobre `public.users`; se agrega fixture cuando exista el flujo de activación. |
| Un redirect del proxy pierde las cookies refrescadas y desloguea al usuario | Copiar `cookies` y los headers `cache-control`/`expires`/`pragma` del response de Supabase al response de redirect. |
| Open redirect a través de `next` | Aceptar solo rutas internas que empiecen con `/` y no con `//`. |
| El botón “atrás” del navegador muestra una página cacheada después del logout | El acceso directo a la ruta vuelve a pasar por el proxy y redirige a `/login`; no se manipula la caché del navegador. |
| `getClaims()` en proxy y en páginas podría refrescar el token dos veces | El proxy es el único que escribe cookies; `requireUser()` solo valida y lee. |

## What is **not** in this spec

- Activación real de cuentas e invitaciones.
- Recuperación de contraseña, registro, OAuth, MFA o confirmación de email.
- Enrutamiento o autorización por rol (`staff`, `parent`, `admin`).
- Identidad real del usuario en el `Sidebar`.
- Cambios de esquema, RLS, políticas o migraciones.
- Tests automatizados o CI.
- Reemplazo del diseño visual de `/login` o `/activar-cuenta`.
