import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'MY PACK MX <noreply@mypackmx.com>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const LAREDO_ADDRESS = process.env.LAREDO_WAREHOUSE_ADDRESS || '123 Warehouse St, Laredo, TX 78040';
const LAREDO_PHONE = process.env.LAREDO_WAREHOUSE_PHONE || '+1 956 123 4567';

export interface SendGuideEmailParams {
  to: string;
  customerName: string;
  trackingNumber: string;
  pdfBuffer: Buffer;
  destinationCity: string;
  destinationState: string;
}

export interface SendStatusUpdateEmailParams {
  to: string;
  customerName: string;
  trackingNumber: string;
  newStatus: string;
  location?: string;
  estimatedDelivery?: string;
}

/**
 * Sends the shipping guide email with PDF attachment
 */
export async function sendGuideEmail(params: SendGuideEmailParams) {
  const { to, customerName, trackingNumber, pdfBuffer, destinationCity, destinationState } = params;
  
  const trackingUrl = `${APP_URL}/tracking/${trackingNumber}`;
  
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: `Tu guía MY PACK MX - ${trackingNumber}`,
      html: generateGuideEmailHTML({
        customerName,
        trackingNumber,
        trackingUrl,
        destinationCity,
        destinationState,
      }),
      attachments: [
        {
          filename: `guia-${trackingNumber}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    if (error) {
      console.error('Error sending guide email:', error);
      throw new Error(`Failed to send guide email: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in sendGuideEmail:', error);
    throw error;
  }
}

/**
 * Sends a status update notification email
 */
export async function sendStatusUpdateEmail(params: SendStatusUpdateEmailParams) {
  const { to, customerName, trackingNumber, newStatus, location, estimatedDelivery } = params;
  
  const trackingUrl = `${APP_URL}/tracking/${trackingNumber}`;
  
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: `Actualización de tu envío - ${trackingNumber}`,
      html: generateStatusUpdateEmailHTML({
        customerName,
        trackingNumber,
        trackingUrl,
        newStatus,
        location,
        estimatedDelivery,
      }),
    });

    if (error) {
      console.error('Error sending status update email:', error);
      throw new Error(`Failed to send status update email: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in sendStatusUpdateEmail:', error);
    throw error;
  }
}

/**
 * Generates HTML for the guide email
 */
function generateGuideEmailHTML(data: {
  customerName: string;
  trackingNumber: string;
  trackingUrl: string;
  destinationCity: string;
  destinationState: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9fafb; }
          .tracking-number { font-size: 24px; font-weight: bold; color: #2563eb; text-align: center; margin: 20px 0; }
          .button { display: inline-block; background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
          .info-box { background-color: white; border-left: 4px solid #16a34a; padding: 15px; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>¡Pago Confirmado!</h1>
            <p>Tu guía de envío MY PACK MX</p>
          </div>
          
          <div class="content">
            <p>Hola ${data.customerName},</p>
            
            <p>¡Gracias por confiar en MY PACK MX! Tu pago ha sido confirmado y tu guía de envío está lista.</p>
            
            <div class="tracking-number">${data.trackingNumber}</div>
            
            <p style="text-align: center;">
              <a href="${data.trackingUrl}" class="button">Rastrear mi envío</a>
            </p>
            
            <div class="info-box">
              <h3>📦 Destino:</h3>
              <p>${data.destinationCity}, ${data.destinationState}</p>
            </div>
            
            <div class="info-box">
              <h3>📋 Instrucciones importantes:</h3>
              <p><strong>Opción A - Con guía impresa:</strong></p>
              <ol>
                <li>Descarga e imprime la guía adjunta en este email</li>
                <li>Pégala en tu paquete de forma visible</li>
                <li>Lleva tu paquete a nuestra bodega en Laredo</li>
              </ol>
              
              <p><strong>Opción B - Sin guía impresa:</strong></p>
              <ol>
                <li>Lleva tu paquete a nuestra bodega en Laredo</li>
                <li>Menciona tu número de guía: <strong>${data.trackingNumber}</strong></li>
                <li>Nuestro personal imprimirá y pegará la guía por ti</li>
              </ol>
            </div>
            
            <div class="info-box">
              <h3>📍 Bodega en Laredo:</h3>
              <p><strong>Dirección:</strong> ${LAREDO_ADDRESS}</p>
              <p><strong>Teléfono:</strong> ${LAREDO_PHONE}</p>
              <p><strong>Horario:</strong> Lunes a Viernes 9:00 AM - 6:00 PM</p>
            </div>
            
            <p>Tu envío está siendo procesado. Una vez que asignemos la ruta, podrás ver el seguimiento completo en nuestro sistema de rastreo.</p>
            
            <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
            
            <p>Saludos,<br><strong>Equipo MY PACK MX</strong></p>
          </div>
          
          <div class="footer">
            <p>MY PACK MX - Envíos de USA a México</p>
            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Generates HTML for the status update email
 */
function generateStatusUpdateEmailHTML(data: {
  customerName: string;
  trackingNumber: string;
  trackingUrl: string;
  newStatus: string;
  location?: string;
  estimatedDelivery?: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9fafb; }
          .status-box { background-color: #16a34a; color: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
          .tracking-number { font-size: 18px; font-weight: bold; color: #2563eb; margin: 10px 0; }
          .button { display: inline-block; background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
          .info-item { margin: 10px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Actualización de tu envío</h1>
          </div>
          
          <div class="content">
            <p>Hola ${data.customerName},</p>
            
            <p>Tu envío ha sido actualizado:</p>
            
            <div class="status-box">
              <h2 style="margin: 0;">${data.newStatus}</h2>
            </div>
            
            <div class="info-item">
              <strong>Número de guía:</strong> ${data.trackingNumber}
            </div>
            
            ${data.location ? `
              <div class="info-item">
                <strong>Ubicación:</strong> ${data.location}
              </div>
            ` : ''}
            
            ${data.estimatedDelivery ? `
              <div class="info-item">
                <strong>Entrega estimada:</strong> ${data.estimatedDelivery}
              </div>
            ` : ''}
            
            <p style="text-align: center;">
              <a href="${data.trackingUrl}" class="button">Ver detalles completos</a>
            </p>
            
            <p>Gracias por usar MY PACK MX.</p>
            
            <p>Saludos,<br><strong>Equipo MY PACK MX</strong></p>
          </div>
          
          <div class="footer">
            <p>MY PACK MX - Envíos de USA a México</p>
            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

