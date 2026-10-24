# AGENTS.MD - Proyecto Alimentación

## 1. Descripción del Proyecto

**Nombre del proyecto:** Alimentación  
**Objetivo principal:** Planificar menús semanales y listas de compras para una persona con colesterol alto, organizando recetas y productos por supermercado según el precio más bajo, con comunicación a través de un chat de **Telegram**.  
**Diferenciador clave:** La reducción de grasas debe ser **progresiva**, nunca brusca, para evitar afectar el estado de ánimo del usuario.  
**Condición imperativa:** Todo el software utilizado debe ser **gratuito y de código abierto**. No se usarán herramientas de pago.

---

## 2. Requisitos Funcionales

### 2.1 Planificación de menús semanales
- Generar menús semanales completos (desayuno, comida, cena, merienda).
- Las recetas deben ser aptas para colesterol alto (control de grasas saturadas, colesterol dietético, fibra, etc.).
- La reducción de grasas debe ser progresiva semana a semana.
- Permitir al usuario indicar preferencias, alergias, restricciones y comidas que no le gusten.
- Incluir opciones variadas y realistas de preparar en casa.
- **Permitir al usuario enviar enlaces de recetas de Instagram o YouTube que desee incluir en sus menús semanales.** El sistema deberá extraer la información de la receta (ingredientes, pasos, tiempo de preparación) y validar que sea apta para colesterol alto antes de incluirla.

### 2.2 Lista de compras y supermercados
- Generar lista de productos basada en las recetas del menú semanal.
- Indicar en qué supermercado comprar cada producto según el precio más bajo.
- Permitir comparar precios entre supermercados.
- Agrupar la lista por supermercado para facilitar la compra.

### 2.3 Comunicación por Telegram
- Interfaz principal de interacción: chat de Telegram (vía Telegram Bot API, completamente gratuita y de código abierto).
- El usuario recibe su menú semanal y lista de compras por Telegram.
- El usuario puede responder por Telegram para:
  - Pedir el menú de la semana.
  - Sustituir una receta.
  - Añadir/quitar productos de la lista.
  - Pedir lista de compras por supermercado.
  - Reportar progreso o sensaciones (fatiga, ánimo, etc.).
  - **Enviar enlaces de recetas de Instagram o YouTube que quiera incluir en sus menús.**
- Mensajes claros, breves y con formato legible en móvil.

### 2.4 Control de colesterol y progresividad
- No eliminar grasas de un plumazo. La transición debe ser gradual.
- Semanas iniciales: menús similares a lo que el usuario ya come, con pequeños ajustes saludables.
- Semanas posteriores: introducción progresiva de más fibra, frutas, verduras, legumbres, pescado azul, frutos secos en cantidad controlada, y reducción de grasas saturadas (mantequilla, nata, embutidos, carnes grasas, fritos).
- Monitorear el estado de ánimo del usuario; si muestra signos de depresión o desánimo, frenar la progresión de restricciones.

### 2.5 Recetas externas (Instagram y YouTube)
- El usuario puede enviar enlaces de recetas de Instagram o YouTube por WhatsApp.
- El sistema debe validar que el enlace sea de Instagram o YouTube y extraer la información de la receta (título, ingredientes, pasos, tiempo, porciones).
- Antes de incluir una receta externa en un menú, el sistema debe verificar que sea apta para colesterol alto (grasas saturadas controladas, sin grasas trans, rica en fibra). Si no lo es, el sistema debe notificar al usuario y proponer adaptaciones saludables.
- El usuario debe aprobar explícitamente la inclusión de cada receta externa en su menú semanal.
- Las recetas externas aprobadas se guardan en el catálogo personal del usuario para su reutilización futura.

---

## 3. Tecnología (Todo gratuito y de código abierto)

| Parte | Tecnología | ¿Gratuito? | ¿Código abierto? |
|-------|------------|------------|------------------|
| Repositorio de código | GitHub | Sí | Sí |
| Lenguaje de programación | Node.js + TypeScript | Sí | Sí |
| Base de datos | SQLite (no necesita servidor separado) | Sí | Sí |
| Mensajería | Telegram Bot API | Sí | Sí |
| Precios de supermercados | Búsqueda manual o scraping ético gratuito | Sí | Sí |
| Recetas de Instagram/YouTube | Extracción de información pública gratuita | Sí | Sí |
| Despliegue en la nube | Render o Railway (plan gratuito) | Sí (plan gratis) | No (servicio gratuito) |
| Pruebas | Jest | Sí | Sí |

---

## 4. Normas y Buenas Prácticas

### 4.1 Desarrollo de software
- Usar solo herramientas gratuitas y de código abierto.
- Escribir código limpio y bien organizado.
- No dejar código comentado innecesario.
- Usar nombres de variables y archivos en inglés, comentarios en español.
- Probar que todo funcione antes de entregar.

