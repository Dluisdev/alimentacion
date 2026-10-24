import dotenv from 'dotenv';
import { createServer } from './presentation/whatsapp-webhook';

// Cargar variables de entorno desde .env al iniciar
dotenv.config();

// Puerto del servidor (por defecto 3000)
const PORT = process.env.PORT || 3000;

// Iniciar el servidor
createServer(Number(PORT))
  .then(() => {
    console.log(`🍎 Servidor Alimentación corriendo en el puerto ${PORT}`);
    if (process.env.TELEGRAM_BOT_TOKEN) {
      console.log('📱 Token de Telegram detectado');
    } else {
      console.log('📱 No se encontró token de Telegram (modo simulador)');
    }
  })
  .catch((error: Error) => {
    console.error('❌ Error al iniciar el servidor:', error.message);
    process.exit(1);
  });