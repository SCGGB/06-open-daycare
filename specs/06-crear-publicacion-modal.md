# SPEC 06 — Crear publicación: Modal

> **Estado:** implementado
> **Depende de:** SPEC 01, SPEC 02
> **Fecha:** 2026-09-17
> **Objetivo:** Implementar el modal de nueva publicación que se abre desde el botón "Nueva publicación" del sidebar y de la caja "Compartí un momento…" del feed, replicando `crear-publicacion.dc.html` con selector PARA multi-niño excluyente con "Toda la sala", TIPO single-select, validación de destinatario y descripción con mensajes por campo, y preview de fotos sin persistencia.

## Alcance

**Incluye:**
- Componente client `CreatePostModal` que se renderiza como overlay/modal sobre la página, con la tarjeta idéntica al mockup (max-w 580px, fondo `#FBF4EC`, borde `#ECE0D0`, radius 24, sombra `0 20px 50px -24px rgba(63,54,46,.35)`).
- Header del modal: "Cancelar" (cierra), título "Nueva publicación" (Fredoka 600 18px `#3F362E`), "Publicar" (`#D9583C` font-extrabold).
- Sección PARA con los **8 niños de `app/data/kids.ts`** (dataset de SPEC 02) + botón "Toda la sala". Cada pill muestra el avatar circular (initial + `avatarBg`/`avatarColor`) y el **nombre de pila** (primera palabra de `name`: Mateo, Sofía, Benjamín…).
- Comportamiento del selector PARA:
  - Multi-selección: se pueden elegir varios niños a la vez.
  - Clic en "Toda la sala": deselecciona todos los niños y deja "Toda la sala" como único seleccionado.
  - "Toda la sala" es **excluyente**: si está seleccionada y el usuario toca un niño, se deselecciona "Toda la sala" y queda el niño tocado.
  - Clic en un niño ya seleccionado lo deselecciona.
  - Estilo activo: fondo `#3F362E`, texto blanco. Estilo inactivo: fondo `#FFFDF9`, borde `#ECE0D0`, texto `#6E6359` (como el mockup de Mateo).
- Sección TIPO **single-select** con 7 tipos (Comida, Siesta, Actividad, Logro, Ánimo, Foto, Anuncio), "Comida" activa por defecto. Pill activo: color sólido + texto blanco; pill inactivo: versión pastel + texto color (ver modelo de datos).
- Sección DESCRIPCIÓN: textarea con placeholder "Contá cómo le fue hoy…", **vacío al abrir** y reseteado en cada apertura.
- Sección FOTOS: placeholder 96x96 del mockup + caja dashed "Agregar" que abre `<input type="file">` oculto. Al elegir un archivo se muestra el **thumbnail en memoria** (URL objeto, no persiste); se pueden agregar varias fotos.
- Validación de "Publicar": requiere al menos un destinatario PARA y descripción no vacía. Si falta, muestra error inline por campo ("Elegí al menos un niño." / "Escribí una descripción.", rojo `#D9583C`) y no cierra; los errores se limpian al corregir. Con todo válido, cierra el modal (sin persistencia).
- Disparadores: botón "Nueva publicación" del sidebar (**en todas las páginas** que montan `Sidebar`: `/`, `/kids`, `/kids/[childId]`) y la caja "Compartí un momento…" del feed. "Cancelar" ya no navega: cierra el modal.
- Reseteo completo de todos los campos en cada apertura.
- **Idioma del código:** todo el código interno en inglés. Solo textos visibles en pantalla en español.
- Sin dependencias nuevas de runtime.

**No incluye (fuera de scope):**
- Los enlaces "Editar" de los posts del feed — no abren el modal (otro spec si llega).
- Persistencia — "Publicar" no agrega la publicación al feed ni guarda nada.
- Validación de fotos (tipo/tamaño) ni límite de cantidad.
- TIPO obligatorio — por defecto es "Comida", no se exige elegir uno distinto para publicar.
- Multi-selección simultánea de tipos TIPO.
- Navegación post-publicación (a detalle, foto, etc.).
- Responsive / versión móvil.
- Cambios en `/kids`, `/kids/[childId]`, login u otras rutas (fuera del sidebar).

## Modelo de datos

No hay persistencia nueva. El estado de formulario vive en `CreatePostModal` con `useState`, reseteado en cada apertura.

```typescript
type PostType =
  | "Comida"
  | "Siesta"
  | "Actividad"
  | "Logro"
  | "Ánimo"
  | "Foto"
  | "Anuncio";

interface PostTypeOption {
  label: PostType;
  color: string; // pill activo (sólido + texto blanco)
  soft: string; // pill inactivo (pastel + texto color)
}

const POST_TYPES: PostTypeOption[] = [
  { label: "Comida", color: "#9A7B1E", soft: "#F4DC8E" },
  { label: "Siesta", color: "#7B5FC0", soft: "#E7DCF6" },
  { label: "Actividad", color: "#2E89A6", soft: "#C7E7F1" },
  { label: "Logro", color: "#3E9B6C", soft: "#CFEBD8" },
  { label: "Ánimo", color: "#C56486", soft: "#F9D2DE" },
  { label: "Foto", color: "#D9684A", soft: "#FBD8CC" },
  { label: "Anuncio", color: "#4E72C8", soft: "#CCD8F4" },
];

// Estado del selector PARA: "Toda la sala" excluye niños y viceversa
const wholeRoomSelected: boolean;
const selectedKidIds: string[];

// Fotos: URLs de objeto en memoria, revocadas al cerrar el modal
const photos: string[];

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
}
```

