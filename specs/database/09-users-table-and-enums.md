# SPEC 09 — Tabla `users` y enums `user_role` / `user_status`

> **Estado:** implementado
> **Depende de:** SPEC 07 (`daycares`), SPEC 08 (alineación de migraciones)
> **Fecha:** 2026-10-22
> **Objetivo:** Crear los enums `user_role` y `user_status`, la tabla `public.users` vinculada a `auth.users`, habilitar RLS con políticas basadas en `auth.uid()` (opción C), permitir `daycare_id` nullable para superadmin y dejar la estructura lista para un usuario staff de prueba en "Guardería Sala Soles".

## Alcance

**Incluye:**
- Crear enums `user_role` (`staff`, `parent`, `admin`) y `user_status` (`pending`, `active`) si no existen (solo los involucrados con usuarios/roles/estatus).
- Crear tabla `public.users` con la estructura definida en el esquema, con `daycare_id` nullable para el caso de superadmin.
- Habilitar RLS en `public.users`.
- Crear políticas para opción C: acceso basado en `auth.uid() = users.id` y reglas por rol/relación al propio registro usando `auth.uid()` (sin usar `auth.role()`).
- Documentar/validar la existencia de `daycares` (usar `Guardería Sala Soles` para pruebas).

**No incluye (fuera de scope):**
- Trigger `AFTER INSERT` sobre `auth.users` ni función `SECURITY DEFINER` para crear `public.users` automáticamente.
- Tablas `parent_children`, `invitations`, `rooms`, `children`, `posts`, `post_children`, `post_photos`, `reactions`, `comments`, `daily_summaries`, etc.
- Seeds masivos fuera de lo estrictamente necesario para validar la estructura.
- Políticas para otras tablas.
- Cliente `@supabase/supabase-js` o tipos TypeScript.

## Modelo de datos

### Enums
```sql
CREATE TYPE public.user_role AS ENUM ('staff', 'parent', 'admin');
CREATE TYPE public.user_status AS ENUM ('pending', 'active');
```

### Tabla `public.users`
Basada en `../07-DB-Schema/opendaycare-database-schema.md`:

| Campo | Tipo | Notas |
| --- | --- | --- |
| `id` | `uuid` PK | FK → `auth.users(id)` ON DELETE CASCADE. Mismo UUID que Supabase Auth. |
| `daycare_id` | `uuid` FK → `public.daycares(id)` | **Nullable** (caso superadmin). |
| `role` | `public.user_role` | `staff` / `parent` / `admin`. |
| `status` | `public.user_status` | Default `active`. |
| `full_name` | `text` | Requerido. |
| `avatar_url` | `text` | Nullable. |
| `notify_on_post` | `boolean` DEFAULT `true` | Avisos cuando publican. |
| `daily_summary_enabled` | `boolean` DEFAULT `true` | Resumen diario (19:00). |
| `created_at` | `timestamptz` NOT NULL DEFAULT `now()` | |
| `updated_at` | `timestamptz` NOT NULL DEFAULT `now()` | |

### RLS
- `ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;`

### Políticas (opción C, usando `auth.uid()`)
Se crearán políticas explícitas (sin `auth.role()`). Patrón base:
- **SELECT propio:** Un usuario autenticado puede leer su propia fila (`auth.uid() = id`).
- **UPDATE propio:** Un usuario autenticado puede actualizar su propia fila (`auth.uid() = id`) con restricciones razonables.
- **Políticas por rol/contexto:** Según necesidad, permitir lectura/actualización acotada usando `auth.uid()` para obtener `role`/`daycare_id` desde `public.users` (mediante `EXISTS` o función con `SECURITY DEFINER` solo si estrictamente necesario). Todo basado en `auth.uid()`.

## Plan de implementación

1. **Preparación.** Verificar existencia de `public.daycares` y obtener `id` de "Guardería Sala Soles".
2. **Crear migración.** Escribir `supabase/migrations/20261022_users_table_and_enums.sql` con enums, tabla, índices necesarios, `updated_at` trigger si aplica al estilo del proyecto, RLS y políticas (opción C con `auth.uid()`).
3. **Aplicar migración.** Ejecutar `supabase_apply_migration` con `project_id` del proyecto, `name: "users_table_and_enums"`, `query` = contenido del archivo.
4. **Verificación.** Con `supabase_list_tables`/consultas de solo lectura validar enums, tabla `users`, RLS habilitado y políticas creadas. Verificar que `Guardería Sala Soles` existe para vincular el usuario de prueba.
5. **Preparar usuario staff de prueba (documentado).** Crear usuario en Auth con: correo `scg@gmail.com`, nombre `SCG`, password `SCG123`, rol `staff`. Vincularlo a `Guardería Sala Soles` (`daycare_id` = id correspondiente). Esto se hará vía Auth/SQL según procedimiento del proyecto (documentado en la migración o notas de implementación), respetando que `users.id` debe coincidir con `auth.users.id`.
6. **Commit.** Commitear `supabase/migrations/20261022_users_table_and_enums.sql` junto con este spec.

