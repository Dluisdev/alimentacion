/**
 * Configuración de WhatsApp.
 * Copia este archivo a whatsapp.config.local.ts y rellena tus valores reales.
 * NUNCA subas el archivo con claves reales a GitHub.
 */

export interface WhatsAppConfig {
  provider: 'meta' | 'twilio' | 'none';
  // WhatsApp Business API (Meta)
  metaAccessToken?: string;
  metaPhoneNumberId?: string;
  metaVerifyToken?: string;
  // Twilio
  twilioAccountSid?: string;
  twilioAuthToken?: string;
  twilioFromNumber?: string;
  // Webhook URL (donde WhatsApp enviará los mensajes)
  webhookUrl?: string;
}

/**
 * Configuración por defecto: sin proveedor (modo simulador).
 * Cuando tengas tus claves de WhatsApp, cambia provider a 'meta' o 'twilio'
 * y rellena los campos correspondientes.
 */
export const WHATSAPP_CONFIG: WhatsAppConfig = {
  provider: 'none', // 'none' = simulador, 'meta' = WhatsApp Business API, 'twilio' = Twilio
};