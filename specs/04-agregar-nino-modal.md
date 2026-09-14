# SPEC 04 — Agregar Niño: Modal

> **Estado:** aprobado
> **Depende de:** SPEC 02
> **Fecha:** 2026-09-14
> **Objetivo:** Implementar un modal para agregar un niño desde el listado `/kids`, activado por el botón "Agregar niño", replicando el mockup `agregar-nino.dc.html` con los 5 campos del formulario (3 obligatorios, 2 opcionales), valores fijos para sala, y comportamiento visual sin persistencia.

## Alcance

**Incluye:**
- Componente `AddKidModal` que se renderiza como overlay/modal sobre el listado de niños.
- El botón "Agregar niño" del listado (`app/kids/page.tsx`) abre el modal al hacer clic.
- Formulario con 5 campos según `agregar-nino.dc.html`: NOMBRE COMPLETO (obligatorio), FECHA DE NACIMIENTO en formato dd/mm/aaaa (obligatorio), SALA con dropdown de valores fijos (obligatorio), ALERGIAS ETIQUETAS (opcional), NOTAS MÉDICAS (opcional).
- Dropdown de SALA con valores fijos hardcodeados (ej. "Soles").
- Header del modal con "Cancelar" (cierra el modal), título "Agregar niño", y "Guardar" (cierra el modal, sin persistencia).
- Fidelidad visual idéntica al mockup: tipografías Fredoka/Nunito, colores, espaciados, bordes redondeados, sombras.
- **Idioma del código:** todo el código interno en inglés. Solo textos visibles en pantalla en español.

**No incluye (fuera de scope):**
- Persistencia de datos — el formulario no guarda nada, el niño agregado no aparece en el listado.
- Validación de campos obligatorios — los campos son editables pero sin feedback de error.
- Envío real de formularios — "Guardar" solo cierra el modal.
- Estado local temporal — el niño no aparece en el listado hasta recargar.
- Responsive / versión móvil.
- Búsqueda funcional del listado (ya fuera de scope en SPEC 02).
- Edición o eliminación de niños existentes.

## Modelo de datos

No se introducen estructuras de datos nuevas. El modal usa estado local (`useState`) para controlar la apertura/cierre y los valores de los campos del formulario. Los valores fijos de SALA se definen como un array constante dentro del componente.

```typescript
const ROOM_OPTIONS = ["Soles"] as const;
```

## Plan de implementación

Cada paso deja la app compilando y visualizable.

1. **Crear componente `AddKidModal`:** Crear `app/components/AddKidModal.tsx` como componente client (`"use client"`). Recibe props `open: boolean` y `onClose: () => void`. Renderiza el overlay de fondo semitransparente + la tarjeta del modal centrada según el mockup. Contiene el header (Cancelar, título, Guardar) y el formulario con los 5 campos. El botón Cancelar y el botón Guardar ambos llaman `onClose`.
2. **Campo NOMBRE COMPLETO:** Input text con placeholder "Ej. Martina López", label "NOMBRE COMPLETO", estilos del mockup (border-radius 14px, border #EADFD0, background #fff, padding 13px 16px).
3. **Campos FECHA DE NACIMIENTO y SALA en fila:** Dos columnas flex con gap 14px. FECHA DE NACIMIENTO: input text con placeholder "dd/mm/aaaa". SALA: div estilizado como select visual que muestra "Soles" con ícono de chevron, replicando el mockup (no es un `<select>` nativo, es un div con apariencia de dropdown).
4. **Campo ALERGIAS (ETIQUETAS):** Input text con placeholder "Ej. Maní, Lactosa", label "ALERGIAS (ETIQUETAS)". Sin validación.
5. **Campo NOTAS MÉDICAS:** Textarea con placeholder "Indicaciones, medicación, contactos…", label "NOTAS MÉDICAS", min-height 90px. Sin validación.
6. **Abrir modal desde el listado:** Modificar `app/kids/page.tsx`: convertir el `<span>` del botón "Agregar niño" en un `<button>` con `onClick` que abre el modal (estado local `isAddKidOpen`). Renderizar `<AddKidModal>` condicionalmente.
7. **Verificación visual:** Comparar el modal abierto contra `referencias/pantallas/agregar-nino.dc.html` para confirmar fidelidad.

## Criterios de aceptación

- [ ] Existe `app/components/AddKidModal.tsx` como componente client que renderiza el modal.
- [ ] El botón "Agregar niño" del listado abre el modal al hacer clic.
- [ ] El modal muestra los 5 campos: NOMBRE COMPLETO, FECHA DE NACIMIENTO, SALA, ALERGIAS, NOTAS MÉDICAS.
- [ ] Los campos NOMBRE COMPLETO, FECHA DE NACIMIENTO y SALA están marcados como obligatorios (label con asterisco o indicación visual según el mockup).
- [ ] El campo SALA muestra un dropdown con valor fijo "Soles" replicando el estilo del mockup.
- [ ] El botón "Cancelar" del header cierra el modal.
- [ ] El botón "Guardar" del header cierra el modal.
- [ ] El modal se superpone sobre el listado con fondo semitransparente.
- [ ] La tarjeta del modal tiene border-radius 24px, sombra, y estilos idénticos al mockup.
- [ ] Los textos visibles están en español pero todo el código interno usa identificadores en inglés.
- [ ] No se añaden dependencias nuevas de runtime.
- [ ] `npm run lint` y `npx tsc --noEmit` pasan sin errores.
- [ ] `npm run build` compila correctamente.

## Decisiones tomadas y descartadas

- **Visual sin persistencia (tomado):** El modal es puramente visual, consistente con los specs anteriores (SPEC 02, SPEC 03) que no implementan persistencia. Se descarta estado local temporal porque la feature es solo la UI del modal.
- **5 campos incluidos (tomado):** Se incluyen los 5 campos del mockup (3 obligatorios + 2 opcionales) para fidelidad visual completa. Se descarta omitir alergias/notas médicas por ser parte del diseño aprobado.
- **Valores fijos de sala (tomado):** La sala se define como un array constante `["Soles"]` hardcodeado. Se descarta un dropdown dinámico o selector de sala por no haber backend.
- **Div estilizado como dropdown (tomado):** El campo SALA se renderiza como un div con apariencia de select nativo (texto + chevron), replicando el mockup exacto. Se descarta usar `<select>` nativo porque el mockup no muestra un select estándar.
- **Sin validación (tomado):** No hay feedback de error ni indicación de campos obligatorios más allá de los labels. Se descarta validación por estar fuera del alcance.
- **Depende de SPEC 02 (tomado):** El modal se integra en `app/kids/page.tsx` que fue creado en SPEC 02. Se descarta independencia total porque necesita el listado existente.

## Riesgos identificados

- **Integración con el listado existente:** El modal se monta dentro de `app/kids/page.tsx`, lo que añade un componente client a una página que actualmente es server component. Se mitiga usando `useState` solo en el componente del modal y en el botón trigger, manteniendo el resto del page como server component.
- **Fidelidad del dropdown de sala:** El mockup muestra un div que parece un select pero no es nativo. Replicarlo fielmente con un div estilizado puede requerir ajustes de CSS. Se mitiga usando los mismos estilos inline del mockup.

## What is **not** in this spec

- Persistencia de datos — el niño agregado no se guarda.
- Validación de formularios — no hay feedback de error.
- Aparición en el listado — el niño no aparece tras guardar.
- Responsive / versión móvil.
- Búsqueda funcional.
- Edición o eliminación de niños.
