<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Stack

Next.js 16 (App Router) + React 19 + Tailwind v4 (CSS-first via `@import "tailwindcss"`, no `tailwind.config`). TypeScript strict. All UI lives under `app/`; the only route page so far is `app/page.tsx` (default create-next-app scaffold).

## Commands

- `npm run dev` — dev server (port 3000)
- `npm run lint` — `eslint` (no default `typecheck` script; use `npx tsc --noEmit`)
- `npm run build` — production build

There is no test setup (no test runner, no CI workflows).

## MCPs / external tools

- **Playwright**: the MCP runs via `opencode.json` (`npx -y @playwright/mcp@latest`). Playwright screenshots and anything Playwright-related go in the **`playwright-mcp/`** folder (git-tracked). Do **not** put them in `.playwright-mcp/` — that folder is gitignored runtime output (console logs, page `.yml`/`.png` snapshots) and is not for committed assets.
- **Context7**: use this MCP for up-to-date framework/library docs.
- **Supabase**: MCP conectado al proyecto de Supabase. Usa los tools `supabase_*` para SQL, migraciones, RLS, Edge Functions, logs, tipos TypeScript y advisors de seguridad/rendimiento. La contraseña de la DB está en `.ENV` (`SUPABASE_DB_PASSWORD`). No instalar el cliente `@supabase/supabase-js` hasta que se necesite; la referencia a `../07-DB-Schema` contiene el esquema/documentación de la DB.

## Supabase

- El esquema y documentación de la base de datos viven en `../07-DB-Schema` (referencia del proyecto).
- Al tocar la base de datos: activar RLS en toda tabla expuesta, crear policies acordes al modelo de acceso, y **nunca** exponer claves secretas en el cliente (solo publishable/`NEXT_PUBLIC_`).
- Antes de escribir SQL, revisar el changelog de Supabase y las skills (`supabase`, `supabase-postgres-best-practices`).
- Regla general: tabla con RLS + policies explícitas (no `auth.role()`), views con `security_invoker = true`.
- **Todo cambio de esquema se hace mediante una migración versionada** — ver la sección «Migraciones» más abajo.

## Migraciones

> **Regla:** siempre usamos migraciones. Cualquier manipulación de la base de datos (esquema o datos) pasa por un archivo versionado en `supabase/migrations/`; nunca se ejecuta SQL suelto contra la base.

**Flujo obligatorio (patrón del SPEC 07):**

1. Escribir el SQL **primero** en `supabase/migrations/<YYYYMMDD>_<nombre>.sql` (fuente de verdad versionada).
2. Aplicar ese mismo SQL en remoto con `supabase_apply_migration` usando como `name` el `<nombre>` del archivo (sin timestamp).
3. Verificar con `supabase_list_migrations` que la entrada quedó registrada, y con consultas de solo lectura que la estructura y los datos son los esperados.
4. Commitear el archivo de migración en el **mismo** cambio que el código que lo requiere.

**Reglas de contenido:**

- Aplica a todo: tablas, columnas, índices, constraints, enums, RLS, policies, triggers, funciones, vistas y seeds.
- Cada archivo debe ser autocontenido y reproducible: `drop ... if exists` antes de `create`, seeds idempotentes (`insert ... select ... where not exists`).
- El SQL remoto y el del archivo deben coincidir; si divergen, se corrige el archivo (el historial remoto no se reescribe).
- `supabase/migrations/` debe quedar alineado 1:1 con el historial remoto: una entrada en `supabase_migrations.schema_migrations` por archivo, con el mismo nombre.
- Nada de "SQL suelto": cambios de esquema aplicados con `execute_sql`/SQL Editor sin archivo equivalente quedan fuera del control de versiones y **no** se aceptan como entrega.

**Excepciones:** se permite `supabase_execute_sql` con `SELECT` para inspeccionar/verificar (listar tablas, policies, advisors, logs). Si la consulta revela la necesidad de un cambio de esquema, ese cambio pasa por migración.

**Herramientas:** el CLI de Supabase no está instalado; los cambios se aplican vía MCP (`supabase_apply_migration`). Los archivos usan el prefijo `<YYYYMMDD>_<nombre>.sql` (8 dígitos), convención del proyecto: el CLI solo reconoce prefijos de 14 dígitos, así que `supabase db push` / `db reset` no aplican estos archivos.

## Specs

- Las specs viven en `specs/` con numeración secuencial (`01-...md`).
- **Cualquier archivo relacionado con la base de datos va en `specs/database/`** (esquema, tablas, migraciones, RLS, policies, seeds, documentación de la DB, etc.), continuando la numeración secuencial global (`07-...`, `08-...`).

## Design references

- `referencias/pantallas/*.dc.html` — screen mockups (login, feed, perfil-nino, etc.). These are the source of truth for UI structure; new screens should follow them.
- `referencias/screenshots/*.png` — image references for the same screens.
- `support.js` in `referencias/pantallas/` is a helper referencing those HTML files.

## Notes

- The path alias `@/*` maps to the repo root (`tsconfig.json`), so imports are `@/app/...`.
- On this repo the repo root is a Next.js package; if the `next` package is ever not visible from the root (monorepo), resolve the docs/agents block relative to the package.

## Spec Driven Development - Skills
- /spec usaremos esta habilidad para crear las especificaciones
- /spec-impl usaremos esta skill para hacer las implementaciones
- /verify-spec verificación de specs con el agente spec-verifier
- /supabase skill oficial de Supabase (agent-skills) para cualquier tarea con Supabase: Auth, RLS, Edge Functions, Realtime, Storage, logs, debugging. Antes de implementar, verificar contra el changelog (`https://supabase.com/changelog.md`).
- /supabase-postgres-best-practices best practices de Postgres/Supabase. Cargar ANTES de escribir o cambiar cualquier SQL (tablas, columnas, migraciones, RLS, índices, triggers).

## Agents
- **spec-verifier**: agente subagent que verifica criterios de aceptación desde archivos spec usando Context7, Playwright y vision

## Reglas de código

- Usar código limpio, nombres, funciones, variables, etc. en ingles