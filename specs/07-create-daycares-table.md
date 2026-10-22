# SPEC 07 — Tabla `daycares` y patrón de migraciones

> **Estado:** implementado
> **Depende de:** Ninguno
> **Fecha:** 2026-10-10
> **Objetivo:** Recrear la tabla `daycares` en Supabase con una migración versionada (drop + create, RLS activo sin policies) y seed idempotente, dejando en `supabase/migrations/` un archivo espejo como patrón de migraciones del proyecto.

## Alcance

**Incluye:**
- Creación de la carpeta `supabase/migrations/` en la raíz del repo.
- Archivo espejo `supabase/migrations/20261010_recreate_daycares_table.sql` con el SQL completo de la migración (fuente de verdad versionada).
- Migración aplicada en el Supabase remoto vía MCP (`supabase_apply_migration`), con nombre `recreate_daycares_table`.
- Recreación desde cero de `public.daycares`: `drop table if exists ... cascade` + `create table`, dejando la tabla autocontenida y reproducible desde el repo.
- Estructura fiel al esquema documentado en `07-DB-Schema/opendaycare-database-schema.md`: `id uuid PK default gen_random_uuid()`, `name text`, `created_at timestamptz default now()`.
- RLS activo en la tabla (`alter table ... enable row level security`) **sin policies** (deny-all por defecto).
- Seed idempotente de la guardería `Guardería Sala Soles` (insertar solo si no existe).
- Verificación de la migración en el historial remoto y de la estructura resultante.

**No incluye (fuera de scope):**
- Policies RLS o cualquier modelo de acceso por daycare — requiere la tabla `users` (otro spec).
- Cualquier otra tabla del esquema (`users`, `rooms`, `children`, `parent_children`, `posts`, etc.).
- Tipos TypeScript de la DB ni instalación de `@supabase/supabase-js`.
- Instalación del Supabase CLI, `supabase init` o stack local (`supabase start`).
- Limpieza del historial de la migración `test_items`.
- Uso de la tabla desde la app (feed, kids, login, etc.).

## Modelo de datos

No se introducen estructuras en el código de la app (no hay cliente de Supabase todavía). La definición vive en la migración SQL. Estructura de `public.daycares`:

```sql
create table public.daycares (
  id uuid primary key default gen_random_uuid(),
  name text,
  created_at timestamptz not null default now()
);

alter table public.daycares enable row level security;
```

Seed idempotente:

```sql
insert into public.daycares (name)
select 'Guardería Sala Soles'
where not exists (
  select 1 from public.daycares where name = 'Guardería Sala Soles'
);
```

Convenciones:
- PK `id` `uuid` con default `gen_random_uuid()`.
- `created_at` `timestamptz` con default `now()`.
- RLS activo y sin policies: el acceso queda denegado salvo para el service role.

## Plan de implementación

Cada paso deja el sistema en un estado consistente y verificable.

1. **Carpeta de migraciones:** Crear `supabase/migrations/` en la raíz del repo si no existe.
2. **Archivo espejo (fuente de verdad):** Crear `supabase/migrations/20261010_recreate_daycares_table.sql` con el SQL completo: `drop table if exists public.daycares cascade;`, `create table public.daycares (...)` con la estructura de arriba, `alter table public.daycares enable row level security;` y el seed idempotente de `Guardería Sala Soles`.
3. **Aplicar en remoto:** Ejecutar el SQL del archivo con `supabase_apply_migration` (`name: recreate_daycares_table`). El MCP registra la migración en `supabase_migrations.schema_migrations`.
4. **Confirmar el historial:** Consultar `supabase_migrations.schema_migrations` y verificar que figura la migración `recreate_daycares_table` además de las previas.
5. **Verificar la estructura:** Con `list_tables`/SQL confirmar que `public.daycares` tiene `id`, `name`, `created_at`; que RLS está activo; y que existe exactamente 1 fila `Guardería Sala Soles`.
6. **Verificar seguridad:** Correr `supabase_get_advisors` (security) y confirmar que no aparecen hallazgos nuevos atribuibles a esta migración.

