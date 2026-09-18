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