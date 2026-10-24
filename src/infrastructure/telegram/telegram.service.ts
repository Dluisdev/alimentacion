import axios from 'axios';
import { TELEGRAM_CONFIG } from './telegram.config';

/**
 * Servicio de Telegram.
 * Usa Telegram Bot API (100% gratuita y de código abierto).
 * No hay riesgo de baneo si se usa razonablemente.
 */

export interface TelegramMessage {
  chat_id: string | number;
  text: string;
  parse_mode?: 'Markdown' | 'HTML';
}

export class TelegramService {
  private readonly botToken: string;
  private readonly apiUrl: string;
  private readonly isConfigured: boolean;

  constructor() {
    this.botToken = TELEGRAM_CONFIG.botToken;
    this.apiUrl = `https://api.telegram.org/bot${this.botToken}`;
    this.isConfigured = !!this.botToken;

    if (this.isConfigured) {
      console.log('📱 Telegram Bot configurado y listo');
    } else {
      console.log('📱 Telegram en modo simulador (configura tu token para usar Telegram real)');
    }
  }

  /**
   * Verifica si Telegram está configurado y listo.
   */
  isReady(): boolean {
    return this.isConfigured;
  }

  /**
   * Envía un mensaje de texto por Telegram.
   */
  async sendMessage(chatId: string | number, text: string): Promise<void> {
    if (!this.isReady()) {
      console.log(`📱 [SIMULADOR TELEGRAM] Mensaje a ${chatId}: ${text}`);
      return;
    }

    try {
      await axios.post(`${this.apiUrl}/sendMessage`, {
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
      });
    } catch (error: any) {
      console.error('Error enviando mensaje de Telegram:', error.message);
      throw error;
    }
  }

  /**
   * Envía el menú semanal por Telegram.
   */
  async sendWeeklyMenu(chatId: string | number, menuSummary: string): Promise<void> {
    const text = `🍎 *Tu menú semanal está listo:*\n\n${menuSummary}\n\nResponde con /lista para recibir la lista de compras.`;
    await this.sendMessage(chatId, text);
  }

  /**
   * Envía la lista de compras por Telegram.
   */
  async sendShoppingList(chatId: string | number, listSummary: string): Promise<void> {
    const text = `🛒 *Tu lista de compras:*\n\n${listSummary}\n\nResponde con /ayuda para más opciones.`;
    await this.sendMessage(chatId, text);
  }

  /**
   * Envía un mensaje de bienvenida.
   */
  async sendWelcome(chatId: string | number): Promise<void> {
    const text = `¡Hola! Soy tu asistente de Alimentación. 🍎\n\nPuedo ayudarte con:\n- Tu menú semanal (escribe: /menu)\n- Tu lista de compras (escribe: /lista)\n- Recetas de Instagram o YouTube (envía el enlace)\n- Ayuda (escribe: /ayuda)\n\nTodo adaptado a tu colesterol alto con reducción progresiva de grasas.`;
    await this.sendMessage(chatId, text);
  }
}

// Instancia singleton del servicio
export const telegramService = new TelegramService();