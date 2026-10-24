# 📱 Cómo configurar WhatsApp para tu proyecto Alimentación

Esta guía te explica, paso a paso y en lenguaje sencillo, cómo conectar tu programa con WhatsApp de verdad para que recibas los mensajes en tu móvil.

No necesitas saber programar. Solo sigue los pasos.

---

## Opción A: WhatsApp Business API (Meta) - Oficial

Esta es la API oficial de WhatsApp. Es gratuita para empezar pero requiere que verifiques tu negocio en Facebook.

### Paso 1: Crear una cuenta de desarrollador en Meta

1. Ve a https://developers.facebook.com/
2. Inicia sesión con tu cuenta de Facebook
3. Haz clic en "Mi Aplicaciones" → "Crear aplicación"
4. Elige "Negocio" y sigue los pasos

### Paso 2: Configurar WhatsApp en tu aplicación

1. En tu aplicación de Meta, busca "WhatsApp" en el menú de productos
2. Haz clic en "Configurar" o "Empezar"
3. Te pedirá verificar tu número de teléfono de negocio
4. Sigue los pasos hasta obtener:
   - **Access Token** (token de acceso)
   - **Phone Number ID** (ID de tu número de teléfono)

### Paso 3: Configurar el webhook

1. En tu aplicación de Meta, busca la sección de "Webhooks"
2. Configura la URL de tu webhook (cuando despliegues tu programa en internet)
   - Ejemplo: `https://tu-servidor.com/webhook`
3. Elige los campos de suscripción: `messages`, `messaging_postbacks`

### Paso 4: Copiar las claves a tu archivo .env

Abre el archivo `.env` en tu carpeta `C:\Users\falle\Desktop\Alimentación` y rellena:

```
WHATSAPP_PROVIDER=meta
WHATSAPP_META_ACCESS_TOKEN=tu_token_de_meta_aqui
WHATSAPP_META_PHONE_NUMBER_ID=tu_id_de_telefono_aqui
WHATSAPP_META_VERIFY_TOKEN=tu_token_de_verificacion_aqui
```

---

## Opción B: Twilio - Más fácil y rápido

Twilio es un servicio que te da un número de WhatsApp para pruebas. Es más rápido de configurar pero tiene límites en la versión gratuita.

### Paso 1: Crear cuenta en Twilio

1. Ve a https://www.twilio.com/
2. Regístrate con tu email
3. Verifica tu número de teléfono

### Paso 2: Activar WhatsApp en Twilio

1. En el panel de Twilio, busca "Messaging" → "WhatsApp"
2. Activa el canal de WhatsApp (sigue los pasos, es gratuito para pruebas)
3. Te darán un número de WhatsApp de Twilio para pruebas

### Paso 3: Obtener tus credenciales

En el panel de Twilio busca:
- **Account SID** (identificador de tu cuenta)
- **Auth Token** (tu contraseña de API)

### Paso 4: Copiar las claves a tu archivo .env

Abre el archivo `.env` en tu carpeta `C:\Users\falle\Desktop\Alimentación` y rellena:

```
WHATSAPP_PROVIDER=twilio
WHATSAPP_TWILIO_ACCOUNT_SID=tu_account_sid_aqui
WHATSAPP_TWILIO_AUTH_TOKEN=tu_auth_token_aqui
WHATSAPP_TWILIO_FROM_NUMBER=whatsapp:+14155238886 (el número que te dé Twilio)
```

---

## Paso final: Reiniciar tu programa

Después de editar el archivo `.env`:

1. Guarda el archivo
2. En la ventana negra (CMD) donde tienes el programa corriendo, presiona **Ctrl + C** para detenerlo
3. Vuelve a escribir:
   ```
   npm run dev
   ```

Si todo está bien configurado, verás un mensaje como:
```
📱 WhatsApp conectado mediante Meta Business API
```
o
```
📱 WhatsApp conectado mediante Twilio
```

---

## Mientras tanto: Usar el simulador

Si aún no has configurado WhatsApp real, puedes seguir probando con el simulador:

```
http://localhost:3000/test
```

Escribe mensajes como si estuvieras en WhatsApp y el sistema te responderá.

---

## ¿Necesitas ayuda?

Si en cualquier paso te atascas, dímelo y te guío personalmente. No tienes que hacer esto solo.

---

**Versión:** 1.0  
**Fecha:** 19 de octubre de 2026