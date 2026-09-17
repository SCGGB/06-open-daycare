# SPEC 05 — Vincular Padre: Modal

> **Estado:** implementado
> **Depende de:** SPEC 02
> **Fecha:** 2026-09-17
> **Objetivo:** Implementar el flujo de vincular un padre como modal que se abre desde la opción "Vincular otro padre" del perfil de cada niño (`/kids/[childId]`), replicando `vincular-padre.dc.html` en colores y tipografías, sin persistencia.

## Alcance

**Incluye:**
- Componente client `LinkParentModal` que se renderiza como overlay/modal sobre el perfil del niño.
- La opción "Vincular otro padre" de `app/kids/[childId]/page.tsx` se convierte en un botón que abre el modal al hacer clic.
- Contenido del modal según `referencias/pantallas/vincular-padre.dc.html`: header ("Vincular padre" + subtítulo "a {Nombre del niño}") con botón X de cierre, box azul informativo, campo NOMBRE DEL PADRE/MADRE, campo EMAIL, selector de PARENTESCO (Mamá/Papá/Tutor/a) interactivo visualmente, caja de código de invitación fija ("7K4P9" · "Vence en 7 días"), y CTA "Enviar invitación".
- Subtítulo y texto del box informativo dinámicos: muestran el nombre del niño cuyo perfil está abierto.
- El botón "Enviar invitación" solo cierra el modal (sin persistencia; el padre no se agrega a la lista PADRES VINCULADOS).
- Selector de PARENTESCO interactivo solo visual: "Mamá" seleccionada por defecto; el clic mueve el resaltado (fondo `#CCD8F4`, borde `#9FB8EC`, texto `#4E72C8`) al botón elegido.
- Los campos del formulario se reinician a sus valores por defecto en cada apertura del modal.
- Validación del campo EMAIL: vacío o formato inválido muestra un mensaje de error (en blur y al intentar enviar) y bloquea "Enviar invitación"; el error se limpia al escribir.
- Fidelidad visual idéntica al mockup: colores, tipografías Fredoka/Nunito, border-radius, sombras.
- **Idioma del código:** todo el código interno en inglés. Solo textos visibles en pantalla en español.

**No incluye (fuera de scope):**
- Persistencia de ningún tipo — el padre vinculado no se agrega a los datos ni a la lista PADRES VINCULADOS.
- Envío real de correos ni generación de códigos — "7K4P9" y "Vence en 7 días" son texto fijo.
- Validación del campo NOMBRE DEL PADRE/MADRE — sin feedback de error.
- Estados de carga, éxito o error tras "Enviar invitación".
- Responsive / versión móvil.
- Cambios en el listado de niños (`/kids`), login, activar-cuenta u otras rutas.

## Modelo de datos

No se introducen estructuras de datos ni persistencia nuevas. El modal usa estado local (`useState`) para la apertura/cierre, el rol de parentesco y el nombre del niño recibido como prop.

```typescript
type ParentRole = "Mamá" | "Papá" | "Tutor/a";

interface LinkParentModalProps {
  open: boolean;
  onClose: () => void;
  kidName: string; // subtítulo "a {kidName}" y texto del box informativo
}

const INVITATION_CODE = "7K4P9";
```

## Plan de implementación

Cada paso deja la app compilando y visualizable.