### 4.2 Seguridad y privacidad
- Los datos de salud del usuario (colesterol, menús, listas) son sensibles.
- No almacenar datos sensibles sin consentimiento explícito.
- Cumplir con GDPR (normativa europea de protección de datos).
- Las claves y tokens de WhatsApp y supermercados se guardan en archivos de configuración privados, nunca en el código público.
- Validar todas las entradas del usuario, incluyendo enlaces de Instagram y YouTube.
- No guardar contenido protegido por derechos de autor de redes sociales; solo guardar los datos necesarios de la receta (ingredientes, pasos resumidos) dando crédito a la fuente cuando sea posible.

### 4.3 UX / UI
- Diseño pensado para usar en el móvil (WhatsApp).
- Mensajes de error amigables y en español.
- Confirmación antes de acciones importantes (ej: "¿Eliminar esta receta?").

### 4.4 Documentación
- Mantener este AGENTS.md actualizado.
- Explicar en lenguaje sencillo cómo usar el sistema (no solo para programadores).

---

## 5. Estructura del Proyecto (carpetas y archivos)

```
alimentacion/
├── .env.example          (ejemplo de configuración, sin claves reales)
├── .gitignore            (archivos que no se suben a GitHub)
├── package.json          (configuración del proyecto)
├── tsconfig.json         (configuración de TypeScript)
├── README.md             (instrucciones en lenguaje sencillo)
├── AGENTS.md             (este archivo)
├── src/
│   ├── domain/           (reglas del negocio: colesterol, menús, recetas)
│   │   ├── user/
│   │   ├── meal-plan/
│   │   ├── recipe/
│   │   ├── product/
│   │   └── supermarket/
│   ├── application/      (casos de uso: generar menú, lista de compras, importar receta)
│   │   ├── generate-weekly-menu.ts
│   │   ├── generate-shopping-list.ts
│   │   ├── compare-prices.ts
│   │   └── import-external-recipe.ts
│   ├── infrastructure/   (conexiones externas: Telegram, base de datos, supermercados, recetas IG/YT)
│   │   ├── telegram/
│   │   ├── database/
│   │   ├── supermarkets/
│   │   └── recipes-external/
│   ├── presentation/     (puntos de entrada: webhook de Telegram)
│   │   └── telegram-webhook.ts
│   └── shared/           (utilidades, errores comunes)
├── tests/
│   ├── unit/
│   └── integration/
└── docs/
    └── adrs/
```

---

## 6. Reglas del Proyecto (Imperativas)

1. **Siempre usar buenas prácticas.** Código limpio, probado y mantenible.
2. **Cumplir las instrucciones al pie de la letra.** No saltarse requisitos del usuario.
3. **Reducción progresiva de grasas.** Nunca eliminar todo el contenido graso de golpe. Respetar el ritmo del usuario para evitar depresión.
4. **Telegram es el canal principal.** Todas las interacciones clave por chat de Telegram.
5. **Precios reales por supermercado.** No inventar precios; usar datos reales o estimados razonables avisando al usuario.
6. **Colesterol como eje central.** Todas las recetas deben ser aptas para colesterol alto, incluidas las de Instagram y YouTube.
7. **Privacidad por diseño.** Los datos del usuario no se comparten con terceros sin consentimiento.
8. **Recetas externas validadas.** Ningún enlace de Instagram o YouTube se incluye sin validar que sea apto para colesterol y sin la aprobación explícita del usuario.
9. **Idioma del proyecto:** Español para comunicación con el usuario y documentación; inglés para código.
10. **Todo gratuito y de código abierto.** No se usarán herramientas de pago.

---

## 7. Flujo de Trabajo Típico

1. Usuario escribe por Telegram: "Quiero mi menú de esta semana".
2. Sistema genera menú semanal adaptado a su colesterol y nivel de progresividad actual.
3. Sistema envía menú por Telegram con resumen de recetas.
4. Usuario confirma o pide cambios (sustituir receta, ajustar porciones).
5. **Usuario puede enviar enlaces de recetas de Instagram o YouTube que quiera incluir; el sistema las valida para colesterol y pide aprobación antes de añadirlas.**
6. Sistema genera lista de compras agrupada por supermercado más barato.
7. Sistema envía lista de compras por Telegram.
8. Usuario puede ir tachando productos o pedir modificaciones.
9. Semanalmente, sistema evalúa progreso y ajusta el nivel de restricción de grasas si el usuario se siente bien.

---

## 8. Métricas de Éxito

- Usuario recibe su menú y lista de compras cada semana sin fallos.
- Reducción progresiva de grasas saturadas en los menús sin que el usuario abandone por frustración.
- Ahorro estimado en la compra al elegir el supermercado más barato por producto.
- Tasa de respuesta y satisfacción del usuario por WhatsApp.

---

## 9. Limitaciones y Consideraciones Éticas

- No somos nutricionistas ni médicos. Las recomendaciones de menú deben incluir un disclaimer: "Consulta con tu médico o nutricionista antes de hacer cambios importantes en tu dieta, especialmente por tu colesterol."
- No prometer curas ni resultados médicos.
- Respetar los términos de uso de WhatsApp Business API y de Instagram/YouTube.
- Respetar los términos de servicio de los supermercados consultados.

---

**Última actualización:** 19 de octubre de 2026  
**Versión:** 1.1  
**Autor:** Equipo de desarrollo del proyecto Alimentación