# 📱 Cómo crear tu bot de Telegram (gratis, 2 minutos)

Esta guía te explica, paso a paso y en lenguaje sencillo, cómo crear tu bot de Telegram para que el programa te envíe mensajes directamente a tu móvil.

No necesitas saber programar. Solo sigue los pasos.

---

## Paso 1: Abrir Telegram

1. Abre la app de Telegram en tu móvil o en tu ordenador (web.telegram.org)
2. Busca a **@BotFather** (es el bot oficial de Telegram para crear otros bots)

## Paso 2: Crear tu bot

1. Envía el comando: `/newbot`
2. El BotFather te pedirá un nombre para tu bot. Ejemplo: "Mi Asistente de Alimentación"
3. Luego te pedirá un nombre de usuario (debe terminar en "bot"). Ejemplo: "mi_alimentacion_bot"
4. Cuando termines, el BotFather te dará un **token** que se ve algo así:
   `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`

**¡Guarda ese token!** Lo necesitarás en el siguiente paso.

## Paso 3: Configurar tu programa

1. Abre el archivo `.env` en tu carpeta `C:\Users\falle\Desktop\Alimentación`
2. Busca la línea `TELEGRAM_BOT_TOKEN=` y pega tu token:

```
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
```

3. Guarda el archivo

## Paso 4: Reiniciar tu programa

1. En la ventana negra (CMD) donde tienes el programa corriendo, presiona **Ctrl + C** para detenerlo
2. Vuelve a escribir:
   ```
   npm run dev
   ```

Si todo está bien configurado, verás un mensaje como:
```
📱 Telegram Bot configurado y listo
```

## Paso 5: Hablar con tu bot

1. En Telegram, busca a tu bot (por el nombre de usuario que elegiste, ej: `@mi_alimentacion_bot`)
2. Envía `/start` o cualquier mensaje
3. ¡Tu bot responderá!

---

## Ventajas de usar Telegram

| Ventaja | Explicación |
|---------|-------------|
| ✅ 100% gratuito | Sin límites de costo, sin cuotas mensuales |
| ✅ Sin riesgo de baneo | Telegram permite bots libremente |
| ✅ Código abierto | Su API es pública y abierta |
| ✅ Fácil de configurar | Solo necesitas un token de @BotFather |
| ✅ Funciona en móvil y ordenador | Puedes usar Telegram en cualquier dispositivo |

---

## ¿Necesitas ayuda?

Si en cualquier paso te atascas, dímelo y te guío personalmente.

---

**Versión:** 1.0  
**Fecha:** 19 de octubre de 2026