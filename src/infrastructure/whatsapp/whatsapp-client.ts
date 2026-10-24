// Plantilla para la conexión con WhatsApp.
// Se puede usar WhatsApp Business API (Meta) o Twilio.
// Ambas tienen versiones gratuitas/trial para empezar.

import axios from 'axios';

export interface WhatsAppMessage {
  to: string;
  text: string;
}

export class WhatsAppClient {
  private readonly apiUrl: string;
  private readonly token: string;

  constructor(apiUrl: string, token: string) {
    this.apiUrl = apiUrl;
    this.token = token;
  }

  /**
   * Envía un mensaje de texto por WhatsApp.
   */
  async sendMessage(message: WhatsAppMessage): Promise<void> {
    try {
      // Aquí iría la llamada real a la API de WhatsApp
      // Por ahora solo registramos que se enviaría
      console.log(`📱 WhatsApp mensaje a ${message.to}: ${message.text}`);
    } catch (error) {
      console.error('Error enviando mensaje de WhatsApp:', error);
      throw error;
    }
  }

  /**
   * Envía el menú semanal por WhatsApp.
   */
  async sendWeeklyMenu(to: string, menuSummary: string): Promise<void> {
    await this.sendMessage({
      to,
      text: `🍎 Tu menú semanal está listo:\n\n${menuSummary}\n\nResponde con "lista" para recibir la lista de compras.`,
    });
  }

  /**
   * Envía la lista de compras por WhatsApp.
   */
  async sendShoppingList(to: string, listSummary: string): Promise<void> {
    await this.sendMessage({
      to,
      text: `🛒 Tu lista de compras:\n\n${listSummary}\n\nResponde con "ayuda" para más opciones.`,
    });
  }
}