1. **Código fijo de invitación:** Usar la constante `INVITATION_CODE = "7K4P9"` como texto estático. El label "Vence en 7 días" es texto fijo también.
2. **Componente client `LinkParentModal`:** Crear `app/components/LinkParentModal.tsx` con `"use client"` y props `open: boolean`, `onClose: () => void`, `kidName: string`. Si `open` es falso retorna `null`. Renderiza overlay de fondo semitransparente (`bg-black/30`) con la tarjeta centrada idéntica al mockup: `max-w-[480px]`, fondo `#FBF4EC`, borde `#ECE0D0`, border-radius 24px, sombra `0 20px 50px -24px rgba(63,54,46,.35)`.
3. **Header del modal:** Fila con dos zonas: izquierda con título "Vincular padre" (Fredoka 18px semibold, `#3F362E`) y subtítulo "a {kidName}" (`#A89A8B`, 13px); derecha, botón X (SVG inline del mockup, 34x34, fondo `#F0E6D8`, color `#94887B`) que llama `onClose`. Fila con `border-bottom` `#ECE0D0`.
4. **Box informativo y campos:** Box azul (`#E3ECFB`, radius 14) con ícono info y texto "Le enviaremos un correo con un código para que active su cuenta. Solo verá el feed de {kidName}." Luego label "NOMBRE DEL PADRE/MADRE" (`#94887B`, 12px, font-extrabold, letter-spacing .7px) con input placeholder "Ej. Diego Fernández", y label "EMAIL" con input tipo email placeholder "correo@ejemplo.com". Inputs con los estilos del mockup: radius 14px, borde 1.5px `#EADFD0`, fondo white, padding 13px 16px.
5. **Selector de PARENTESCO:** Label "PARENTESCO". Fila de 3 botones pill (radius 999px) con gap 9px: "Mamá", "Papá", "Tutor/a". Estado local `parentRole: ParentRole` inicializado en `"Mamá"`. Botón activo: fondo `#CCD8F4`, borde 1.5px `#9FB8EC`, texto `#4E72C8` font-extrabold. Botón inactivo: fondo `#FFFDF9`, borde `#ECE0D0`, texto `#6E6359` font-extrabold. El clic actualiza `parentRole`.
6. **Caja de código de invitación:** Contenedor con borde 1.5px dashed `#E6D08A`, fondo `#FBF1D6`, radius 16, centrado. Label "CÓDIGO DE INVITACIÓN" (`#A88526`, letter-spacing .7px), código `{INVITATION_CODE}` (Fredoka 600, 34px, letter-spacing 7px, `#8A7234`) y "Vence en 7 días" (`#A88526`, 13px).
7. **CTA "Enviar invitación":** Botón full-width con gradiente `#F4977E` → `#EE8164`, texto blanco font-extrabold 15.5px, ícono send SVG inline del mockup, sombra `0 10px 22px -8px rgba(238,129,100,.7)`. El `onClick` valida el email (vacío o inválido muestra error y no cierra) y solo llama `onClose` con email válido.
8. **Disparador en el perfil:** `app/kids/[childId]/page.tsx` es server component con `await params`, por lo que el estado client se aísla en un componente nuevo `app/components/ParentInviteButton.tsx` (`"use client"`) que recibe prop `kidName`, sostiene el estado local `isOpen`, renderiza el botón dashed ("+ Vincular otro padre", estilos actuales del `<span>` en el perfil, usando `PlusIcon` de `@/app/components/icons`) y el `<LinkParentModal>` con `open={isOpen}` y `onClose` que lo cierra. En `app/kids/[childId]/page.tsx` se reemplaza el `<span>` "Vincular otro padre" por `<ParentInviteButton kidName={kid.name} />`.
9. **Verificación visual:** Comparar el modal abierto contra `referencias/pantallas/vincular-padre.dc.html` para confirmar fidelidad, y verificar la apertura/cierre desde el perfil.

## Criterios de aceptación

