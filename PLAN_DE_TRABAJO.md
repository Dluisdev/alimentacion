# PLAN DE TRABAJO - Proyecto Alimentación

**Versión:** 1.1  
**Fecha:** 19 de octubre de 2026  
**Orquestador:** Yo (agente principal)  
**Carpeta del proyecto:** `C:\Users\falle\Desktop\Alimentación`  
**Usuario:** No programador, no sabe crear repositorios. Yo me encargo de todo lo técnico.

---

## 1. Resumen Ejecutivo

Este plan define cómo vamos a crear el proyecto **Alimentación** paso a paso, usando solo herramientas gratuitas y de código abierto.

Yo seré el **Orquestador**: yo creo todos los archivos, configuro el repositorio, enseño a los subagentes qué hacer, y voy integrando todo. Tú (el usuario) solo tendrás que:
1. Decirme qué quieres en cada etapa.
2. Probar el sistema por WhatsApp cuando esté listo.
3. Enviarme los enlaces de recetas de Instagram o YouTube que quieras incluir.

Tú **no necesitas instalar nada complejo ni crear repositorios**. Yo hago el trabajo técnico.

---

## 2. Subagentes Necesarios (10 en total, incluyendo al Orquestador)

| # | Subagente | Rol principal | Qué hace (en lenguaje sencillo) |
|---|-----------|---------------|----------------------------------|
| 1 | **Backend Agent** | Servidor del programa | Crea el "cerebro" del sistema que procesa menús y compras |
| 2 | **Database Agent** | Base de datos | Guarda tus recetas, menús y listas de forma segura |
| 3 | **WhatsApp Agent** | Chat de WhatsApp | Conecta el sistema con tu WhatsApp para enviar y recibir mensajes |
| 4 | **Nutrition Agent** | Colesterol y dieta | Asegura que todas las recetas sean aptas para colesterol alto |
| 5 | **Prices Agent** | Precios de supermercados | Busca en qué supermercado es más barato cada producto |
| 6 | **Recetas Agent** | Recetas de Instagram y YouTube | Extrae la información de los enlaces que me envíes y las adapta a tu colesterol |
| 7 | **QA Agent** | Pruebas y calidad | Prueba que todo funcione correctamente antes de entregártelo |
| 8 | **DevOps Agent** | Instalación y puesta en marcha | Configura el servidor gratuito donde vivirá el programa |
| 9 | **Docs Agent** | Documentación | Escribe las instrucciones en lenguaje sencillo para que tú puedas usarlo |
| 10 | **Orchestrator (yo)** | Coordinación general | Organizo todo, enseño a los agentes, integro el trabajo y hablo contigo |

---

## 3. Tecnologías que usaremos (Todas gratuitas)

| Para qué | Tecnología | Costo |
|----------|------------|-------|
| Guardar el código | GitHub | Gratis |
| Lenguaje del programa | Node.js + TypeScript | Gratis |
| Base de datos | SQLite | Gratis |
| WhatsApp | WhatsApp Business API o Twilio (trial) | Gratis (trial) |
| Precios de supermercados | Búsqueda ética gratuita | Gratis |
| Recetas de Instagram/YouTube | Extracción de datos públicos | Gratis |
| Servidor en internet | Render o Railway (plan gratuito) | Gratis |

---

## 4. Línea de Tiempo del Proyecto (9 semanas aprox.)

```
Semana 1: Fase 1 - Crear la base del proyecto (repositorio, código inicial)
Semana 2: Fase 2 - Reglas de colesterol y cómo generar menús
Semana 3: Fase 3 - Base de datos para guardar tu información
Semana 4: Fase 4 - Conectar con WhatsApp
Semana 5: Fase 5 - Buscar precios en supermercados
Semana 6: Fase 6 - Importar tus recetas de Instagram y YouTube
Semana 7: Fase 7 - Probar que todo funcione
Semana 8: Fase 8 - Publicar en internet y escribir instrucciones
Semana 9: Fase 9 - Probar contigo por WhatsApp y ajustar
```

