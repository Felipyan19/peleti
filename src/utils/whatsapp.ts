/**
 * Agrega un mensaje pre-llenado a un enlace de WhatsApp (wa.me o api.whatsapp.com).
 * Si la URL no es de WhatsApp se devuelve intacta.
 */
export function withWhatsAppMessage(url: string, message: string): string {
  if (!/wa\.me|api\.whatsapp\.com/i.test(url)) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}text=${encodeURIComponent(message)}`;
}

export const DEFAULT_WHATSAPP_MESSAGE =
  "Hola Peleti 👋 Vi su página y me interesa una pieza en resina.";