**Patrón de migraciones adoptado (queda establecido por este spec):**

1. El SQL se escribe primero en `supabase/migrations/<YYYYMMDD>_<nombre>.sql` (fuente de verdad versionada, timestamp propio legible).
2. Se aplica el mismo SQL en remoto con `supabase_apply_migration` usando como `name` el `<nombre>` del archivo.
3. Cada cambio de esquema futuro sigue este mismo par (archivo espejo + migración MCP).

## Criterios de aceptación

- [x] Existe `supabase/migrations/20261010_recreate_daycares_table.sql` con el SQL de recreación completo.
- [x] La migración `recreate_daycares_table` figura en `supabase_migrations.schema_migrations`.
- [x] `public.daycares` existe con columnas `id` (`uuid`, PK, default `gen_random_uuid()`), `name` (`text`) y `created_at` (`timestamptz`, default `now()`).
- [x] RLS está activo en `public.daycares`.
- [x] `public.daycares` no tiene policies (deny-all).
- [x] Existe exactamente 1 fila con `name = 'Guardería Sala Soles'`.
- [x] El seed usa `where not exists`, de modo que re-ejecutarlo no duplica la fila.
- [x] El SQL del archivo espejo coincide con lo aplicado en el remoto.
- [x] `supabase_get_advisors` (security) no reporta hallazgos nuevos atribuibles a esta migración.

## Decisiones tomadas y descartadas

- **Recrear desde cero (tomado):** `drop table if exists ... cascade` + `create table` deja una migración autocontenida y reproducible desde el repo. Se descarta solo versionar la tabla existente. Se acepta que la fila actual se pierde y el `id` se regenera (ningún FK la referencia todavía).
- **MCP + archivo espejo (tomado):** `supabase_apply_migration` aplica y registra en remoto; el archivo en `supabase/migrations/` es la fuente de verdad versionada. Se descarta instalar el Supabase CLI (`supabase init`/`db pull`) por ahora.
- **Archivo espejo con timestamp propio (tomado):** nombre legible `20261010_recreate_daycares_table.sql` en lugar del version exacto del MCP; el vínculo con el historial remoto es por el nombre de la migración.
- **Migración `recreate_daycares_table` (tomado):** nombre distinto de la anterior `create_daycares_table` para distinguir el drop + create en el historial.
- **RLS activo sin policies (tomado):** consistente con AGENTS.md (RLS siempre activo) y seguro por defecto. Se descarta definir acceso hasta tener `users`/roles.
- **Seed idempotente con `where not exists` (tomado):** evita duplicados si el bloque se re-ejecuta. Se descarta un `insert` plano.
- **Sin tipos TypeScript (tomado):** no hay `@supabase/supabase-js` instalado (AGENTS.md pide no instalarlo hasta necesitarlo). Se difiere a otro spec.
- **Sin policies por daycare (tomado):** el scoping por `daycare_id` del usuario necesita la tabla `users`; queda fuera para no inventar un modelo de acceso incompleto.

## Riesgos identificados

| Riesgo | Mitigación |
| --- | --- |
| El `drop` borra la fila existente `Guardería Sala Soles` | El seed idempotente en la misma migración la re-inserta; no hay FKs que la referencien todavía. |
| Divergencia entre el archivo espejo y el remoto | El archivo se escribe primero y se aplica tal cual con el MCP; el nombre de la migración los vincula. |
| RLS deny-all bloquea el acceso futuro de la app | Es una decisión explícita; las policies llegan con `users` en otro spec. |
| Colisión de nombres en el historial | La nueva migración se llama `recreate_daycares_table`, distinta de `create_daycares_table`. |

## What is **not** in this spec

- Policies RLS / acceso por daycare (depende de `users`).
- Otra tabla del esquema (`users`, `rooms`, `children`, `parent_children`, `posts`, etc.).
- Tipos TypeScript ni cliente `@supabase/supabase-js`.
- Instalación del Supabase CLI o migraciones locales (`supabase start`).
- Limpieza del historial de `test_items`.
- Consumo de `daycares` desde la aplicación.

Cada uno de esos puntos, si llega, va en su propio spec.