- [x] Existe `app/components/LinkParentModal.tsx` como componente client con props `open`, `onClose` y `kidName`.
- [x] La opción "Vincular otro padre" del perfil se convierte en un botón y abre el modal al hacer clic.
- [x] El modal se superpone al perfil con fondo semitransparente y tarjeta centrada.
- [x] El header muestra el título "Vincular padre" y el subtítulo "a {Nombre del niño}" dinámico (nombre del perfil activo).
- [x] El botón X del header cierra el modal.
- [x] El box azul muestra el texto informativo con el nombre del niño activo.
- [x] El modal muestra los campos NOMBRE DEL PADRE/MADRE (placeholder "Ej. Diego Fernández") y EMAIL (placeholder "correo@ejemplo.com").
- [x] El selector PARENTESCO muestra "Mamá" seleccionada por defecto y el clic mueve el resaltado entre Mamá/Papá/Tutor/a.
- [x] La caja de código muestra "7K4P9" y "Vence en 7 días".
- [x] El botón "Enviar invitación" cierra el modal.
- [x] El campo EMAIL muestra "Ingresá un email." al dejarlo vacío (blur) y "Ingresá un email válido." con formato inválido, y bloquea "Enviar invitación".
- [x] El error del campo EMAIL se limpia al escribir; con email válido "Enviar invitación" cierra el modal.
- [x] Cada apertura reinicia los campos (nombre/email vacíos, "Mamá" seleccionada).
- [x] La tarjeta respeta colores, tipografías Fredoka/Nunito, border-radius y sombras del mockup.
- [x] Los textos visibles están en español pero el código interno usa identificadores en inglés.
- [x] No se añaden dependencias nuevas de runtime.
- [x] `npm run lint` y `npx tsc --noEmit` pasan sin errores.
- [x] `npm run build` compila correctamente.

## Decisiones tomadas y descartadas

- **Modal (tomado):** Se implementa como overlay modal sobre el perfil, no como página/ruta separada, tal como pidió el usuario.
- **Sin persistencia (tomado):** "Enviar invitación" solo cierra el modal, consistente con los specs anteriores (SPEC 02–04) donde nada se persiste aún. Se descarta agregar el padre a la lista PADRES VINCULADOS o a `app/data/kids.ts`.
- **Nombre del niño dinámico (tomado):** El subtítulo del header y el texto del box usan el nombre del perfil activo. Se descarta hardcodear "Mateo Fernández" para que el modal sea coherente al abrirlo desde cualquier perfil.
- **Selector PARENTESCO interactivo visual (tomado):** Estado local `parentRole` que solo mueve el resaltado de estilo. Se descarta que sea inerte o que modifique datos.
- **Código de invitación fijo (tomado):** "7K4P9" y "Vence en 7 días" hardcodeados como texto estático. Se descarta generación aleatoria, temporizador real o envío de correo.
- **Reseteo en cada apertura (tomado):** Los campos vuelven a sus valores por defecto al abrir. Se descarta conservar lo escrito entre aperturas.
- **Validación de email (tomada):** Se valida formato con una regex simple junto a los mensajes "Ingresá un email." / "Ingresá un email válido.", siguiendo el patrón de validación ya usado en `AddKidModal`. Se descarta validar el campo de nombre o añadir validaciones más estrictas (dominio real, etc.).
- **Estado client aislado del server component (tomado):** Se crea `ParentInviteButton` client para no convertir el page del perfil en client component y conservar `await params` / `generateStaticParams`. Se descarta poner el estado directamente en el page.

## Riesgos identificados

| Riesgo | Mitigación |
| --- | --- |
| Server component del perfil vs. estado client del modal | Aislar trigger + modal en el componente client `ParentInviteButton`; el page sigue siendo server component con `await params`. |
| Fidelidad de sombra/gradiente del botón Enviar invitación | Reutilizar las clases de Tailwind y el gradiente ya validados en `AddKidModal` (mismo `#F4977E → #EE8164` y sombra cálida). |
| Texto dinámico con nombre del niño | El nombre llega como prop `kidName` desde el perfil activo; no depende de estado global ni de persistencia. |

## What is **not** in this spec

- Persistencia — el padre no se agrega a PADRES VINCULADOS ni a `app/data/kids.ts`.
- Envío real de correos ni generación de códigos de invitación.
- Validación del campo NOMBRE DEL PADRE/MADRE — sin feedback de error en ese campo.
- Estados de carga, éxito o error al enviar la invitación.
- Responsive / versión móvil.
- Cambios en `/kids`, `/login`, `/activar-cuenta` u otras rutas.

Cada uno de esos puntos, si llega, va en su propio spec.