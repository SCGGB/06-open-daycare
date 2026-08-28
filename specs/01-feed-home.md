# SPEC 01 — Home /: Feed

**Estado:** Aprobado
**Depende de:** Ninguna
**Fecha:** 2026-08-27
**Objetivo:** Implementar la plantilla `referencias/pantallas/feed.dc.html` como el home `/` del proyecto, replicando el estilo visual de forma idéntica, sin autenticación ni base de datos.

## Alcance

**Incluye:**
- Reemplazo del contenido actual de `app/page.tsx` (scaffold de create-next-app) por el feed según la plantilla.
- **Idioma del código:** todo el código interno (nombres de componentes, variables, props, funciones, tipos) estará en inglés, siguiendo las reglas de código limpio. Solo los textos visibles en pantalla permanecen en español, idénticos al mockup.
- Layout de dos columnas idéntico al mockup: sidebar izquierdo fijo (248px) + main scrollable centrado (max 760px).
- Fuentes Fredoka y Nunito cargadas y aplicadas en todo el app.
- Sidebar con: logo/branding "OpenDayCare · Sala Soles", botón "Nueva publicación", nav (Feed, Niños, Avisos, Mi cuenta) y caja de usuario al pie (Caro Giménez · Maestra · Soles) con botón de cerrar sesión.
- Cabecera del feed (GUARDERÍA · SALA SOLES, "Buenas, Caro", "12 niños · martes 17 jun").
- Caja de composición "Compartí un momento…".
- Separador "PUBLICADO HOY".
- Las 3 publicaciones de ejemplo del mockup hardcodeadas tal cual (logro, actividad con foto, anuncio), con sus textos, badges, contadores y acciones.
- Iconos: mismos SVG inline del mockup, sin dependencias nuevas.
- Valores estáticos de usuario/sala/fecha tal como aparecen en el mockup.

**No incluye (fuera de scope):**
- Autenticación, login, sesiones.
- Base de datos ni persistencia de ningún tipo.
- Navegación funcional: los enlaces del sidebar ("Nueva publicación", Niños, Avisos, Mi cuenta, Editar, detalle, foto, logout) son solo visuales y no navegan a ninguna parte por ahora.
- Las pantallas restantes de `referencias/pantallas/` (crear-publicacion, ninos, avisos, mi-cuenta, login, detalle-publicacion, foto).
- Responsive / versión móvil con layout distinto al mockup.
- Interacciones (límite del feed, likes funcionales, etc.).

## Modelo de datos

No se introducen estructuras de datos nuevas. Los contenidos del feed son valores estáticos hardcodeados directamente en el componente. Esta sección se omite porque la feature no define datos nuevos.

## Plan de implementación

Cada paso deja la app compilando y visualizable.

1. **Fuentes:** Añadir Fredoka y Nunito al layout (Google Fonts) y reemplazar Geist en `app/layout.tsx`; actualizar las variables de fuente en `app/globals.css` (`@theme inline`) de modo que Nunito sea la fuente base y Fredoka se use para títulos.
2. **Base visual global:** Ajustar `app/globals.css` al fondo `#F6ECDF`, color de texto `#3F362E`, tipografía Nunito y scrollbar personalizado, siguiendo la plantilla.
3. **Estructura del home:** Reemplazar el contenido de `app/page.tsx` por un layout de dos columnas: `<aside>` sidebar (sticky, `flex-none`, 248px) + `<main>` scrollable.
4. **Sidebar:** Renderizar branding, botón "Nueva publicación", nav con los 4 items (Feed activo con estilo resaltado; Niños/Avisos/Mi cuenta como items inactivos) y la caja de usuario con foto de avatar "C" y botón de logout, todo como elementos estáticos (sin navegación).
5. **Contenido principal:** Renderizar cabecera del feed, la caja de composición "Compartí un momento…" y el separador "PUBLICADO HOY".
6. **Publicaciones:** Renderizar las 3 publicaciones hardcodeadas (logro con badge LOGRO, actividad con placeholder de foto, anuncio con badge ANUNCIO), cada una con su header (avatar, nombre, hora, badge), destinatario "Para:", texto, y fila de acciones (like, comentario, Editar) con los SVGs correspondientes.
7. **Componentes opcionales:** Extraer subcomponentes reutilizables (sidebar, item de post, badge) dentro de `app/` si mejora la legibilidad; de lo contrario mantenerlo en `page.tsx`. La forma final queda a criterio de implementación siempre que el resultado visual sea idéntico. Todos los identificadores y tipos usan nombres en inglés (p.ej. `Sidebar`, `PostCard`, `BadgeType`, `children`, `count`).
8. **Verificación visual:** Comparar el resultado en el navegador contra `referencias/pantallas/feed.dc.html` y `referencias/screenshots/` para confirmar fidelidad.

## Criterios de aceptación

- [x] `app/page.tsx` ya no contiene el scaffold de create-next-app y renderiza el feed.
- [x] El home `/` se ve visualmente idéntico a `referencias/pantallas/feed.dc.html` (colores, tipografías, tamaños, espaciado, iconos).
- [x] Las fuentes Fredoka y Nunito se cargan y aplican (Nunito para cuerpo, Fredoka para títulos/elementos destacados).
- [x] El sidebar y el main tienen el mismo layout del mockup (sidebar 248px sticky, contenido centrado max 760px).
- [x] Los textos visibles están en español (idénticos al mockup) pero todo el código interno usa identificadores, props y tipos en inglés, sin strings de UI en español dentro de la lógica.
- [x] No se añaden dependencias nuevas de runtime (iconos y estilos usan SVG inline / Tailwind ya presentes).
- [x] `npm run lint` y `npx tsc --noEmit` pasan sin errores.
- [x] `npm run build` compila correctamente.

## Decisiones tomadas y descartadas

- **Contenido hardcodeado (tomado):** Se replican las 3 publicaciones del mockup con sus textos y valores estáticos, ya que no existe base de datos. Un arreglo de datos en el componente se descarta por ahora para mantener la fidelidad exacta y el alcance mínimo, aunque es una migración trivial posterior.
- **Estilos con Tailwind + CSS global + SVG inline (tomado):** Se usa Tailwind v4 para layout y colores, CSS global para base tipográfica/scrollbar y los mismos SVG inline del mockup. Se descarta copiar los estilos inline literales por ser poco idiomático, y se descarta una librería de iconos (lucide) por no garantizar fidelidad y añadir una dependencia.
- **Valores estáticos (tomado):** Se mantienen los datos del mockup (Caro Giménez, Sala Soles, 12 niños, fecha) tal cual. Se descartan placeholders genéricos.
- **Sin navegación (tomado):** Los enlaces del sidebar y demás botones son solo visuales y no navegan. Se descarta asignarles hrefs a rutas que aún no existen para evitar 404 confusos.
- **Rationale de alcance restringido:** Autenticación, base de datos y las demás pantallas se excluyen deliberadamente; merecen specs propios.

## Riesgos identificados

- **Fidelidad tipográfica:** Si Fredoka/Nunito de Google Fonts no se cargan en el momento de comparar (opciones de red/entorno), el espaciado de algunos tamaños puede verse levemente distinto; se mitiga aplicando las mismas familias y pesos del mockup.
- **Cambio de fuente base global:** Reemplazar Geist por Nunito toca `layout.tsx` y `globals.css`, el resto de la app es mínima por lo que el impacto es bajo.
