/**
 * Configuración de Telegram Bot API.
 * Lee el token desde el archivo .env
 */

import dotenv from 'dotenv';

// Cargar variables de entorno desde .env
dotenv.config();

export interface TelegramConfig {
  botToken: string;
  webhookUrl?: string;
}

export const TELEGRAM_CONFIG: TelegramConfig = {
  botToken: process.env.TELEGRAM_BOT_TOKEN || '',
  webhookUrl: process.env.TELEGRAM_WEBHOOK_URL,
};