## Notas de implementación

- Migraciones aplicadas en remoto: `20261022160411 users_table_and_enums` y `20261022160425 seed_test_staff_user`.
- Usuario de prueba: `scg@gmail.com` (`3fd8bbab-996a-4286-808c-8b3b55cfddaa`), `full_name = 'SCG'`, `role = 'staff'`, `status = 'active'`, vinculado a `Guardería Sala Soles` (`c0484de6-4dfd-4565-82a4-049aa6fa8633`).
- Login verificado contra `POST /auth/v1/token?grant_type=password`: devuelve `access_token`.
- RLS verificado con el JWT del usuario: lee y actualiza su propia fila; no puede actualizar `role`, `status` ni `daycare_id` (sin privilegios de columna).

## Criterios de aceptación

- [x] Existen los enums `public.user_role` y `public.user_status` con los valores correctos.
- [x] Existe la tabla `public.users` con todas las columnas del esquema, `daycare_id` nullable, FK a `auth.users` y FK a `daycares`.
- [x] `public.users` tiene RLS habilitado.
- [x] Existen políticas explícitas basadas en `auth.uid()` (opción C), sin uso de `auth.role()`.
- [x] La migración está registrada en `supabase_migrations.schema_migrations` tras aplicarla con `supabase_apply_migration`.
- [x] El archivo de migración existe en `supabase/migrations/20261022_users_table_and_enums.sql` y es autocontenido.
- [x] Se puede vincular un usuario staff a "Guardería Sala Soles" (estructura validada).
- [x] Usuario de prueba definido: `scg@gmail.com` / `SCG` / `SCG123` / rol `staff` / daycare `Guardería Sala Soles` (documentado para uso en pruebas).

## Decisiones tomadas y descartadas

- **Crear solo enums de usuario/rol/estatus (tomado):** Se descarta crear otros enums en esta spec, solo `user_role` y `user_status`.
- **Solo tabla `users` (tomado):** Se descarta trigger desde `auth.users` y función asociada. Queda fuera de scope.
- **`daycare_id` nullable (tomado):** Permitido para caso superadmin, manteniendo FK a `daycares`.
- **Políticas opción C con `auth.uid()` (tomado):** Acceso basado en el propio usuario autenticado usando `auth.uid()`, sin `auth.role()`.
- **Vincular a Guardería Sala Soles (tomado):** Usar la guardería existente para el usuario staff de prueba `scg@gmail.com`.
- **Migración versionada (tomado):** Seguir patrón `<YYYYMMDD>_<nombre>.sql`, aplicar con `supabase_apply_migration`, commitear archivo.
- **Seed del usuario de prueba en migración aparte (tomado):** `20261022_seed_test_staff_user.sql` crea el usuario de Auth y su perfil en `public.users`. Se separa del esquema para que `users_table_and_enums` sea reproducible por sí sola y el seed sea idempotente. Se descarta mezclar datos de prueba en la migración de estructura.
- **Alta del usuario de Auth por SQL (tomado):** No hay `service_role` key en el proyecto para invocar la Admin API, así que el seed inserta en `auth.users` + `auth.identities` con password bcrypt (`extensions.crypt`). Se verificó el login real contra `/auth/v1/token` con `scg@gmail.com` / `SCG123`.
- **Restricción de columnas actualizables (tomado):** `authenticated` solo puede actualizar `full_name`, `avatar_url`, `notify_on_post` y `daily_summary_enabled`. `role`, `status` y `daycare_id` quedan fuera del `GRANT UPDATE` para evitar auto-escalada de privilegios. Se descarta permitir el UPDATE completo y confiar solo en RLS.
- **`daycare_id` obligatorio salvo `admin` (tomado):** Check `role = 'admin' or daycare_id is not null`, coherente con el caso superadmin documentado.

## Riesgos identificados

| Riesgo | Mitigación |
| --- | --- |
| Políticas demasiado restrictivas impiden probar con staff | Definir políticas claras opción C con `auth.uid()` y validar con consultas de solo lectura tras aplicar. |
| `daycare_id` nullable puede usarse incorrectamente | Documentar explícitamente que solo aplica a superadmin; resto de roles debe tener `daycare_id` asignado. |
| Desincronización entre `auth.users` y `public.users` | No crear trigger ahora; documentar procedimiento para crear fila `public.users` con mismo `id` que `auth.users` al crear usuario de prueba. |
| Orden de migraciones | Usar fecha actual `20261022` siguiendo convención del proyecto. |

## What is **not** in this spec

- Trigger/function para sincronizar `auth.users` → `public.users`.
- Tablas `parent_children`, `invitations`, `rooms`, `children`, `posts`, `post_children`, `post_photos`, `reactions`, `comments`, `daily_summaries`.
- Políticas para otras tablas.
- Tipos TypeScript, cliente Supabase o integración frontend.
- Seeds automáticos complejos (solo documentación del usuario de prueba).
