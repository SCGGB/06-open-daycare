# SPEC 08 — Alineación de `supabase/migrations/` con el historial remoto

> **Estado:** implementado
> **Depende de:** SPEC 07 (`daycares` y patrón de migraciones)
> **Fecha:** 2026-10-22
> **Objetivo:** Dejar el repo como fuente de verdad completa del esquema remoto: espejos retroactivos de las migraciones que solo existían en el historial remoto, versionado de los cambios hechos fuera de la historia (fila `Sala Luna`, drop de `test_items`) y `supabase/config.toml`.

## Alcance

**Incluye:**
- Espejos retroactivos de `create_test_items_table` (20261010190711) y `create_daycares_table` (20261010192727), con el SQL exacto tomado de `supabase_migrations.schema_migrations.statements`.
- Versionado de la fila `Sala Luna`, insertada manualmente el 2026-10-16 fuera del historial de migraciones (`20261016_seed_sala_luna.sql`).
- Versionado del drop de `public.test_items`, ejecutado manualmente después de `recreate_daycares_table` y nunca registrado (`20261022_drop_test_items_table.sql`).
- `supabase/config.toml` mínimo para el proyecto Supabase.
- Commit de `supabase/` y de `specs/07-create-daycares-table.md` (hasta ahora sin versionar).

**No incluye (fuera de scope):**
- Renombrar los archivos al formato `<YYYYMMDDHHMMSS>_<nombre>.sql` del Supabase CLI (se mantiene el formato `<YYYYMMDD>_<nombre>.sql` del SPEC 07).
- Instalar el Supabase CLI o levantar un stack local.
- Policies RLS o cualquier otra tabla del esquema (`users`, `rooms`, `children`, `parent_children`, `posts`, etc.).
- Limpiar el historial remoto: las 3 migraciones originales (`create_test_items_table`, `create_daycares_table`) se conservan tal cual.

## Estado encontrado

| Origen | Migraciones | Archivos en el repo |
| --- | --- | --- |
| Remoto (`supabase_migrations.schema_migrations`) | 3 | 1 (`20261010_recreate_daycares_table.sql`) |
| Repo | — | 1, sin commitear (`supabase/` untracked) |

Divergencias detectadas:
1. `create_test_items_table` y `create_daycares_table` solo existían en el historial remoto.
2. La fila `Sala Luna` se había insertado por fuera del historial (sin archivo ni migración).
3. `public.test_items` se dropeó por fuera del historial: el repo no podía reproducir el estado remoto.
4. `supabase/` no estaba versionado en git: un clone del repo no traía ninguna migración.

## Plan de implementación

1. **Espejos retroactivos.** Recrear `20261010_create_test_items_table.sql` y `20261010_create_daycares_table.sql` con el SQL exacto del array `statements` del historial remoto (cada archivo declara su `version` y el nombre de `apply_migration` en la cabecera).
2. **Versionar `Sala Luna`.** Crear `20261016_seed_sala_luna.sql` con un seed idempotente por `name` (`insert ... select ... where not exists`), siguiendo el patrón de seed del SPEC 07, y aplicarlo en remoto con `apply_migration` (`seed_sala_luna`).
3. **Versionar el drop de `test_items`.** Crear `20261022_drop_test_items_table.sql` (`drop table if exists public.test_items cascade;`) y aplicarlo en remoto con `apply_migration` (`drop_test_items_table`). Es un no-op sobre la base actual: solo registra en la historia un cambio que ya había ocurrido.
4. **Configuración.** Crear `supabase/config.toml` con `project_id` y `db.major_version`, documentando que el CLI no está instalado y que los cambios se aplican vía MCP.
5. **Versionar en git.** `git add supabase/ specs/` y commitear el conjunto.

## Orden de reproducción

El formato `<YYYYMMDD>_<nombre>.sql` no garantiza el orden cronológico al ordenar alfabéticamente. Aplicando los 5 archivos en orden alfabético el estado final sigue siendo correcto (las migraciones son independientes o se reemplazan entre sí):

