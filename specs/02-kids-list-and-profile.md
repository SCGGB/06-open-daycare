# SPEC 02 — Kids: Listado y Perfil

**Estado:** Aprobado
**Depende de:** SPEC 01
**Fecha:** 2026-08-31
**Objetivo:** Implementar la página de listado de niños (`/kids`) y el perfil individual (`/kids/[childId]`) replicando las plantillas `ninos.dc.html` y `perfil-nino.dc.html` con datos hardcodeados, y habilitar la navegación desde el sidebar del feed.

## Alcance

**Incluye:**
- Ruta `/kids` que renderiza el listado de niños según `referencias/pantallas/ninos.dc.html`.
- Ruta `/kids/[childId]` que renderiza el perfil de un niño según `referencias/pantallas/perfil-nino.dc.html`.
- Archivo de datos hardcodeados con los 8 niños del mockup (nombre, iniciales, color de avatar, edad, padres vinculados, alergias, fecha de nacimiento, sala, fecha de ingreso, padres individuales con nombre y estado).
- Actualización del `Sidebar.tsx` para que el enlace "Niños" navegue a `/kids` y se muestre como activo cuando la ruta actual es `/kids` o `/kids/[childId]`.
- Enlace "Volver a Niños" en el perfil que navegue a `/kids`.
- **Idioma del código:** todo el código interno (nombres de componentes, variables, props, funciones, tipos) estará en inglés. Solo los textos visibles en pantalla permanecen en español, idénticos al mockup.
- Layout de dos columnas idéntico al mockup: sidebar izquierdo fijo (248px) + main scrollable centrado (max 880px para listado, max 820px para perfil).
- Iconos: mismos SVG inline del mockup, sin dependencias nuevas.

**No incluye (fuera de scope):**
- Base de datos ni persistencia de ningún tipo.
- Funcionalidad de la barra de búsqueda (input estático, sin filtrado).
- Botón "Agregar niño" funcional (solo visual, sin navegación).
- Botón "Resumen del día" funcional del perfil (solo visual).
- Botón "Vincular otro padre" funcional del perfil (solo visual).
- Botón "Editar" del perfil (solo visual).
- Las demás rutas no mencionadas (avisos, mi-cuenta, login, crear-publicación, detalle-publicación, foto).
- Responsive / versión móvil.
- Interacciones más allá de la navegación Niños ↔ Perfil.

## Modelo de datos

Se introduce un archivo `app/data/kids.ts` con un arreglo constante de 8 objetos `Kid`. Cada objeto contiene:

```typescript
interface KidParent {
  name: string;
  role: string;        // "Mamá" | "Papá"
  initial: string;
  avatarColor: string;  // background del avatar
  status: "active" | "pending";
}

interface Kid {
  id: string;           // slug, e.g. "mateo-fernandez"
  name: string;
  initial: string;
  avatarBg: string;     // background del avatar
  avatarColor: string;  // color del texto del avatar
  age: string;          // "3 años" | "2 años"
  parentsLinked: number;
  parentsLabel: string; // "2 padres vinculados" | "1 padre vinculado" | "sin padres vinculados"
  tag?: string;         // "MANÍ" | "LACTOSA" | "VINCULAR" | undefined
  tagBg?: string;
  tagColor?: string;
  // Perfil detallado
  allergies?: string;
  birthDate: string;    // "12 mar 2022"
  room: string;         // "Soles"
  joinDate: string;     // "feb 2025"
  parents: KidParent[];
}
```

Los 8 niños (con datos del mockup `ninos.dc.html` + perfiles inventados coherentes):

| Nombre | ID | Edad | Tag | Alergias |
|---|---|---|---|---|
| Mateo Fernández | mateo-fernandez | 3 años | MANÍ | Alergia al maní. Evitar frutos secos. Lleva inhalador en la mochila. |
| Sofía Méndez | sofia-mendez | 2 años | — | Sin alergias conocidas. |
| Benjamín Ruiz | benjamin-ruiz | 3 años | — | Alergia al polvo. Ventilar el aula regularmente. |
| Valentina Soto | valentina-soto | 2 años | VINCULAR | Sin alergias conocidas. |
| Tomás Díaz | tomas-diaz | 3 años | LACTOSA | Intolerancia a la lactosa. Leche sin lactosa. |
| Emma Castro | emma-castro | 2 años | — | Alergia al gluten. Dieta sin TACC. |
| Lucas Romero | lucas-romero | 3 años | — | Sin alergias conocidas. |
| Olivia Vega | olivia-vega | 2 años | — | Asma leve. Monitor de esfuerzo. |

## Plan de implementación

Cada paso deja la app compilando y visualizable.