### Diagrama visual (línea de tiempo)

```
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│  Semana 1   │  Semana 2   │  Semana 3   │  Semana 4   │  Semana 5   │
│  Base del   │  Reglas de  │  Base de    │  WhatsApp   │  Precios    │
│  proyecto   │  colesterol │  datos      │             │  supermer.  │
├─────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│  Semana 6   │  Semana 7   │  Semana 8   │  Semana 9   │             │
│  Recetas    │  Pruebas    │  Publicar   │  Piloto     │             │
│  IG/YouTube │  calidad    │  en internet│  contigo    │             │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
```

---

## 5. Qué haré yo en cada fase (y qué necesito de ti)

### Fase 1 - Semana 1: Crear la base
**Yo hago:** Creo el repositorio en GitHub, configuro todos los archivos técnicos, instalo las herramientas necesarias.  
**Tú haces:** Nada todavía. Solo esperas a que te diga que está listo.

### Fase 2 - Semana 2: Reglas de colesterol
**Yo hago:** Configuro las reglas para que las recetas sean aptas para colesterol alto y la reducción sea progresiva.  
**Tú haces:** Puedes contarme qué comidas te gustan y cuáles no, si tienes alergias o cosas que no puedes comer.

### Fase 3 - Semana 3: Base de datos
**Yo hago:** Configuro donde se guardarán tus menús, recetas y listas de compras de forma segura.  
**Tú haces:** Nada.

### Fase 4 - Semana 4: WhatsApp
**Yo hago:** Conecto el sistema con tu WhatsApp para que puedas recibir menús y enviar mensajes.  
**Tú haces:** Me das tu número de WhatsApp (opcional, para pruebas) o esperamos a la fase final.

### Fase 5 - Semana 5: Precios de supermercados
**Yo hago:** Configuro el sistema para buscar en qué supermercado es más barato cada producto.  
**Tú haces:** Me dices qué supermercados sueles ir (Mercadona, Carrefour, Lidl, Aldi, etc.).

### Fase 6 - Semana 6: Recetas de Instagram y YouTube
**Yo hago:** Configuro el sistema para que puedas enviarme enlaces de recetas y yo las incluyo en tu menú.  
**Tú haces:** Me envías los enlaces de las recetas de Instagram o YouTube que siempre has querido hacer.

### Fase 7 - Semana 7: Pruebas
**Yo hago:** Pruebo que todo funcione correctamente.  
**Tú haces:** Nada.

### Fase 8 - Semana 8: Publicar y escribir instrucciones
**Yo hago:** Subo el programa a un servidor gratuito en internet y escribo instrucciones sencillas para ti.  
**Tú haces:** Nada.

### Fase 9 - Semana 9: Piloto contigo
**Yo hago:** Te enseño a usar el sistema por WhatsApp y hacemos ajustes según lo que necesites.  
**Tú haces:** Pruebas el sistema, me dices qué te gusta y qué cambiarías.

---

## 6. Reglas de Oro del Proyecto

1. **Todo gratuito y de código abierto.** No gastarás dinero en herramientas.
2. **Tú no necesitas saber programar.** Yo hago todo lo técnico.
3. **Reducción progresiva de grasas.** Nada de cambios bruscos en tu dieta.
4. **WhatsApp es tu canal principal.** Te comunicas conmigo a través del chat.
5. **Tus recetas de Instagram y YouTube son bienvenidas.** Las incluyo en tus menús.
6. **Colesterol alto como prioridad.** Todas las recetas son aptas para tu condición.
7. **Tu privacidad está protegida.** Tus datos de salud no se comparten con nadie.

---

## 7. Próximo Paso Inmediato

Estoy listo para empezar la **Fase 1**. Como tú no sabes crear repositorios ni configurar nada técnico, yo lo haré todo por ti.

**¿Quieres que empiece ahora con la Fase 1?** Solo tienes que decirme "sí" y yo comienzo a crear todos los archivos del proyecto.