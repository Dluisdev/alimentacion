import { WhatsAppClient, WhatsAppMessage } from './whatsapp-client';
import { WHATSAPP_CONFIG } from './whatsapp.config';

/**
 * Servicio de WhatsApp.
 * Abstrae la proveedora (Meta o Twilio) para que el resto del programa
 * no tenga que preocuparse por detalles técnicos.
 */

export class WhatsAppService {
  private client: WhatsAppClient | null = null;
  private provider: string = 'none';

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    const config = WHATSAPP_CONFIG;

    if (config.provider === 'meta' && config.metaAccessToken && config.metaPhoneNumberId) {
      this.client = new WhatsAppClient(
        `https://graph.facebook.com/v18.0/${config.metaPhoneNumberId}/messages`,
        config.metaAccessToken
      );
      this.provider = 'meta';
      console.log('📱 WhatsApp conectado mediante Meta Business API');
    } else if (config.provider === 'twilio' && config.twilioAccountSid && config.twilioAuthToken) {
      this.client = new WhatsAppClient(
        `https://api.twilio.com/2010-04-01/Accounts/${config.twilioAccountSid}/Messages.json`,
        config.twilioAuthToken
      );
      this.provider = 'twilio';
      console.log('📱 WhatsApp conectado mediante Twilio');
    } else {
      console.log('📱 WhatsApp en modo simulador (configura tus claves para usar WhatsApp real)');
      this.provider = 'none';
    }
  }

  /**
   * Verifica si WhatsApp está configurado y listo para enviar mensajes.
   */
  isReady(): boolean {
    return this.client !== null && this.provider !== 'none';
  }

  /**
   * Devuelve el proveedor actual.
   */
  getProvider(): string {
    return this.provider;
  }

  /**
   * Envía un mensaje de texto por WhatsApp.
   */
  async sendMessage(to: string, text: string): Promise<void> {
    if (!this.isReady()) {
      console.log(`📱 [SIMULADOR] Mensaje a ${to}: ${text}`);
      return;
    }

    const message: WhatsAppMessage = { to, text };
    await this.client!.sendMessage(message);
  }

  /**
   * Envía el menú semanal por WhatsApp.
   */
  async sendWeeklyMenu(to: string, menuSummary: string): Promise<void> {
    const text = `🍎 *Tu menú semanal está listo:*\n\n${menuSummary}\n\nResponde con "lista" para recibir la lista de compras.`;
    await this.sendMessage(to, text);
  }

  /**
   * Envía la lista de compras por WhatsApp.
   */
  async sendShoppingList(to: string, listSummary: string): Promise<void> {
    const text = `🛒 *Tu lista de compras:*\n\n${listSummary}\n\nResponde con "ayuda" para más opciones.`;
    await this.sendMessage(to, text);
  }

  /**
   * Envía un mensaje de bienvenida.
   */
  async sendWelcome(to: string): Promise<void> {
    const text = `¡Hola! Soy tu asistente de Alimentación. 🍎\n\nPuedo ayudarte con:\n- Tu menú semanal (escribe: menú)\n- Tu lista de compras (escribe: lista)\n- Recetas de Instagram o YouTube (envía el enlace)\n- Ayuda (escribe: ayuda)\n\nTodo adaptado a tu colesterol alto con reducción progresiva de grasas.`;
    await this.sendMessage(to, text);
  }
}

// Instancia singleton del servicio
export const whatsappService = new WhatsAppService();