## Plan de implementación

Cada paso deja la app compilando y visualizable.

1. **Constantes y esqueleto del modal:** Crear `app/components/CreatePostModal.tsx` (`"use client"`) con props `open: boolean` y `onClose: () => void`; si `open` es falso retorna `null`. Renderizar overlay (`fixed inset-0 z-50 bg-black/30`) + tarjeta 580px centrada, con header (Cancelar / título / Publicar) y el cuerpo con las 4 secciones (PARA, TIPO, DESCRIPCIÓN, FOTOS) vacías, siguiendo los estilos del mockup. Cancelar y Publicar llaman `onClose`.
2. **Selector PARA:** Importar `kids` de `@/app/data/kids`. Estado `selectedKidIds: string[]` y `wholeRoomSelected: boolean`. Helpers `toggleKid(id)` (si `wholeRoomSelected`, primero la apaga; luego togglea el niño) y `selectWholeRoom()` (apaga todos los niños y activa "Toda la sala"). Pills con estilos activo/inactivo definidos en Alcance.
3. **Selector TIPO:** Estado `postType: PostType` inicializado en `"Comida"`. Renderizar los 7 pills de `POST_TYPES`; activo usa `color` de fondo y texto blanco; inactivo usa `soft` de fondo y texto `color`. El clic actualiza `postType`.
4. **Descripción y validación:** Estado `description: string` (textarea con placeholder del mockup). Estados `recipientError: string` y `descriptionError: string`. En "Publicar": si no hay destinatarios ni "Toda la sala" → `recipientError = "Elegí al menos un niño."`; si la descripción está vacía (trim) → `descriptionError = "Escribí una descripción."`; con errores no cierra; sin errores llama `onClose`. Los errores se limpian al tocar un pill PARA o escribir en el textarea. Los mensajes se muestran en rojo `#D9583C`, debajo de cada sección.
5. **FOTOS con preview:** Estado `photos: string[]`. Botón "Agregar" (caja dashed del mockup) dispara un `<input type="file" accept="image/*">` oculto; al elegir un archivo se hace `URL.createObjectURL(file)` y se agrega a `photos`. Renderizar cada foto como thumbnail cuadrado 96x96 (radius 14). Al cerrar, revocar las URLs de `photos` con `URL.revokeObjectURL`.
6. **Disparador en el sidebar:** En `app/components/Sidebar.tsx` (ya es client), convertir el `<a>` "Nueva publicación" en `<button>` con estado local `isCreatePostOpen: boolean`, manteniendo los estilos actuales del pill. Renderizar `<CreatePostModal open={isCreatePostOpen} onClose={...} />`. Al estar el sidebar en `/`, `/kids` y `/kids/[childId]`, el modal queda disponible en esas tres páginas.
7. **Disparador en el feed:** Crear `app/components/PostComposer.tsx` (`"use client"`) que replica exactamente la caja "Compartí un momento…" actual de `app/page.tsx` (avatar "C", texto, `CameraIcon`, radius 18, sombra), sostiene su propio estado `isCreatePostOpen` y renderiza el `<CreatePostModal>`. Reemplazar el `<a href="#">` de `app/page.tsx` por `<PostComposer />` (el page sigue siendo server component).
8. **Reseteo del formulario:** Cada vez que `open` pasa a `true`, reiniciar `selectedKidIds: []`, `wholeRoomSelected: false`, `postType: "Comida"`, `description: ""`, `photos: []` y los errores. Re-verificar apertura desde ambos disparadores.
9. **Verificación visual:** Comparar el modal abierto contra `referencias/pantallas/crear-publicacion.dc.html` para confirmar fidelidad (colores, tipografías Fredoka/Nunito, espaciados), y probar los flujos de selección/exclusión de PARA, la validación y el preview de fotos.

## Criterios de aceptación