1. **Datos hardcodeados:** Crear `app/data/kids.ts` con el arreglo de 8 niños y el tipo `Kid` / `KidParent`.
2. **Ruta /kids — página de listado:** Crear `app/kids/page.tsx` que renderiza el listado según `ninos.dc.html`: cabecera (GESTIÓN · Niños), barra de búsqueda (estática), separador SALA SOLES, y grid de 2 columnas con las tarjetas de los 8 niños. Cada tarjeta es un `<Link>` a `/kids/[childId]`.
3. **Ruta /kids/[childId] — perfil:** Crear `app/kids/[childId]/page.tsx` que renderiza el perfil según `perfil-nino.dc.html`: enlace "Volver a Niños", avatar grande, nombre, edad, sala, botón "Editar" (visual), sección de alergias/notas, datos personales (nacimiento, sala, ingreso), botón "Resumen del día" (visual), y lista de padres vinculados con sus estados.
4. **Actualización del sidebar:** Modificar `app/components/Sidebar.tsx` para que el enlace "Niños" tenga `href="/kids"` y se muestre con estilo activo cuando la ruta actual comienza con `/kids`. Los demás enlaces siguen sin navegación (solo visuales).
5. **Layout compartido (opcional):** Si el sidebar se repite entre feed y kids, considerar extraer un componente `AppLayout` o usar un layout de ruta en `app/(dashboard)/layout.tsx` para evitar duplicación. La decisión final queda a criterio de implementación siempre que el resultado visual sea idéntico.
6. **Verificación visual:** Comparar `/kids` contra `referencias/pantallas/ninos.dc.html` y `/kids/mateo-fernandez` contra `referencias/pantallas/perfil-nino.dc.html` para confirmar fidelidad.

## Criterios de aceptación

- [x] Existe `app/data/kids.ts` exportando un arreglo de 8 objetos `Kid` con todos los campos del modelo.
- [x] La ruta `/kids` renderiza el listado de 8 niños en un grid de 2 columnas, visualmente idéntico a `ninos.dc.html`.
- [x] Cada tarjeta del listado muestra avatar con color/inicial, nombre, edad, padres vinculados, y tag (si aplica) con los colores del mockup.
- [x] Cada tarjeta del listado es un enlace que navega a `/kids/[childId]`.
- [x] La ruta `/kids/[childId]` renderiza el perfil visualmente idéntico a `perfil-nino.dc.html` para Mateo, y con datos coherentes para los demás niños.
- [x] El perfil muestra: avatar grande, nombre, edad, sala, botón "Editar" (visual), bloque de alergias/notas, datos personales (nacimiento, sala, ingreso), botón "Resumen del día" (visual), y lista de padres vinculados con badge de estado.
- [x] El enlace "Volver a Niños" del perfil navega a `/kids`.
- [x] El enlace "Niños" del sidebar navega a `/kids` y se muestra con estilo activo cuando la ruta actual es `/kids` o `/kids/[childId]`.
- [x] El sidebar del feed (`/`) sigue mostrándose idéntico a spec 01, con "Feed" activo.
- [x] Los textos visibles están en español (idénticos al mockup) pero todo el código interno usa identificadores, props y tipos en inglés.
- [x] No se añaden dependencias nuevas de runtime.
- [x] `npm run lint` y `npx tsc --noEmit` pasan sin errores.
- [x] `npm run build` compila correctamente.

## Decisiones tomadas y descartadas

- **Datos hardcodeados en archivo dedicado (tomado):** Se crea `app/data/kids.ts` con el arreglo y tipos. Se descarta hardcodear directamente en los componentes por claridad y para facilitar una futura migración a base de datos.
- **Slug como childId (tomado):** Se usa un slug kebab-case (`mateo-fernandez`) como identificador de ruta, no un índice numérico. Más legible y estable.
- **Búsqueda estática (tomada):** La barra de búsqueda es solo visual, sin filtrado. Se descarta filtrado en tiempo real por estar fuera del alcance y no haber sido solicitado.
- **Layout compartido (tomado):** Se reutiliza el sidebar existente y se evalúa extraer un layout compartido durante la implementación. Se descarta duplicar el sidebar completo en cada página.
- **Perfiles inventados (tomados):** Para los 7 niños sin mockup de perfil, se inventan datos coherentes (alergias, fechas, padres) basados en la información del listado. Se descarta mostrar solo nombre/edad por aportar poca utilidad.
- **Navegación limitada (tomada):** Solo navegan: sidebar "Niños" → `/kids`, tarjetas → `/kids/[childId]`, "Volver a Niños" → `/kids`. Se descarta habilitar navegación en otros enlaces del sidebar para evitar rutas que no existen.

## Riesgos identificados

- **Duplicación del sidebar:** Si no se extrae un layout compartido, el sidebar se duplica entre feed y kids, lo que dificulta mantener consistencia. Se mitiga evaluando la extracción en el paso 5 del plan.
- **Fidelidad del perfil para niños sin mockup:** Solo Mateo tiene mockup de perfil completo. Los perfiles inventados deben respetar la estructura visual pero los datos específicos son aproximados. Se mitiga usando la misma estructura HTML del mockup con datos coherentes.
