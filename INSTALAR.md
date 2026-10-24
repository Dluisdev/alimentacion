# 📥 Cómo poner el proyecto en marcha (instrucciones para no programadores)

Este archivo te explica, paso a paso y en lenguaje sencillo, qué necesitas hacer para que el programa funcione.

## Paso 1: Instalar Node.js

Node.js es el programa que permite ejecutar el código de este proyecto.

1. Ve a https://nodejs.org/
2. Descarga la versión **"LTS"** (la que dice "Recomendado para la mayoría de los usuarios").
3. Instálala como cualquier otro programa (siguiente, siguiente, aceptar).
4. Para verificar que se instaló bien, abre una terminal (cmd o PowerShell) y escribe:
   ```
   node -v
   ```
   Deberías ver algo como `v20.10.0` o similar.

## Paso 2: Abrir una terminal en la carpeta del proyecto

1. Ve a la carpeta `C:\Users\falle\Desktop\Alimentación`
2. Haz clic derecho en una zona vacía de la carpeta
3. Selecciona "Abrir en Terminal" o "Abrir PowerShell aquí"

## Paso 3: Instalar las dependencias del proyecto

En la terminal que se abrió, escribe:

```
npm install
```

Esto descargará todas las herramientas que necesita el programa (se tarda un minuto).

## Paso 4: Configurar las variables de entorno

1. Copia el archivo `.env.example` y ponle el nombre `.env` (sin el ".example").
2. Abre el archivo `.env` con el Bloc de notas.
3. Rellena los valores que necesites (puedes dejar los de ejemplo por ahora para probar).
4. Guarda el archivo.

## Paso 5: Iniciar el programa

En la terminal, escribe:

```
npm run dev
```

Verás algo como:
```
🍎 Servidor Alimentación corriendo en el puerto 3000
🚀 Servidor escuchando en el puerto 3000
```

¡El programa está funcionando!

## Paso 6: Conectar WhatsApp

Para usar WhatsApp, necesitas configurar el webhook con WhatsApp Business API (Meta) o Twilio. Ambos tienen versiones gratuitas para empezar.

Cuando estés listo, dímelo y te guío por este proceso.

---

## ¿Necesitas ayuda?

Si en cualquier paso te atascas, dímelo y te ayudo. No necesitas saber programar para usar este sistema; solo necesitas seguir estas instrucciones.

---

**Versión:** 1.0  
**Fecha:** 19 de octubre de 2026