1. `20261010_create_daycares_table.sql` (cronológicamente 2.º, 1.º alfabético)
2. `20261010_create_test_items_table.sql`
3. `20261010_recreate_daycares_table.sql` (drop + create de `daycares` + seed)
4. `20261016_seed_sala_luna.sql`
5. `20261022_drop_test_items_table.sql`

Cada cabecera declara su timestamp remoto para quien necesite el orden cronológico estricto.

## Criterios de aceptación

- [x] Existen `20261010_create_test_items_table.sql` y `20261010_create_daycares_table.sql` con el SQL exacto aplicado en remoto.
- [x] Existe `20261016_seed_sala_luna.sql` con seed idempotente de `Sala Luna`.
- [x] Existe `20261022_drop_test_items_table.sql` con el drop idempotente de `public.test_items`.
- [x] Las migraciones `seed_sala_luna` y `drop_test_items_table` figuran en `supabase_migrations.schema_migrations`.
- [x] El historial remoto (5 migraciones) y el repo (5 archivos) están alineados 1:1 por nombre.
- [x] `public.daycares` conserva sus 2 filas (`Guardería Sala Soles`, `Sala Luna`) con los mismos `id` y `created_at` (el seed no duplicó ni modificó la fila existente).
- [x] `public.daycares` mantiene RLS activo y sin policies (deny-all).
- [x] `public` contiene 1 sola tabla: `daycares`.
- [x] Existe `supabase/config.toml`.
- [x] `supabase/` y `specs/07-create-daycares-table.md` están versionados en git.

## Decisiones tomadas y descartadas

- **Mantener el formato `<YYYYMMDD>_<nombre>.sql` (tomado):** el SPEC 07 lo fija como convención del proyecto y el usuario lo confirmó. Se descarta renombrar a 14 dígitos, con la consecuencia de que `supabase db push` no detecte estos archivos; queda documentado en `config.toml` y en este spec.
- **Espejos retroactivos con el SQL real (tomado):** `supabase_migrations.schema_migrations.statements` conserva el SQL completo de cada migración, lo que permite espejar sin inventar SQL. Se descarta escribir archivos aproximados.
- **Seed de `Sala Luna` por `name` (tomado):** sigue el patrón idempotente del SPEC 07 y no toca la fila ya existente (conserva `id` y `created_at`). Se descarta un `insert` con `id` fijo o un `upsert`.
- **Migración de drop de `test_items` (tomado):** registra en la historia un cambio ya ocurrido, sin tocar el estado actual. Se descarta reescribir la historia remota (borrar filas de `schema_migrations`).
- **`config.toml` mínimo (tomado):** describe el proyecto sin fijar un stack local. Se descarta generar el `config.toml` completo de `supabase init` (stack local, auth, storage) porque no hay CLI instalado.

## Riesgos identificados

| Riesgo | Mitigación |
| --- | --- |
| El CLI ignora los archivos por el prefijo de 8 dígitos | Documentado en `config.toml` y en este spec; los cambios se aplican vía MCP. |
| Orden alfabético ≠ orden cronológico | Cada cabecera declara el `version` remoto; el estado final es el mismo en ambos órdenes. |
| Re-aplicar los seeds sobre una base ya sembrada | Todos los inserts son idempotentes (`where not exists` por `name`) y los drops usan `if exists`. |

## What is **not** in this spec

- Policies RLS / acceso por daycare (depende de `users`).
- Otras tablas del esquema (`users`, `rooms`, `children`, `parent_children`, `posts`, etc.).
- Tipos TypeScript ni cliente `@supabase/supabase-js`.
- Instalación del Supabase CLI o stack local (`supabase start`).
- Limpieza del historial remoto de `create_test_items_table` y `create_daycares_table`.
- Consumo de `daycares` desde la aplicación.