- [x] Existe `app/components/CreatePostModal.tsx` como componente client con props `open` y `onClose`.
- [x] El botón "Nueva publicación" del sidebar abre el modal en `/`, `/kids` y `/kids/[childId]`.
- [x] La caja "Compartí un momento…" del feed abre el modal.
- [x] "Cancelar" y "Publicar" cierran el modal.
- [x] El selector PARA muestra los 8 niños de `app/data/kids.ts` con avatar (initial + color) y nombre de pila, más "Toda la sala".
- [x] Se pueden seleccionar varios niños a la vez (multi-selección).
- [x] Clic en "Toda la sala" deselecciona todos los niños y deja solo "Toda la sala" seleccionada.
- [x] Con "Toda la sala" seleccionada, tocar un niño la deselecciona y deja ese niño seleccionado.
- [x] Clic en un niño ya seleccionado lo deselecciona.
- [x] La selección activa usa el estilo del mockup (fondo `#3F362E`/texto blanco vs fondo `#FFFDF9`/borde `#ECE0D0`).
- [x] El selector TIPO permite un solo tipo a la vez, con "Comida" activa por defecto, y el clic mueve el resaltado.
- [x] El textarea DESCRIPCIÓN abre vacío con placeholder "Contá cómo le fue hoy…" y se resetea en cada apertura.
- [x] "Publicar" con PARA vacío muestra "Elegí al menos un niño." y no cierra.
- [x] "Publicar" con descripción vacía muestra "Escribí una descripción." y no cierra.
- [x] Los errores se limpian al corregir el campo correspondiente.
- [x] "Publicar" con destinatario y descripción válidos cierra el modal.
- [x] "Agregar" en FOTOS abre un file picker de imagen; elegir un archivo muestra un thumbnail 96x96 con la imagen en memoria.
- [x] Los thumbnails no persisten: al cerrar el modal se revocan las URLs objeto.
- [x] La tarjeta respeta colores, tipografías Fredoka/Nunito, radius y sombras del mockup.
- [x] Los textos visibles están en español pero el código interno usa identificadores en inglés.
- [x] No se añaden dependencias nuevas de runtime.
- [x] `npm run lint` y `npx tsc --noEmit` pasan sin errores.
- [x] `npm run build` compila correctamente.

## Decisiones tomadas y descartadas

- **TIPO single-select (tomado):** un solo tipo activo a la vez con "Comida" por defecto, como el selector PARENTESCO de `LinkParentModal`. Se descarta multi-selección de tipos.
- **Todos los niños del dataset (tomado):** PARA renderiza los 8 niños de `app/data/kids.ts` en vez de hardcodear los 3 del mockup, consistente con `/kids`. Se descarta fijar los 3 del mockup.
- **PARA vacío por defecto (tomado):** el modal abre sin destinatario, alineado con la validación "Elegí al menos un niño." Se descarta preseleccionar Mateo como en el mockup (el mockup solo ejemplifica un estado activo).
- **Validación con mensajes por campo (tomada):** "Elegí al menos un niño." y "Escribí una descripción." en rojo, limpiándose al corregir. Se descarta un mensaje genérico único o botón sin feedback.
- **TIPO no obligatorio (tomado):** como siempre hay uno activo por defecto, "Publicar" no exige cambiar de "Comida".
- **Fotos con preview efímero (tomado):** file picker + thumbnail con URL objeto, revocada al cerrar. Se descarta subida real (sin backend), persistencia o validación de tipo/tamaño.
- **Disparadores sidebar + caja compositor (tomado):** ambos enlazan a crear-publicacion en el mockup. Los "Editar" de los posts quedan fuera (implican modo edición precargada, otro spec), en línea con SPEC 01 donde eran solo visuales.
- **Modal disponible desde todas las páginas con sidebar (tomado):** el estado vive en `Sidebar` (client), así "Nueva publicación" funciona en `/`, `/kids` y `/kids/[childId]` sin tocar sus pages.
- **Estado de la caja compositor aislado (tomado):** se crea `PostComposer` client para no convertir `app/page.tsx` en client component, mismo patrón que `ParentInviteButton` en SPEC 05.
- **Sin persistencia (tomado):** "Publicar" solo valida y cierra, consistente con SPEC 01–05.

## Riesgos identificados

| Riesgo | Mitigación |
| --- | --- |
| Server component `app/page.tsx` debe abrir el modal | El estado client se aísla en `PostComposer`; el page sigue siendo server component. |
| Dos instancias de modal posibles (sidebar + compositor) | Cada trigger tiene su propio estado; el overlay impide abrir el otro mientras hay uno visible. Estado del formulario independiente por instancia. |
| Fugas de memoria de `URL.createObjectURL` | Revocar todas las URLs en `onClose`. |
| Fidelidad del resaltado TIPO | Se deriva del propio mockup (Comida/Actividad en `color` sólido con texto blanco); cada tipo mantiene su color de marca en ambas variantes. |
| Textarea y botón Publicar | Validación solo al hacer clic en Publicar; los errores se limpian al escribir. |

## What is **not** in this spec

- Los enlaces "Editar" del feed — no abren el modal.
- Persistencia — no se agrega la publicación al feed ni a ningún dato.
- Subida real de fotos, validación de tipo/tamaño o límite de cantidad.
- TIPO obligatorio (siempre hay uno por defecto).
- Multi-selección de tipos TIPO.
- Navegación después de publicar.
- Responsive / versión móvil.

Cada uno de esos puntos, si llega, va en su propio spec.
