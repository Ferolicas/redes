import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY!)

export const sendPurchaseEmail = async (
  email: string,
  name: string,
  ketoCode: string,
  productTitle: string,
  downloadUrl?: string
) => {
  const { data, error } = await resend.emails.send({
    from: 'Planeta Keto <noreply@planetaketo.es>',
    to: [email],
    subject: `¡Gracias por tu compra! - ${productTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">¡Gracias ${name}!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Tu compra se ha procesado exitosamente</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333;">Detalles de tu compra:</h2>
          <p><strong>Producto:</strong> ${productTitle}</p>
          <p><strong>Código de transacción:</strong> ${ketoCode}</p>
          <p><strong>Contraseña de acceso:</strong> KETOPAGO1234*</p>
          
          ${downloadUrl ? `
            <div style="margin: 30px 0; text-align: center;">
              <a href="${downloadUrl}" 
                 style="background: #667eea; color: white; padding: 15px 30px; 
                        text-decoration: none; border-radius: 5px; display: inline-block;
                        font-weight: bold;">
                Descargar ${productTitle}
              </a>
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">
                Este enlace es válido para 2 descargas únicamente
              </p>
            </div>
          ` : `
            <div style="margin: 30px 0; padding: 20px; background: #e3f2fd; border-radius: 5px;">
              <p><strong>Próximos pasos:</strong></p>
              <p>Nos pondremos en contacto contigo en las próximas 24 horas para coordinar tu ${productTitle}.</p>
              <p>Si tienes alguna duda, puedes contactarnos respondiendo a este email.</p>
            </div>
          `}
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          
          <p style="text-align: center; color: #666; font-size: 14px;">
            ¿Necesitas ayuda? Responde a este email<br>
            <a href="https://planetaketo.es" style="color: #667eea;">planetaketo.es</a>
          </p>
        </div>
      </div>
    `,
  })

  if (error) {
    console.error('Error sending email:', error)
    throw error
  }

  return data
}

export const sendPurchaseEmailWithNewsletter = async (
  email: string,
  name: string,
  ketoCode: string,
  productTitle: string,
  password: string,
  subscribedToNewsletter: boolean = false,
  downloadUrl?: string
) => {
  const { data, error } = await resend.emails.send({
    from: 'Planeta Keto <noreply@planetaketo.es>',
    to: [email],
    subject: `¡Gracias por tu compra! - ${productTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">¡Gracias ${name}!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Tu compra se ha procesado exitosamente</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333;">Detalles de tu compra:</h2>
          <p><strong>Producto:</strong> ${productTitle}</p>
          <p><strong>Código de transacción:</strong> ${ketoCode}</p>
          <p><strong>Contraseña de acceso:</strong> ${password}</p>
          
          ${downloadUrl ? `
            <div style="margin: 30px 0; text-align: center;">
              <a href="${downloadUrl}" 
                 style="background: #667eea; color: white; padding: 15px 30px; 
                        text-decoration: none; border-radius: 5px; display: inline-block;
                        font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
                📚 Descargar ${productTitle}
              </a>
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">
                Este enlace es válido para 2 descargas únicamente
              </p>
            </div>
            
            <div style="margin: 30px 0; padding: 20px; background: #e8f5e8; border-radius: 8px; border-left: 4px solid #4caf50;">
              <h3 style="margin: 0 0 10px 0; color: #2e7d32;">¿Cómo descargar tu libro?</h3>
              <ol style="margin: 0; padding-left: 20px; color: #333;">
                <li>Haz clic en el botón verde de arriba</li>
                <li>Se abrirá tu descarga automáticamente</li>
                <li>Guarda el PDF en tu dispositivo</li>
                <li>¡Disfruta leyendo tu nueva guía!</li>
              </ol>
            </div>
          ` : `
            <div style="margin: 30px 0; padding: 20px; background: #e3f2fd; border-radius: 5px;">
              <p><strong>Próximos pasos:</strong></p>
              <p>Nos pondremos en contacto contigo en las próximas 24 horas para coordinar tu ${productTitle}.</p>
              <p>Si tienes alguna duda, puedes contactarnos respondiendo a este email.</p>
            </div>
          `}
          
          ${subscribedToNewsletter ? `
            <div style="margin: 30px 0; padding: 20px; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
              <h3 style="margin: 0 0 10px 0; color: #856404;">🎉 ¡Bienvenido a nuestro Newsletter!</h3>
              <p style="margin: 0; color: #333;">
                Te has suscrito exitosamente. Recibirás notificaciones sobre nuevos productos, promociones especiales 
                y un <strong>20% de descuento permanente</strong> en futuras compras.
              </p>
            </div>
          ` : ''}
          
          <div style="margin: 30px 0; padding: 20px; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
            <h3 style="margin: 0 0 10px 0; color: #856404;">📋 Información importante:</h3>
            <ul style="margin: 0; padding-left: 20px; color: #333;">
              <li><strong>Descargas permitidas:</strong> Máximo 2 por seguridad</li>
              <li><strong>Formato:</strong> PDF optimizado para todos los dispositivos</li>
              <li><strong>Soporte:</strong> Responde a este email si tienes dudas</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <h3 style="color: #333; margin-bottom: 15px;">🌟 ¡Comienza tu transformación hoy!</h3>
            <p style="color: #666; margin-bottom: 20px;">
              Tu nueva guía contiene todo lo que necesitas para comenzar exitosamente con la dieta keto.
            </p>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          
          <p style="text-align: center; color: #666; font-size: 14px;">
            ¿Necesitas ayuda? Escríbenos a <a href="mailto:info@planetaketo.es" style="color: #667eea;">info@planetaketo.es</a><br>
            <a href="https://store.planetaketo.es" style="color: #667eea; text-decoration: none;">🌐 store.planetaketo.es</a>
          </p>
        </div>
      </div>
    `,
  })

  if (error) {
    console.error('Error sending email with newsletter:', error)
    throw error
  }

  return data
}

export const sendNewProductNewsletter = async (
  email: string,
  name: string,
  productTitle: string,
  productPrice: number,
  productId: string,
  productImage?: string,
  discountCode?: string
) => {
  const discountedPrice = productPrice * 0.8 // 20% de descuento
  
  const { data, error } = await resend.emails.send({
    from: 'Planeta Keto <noreply@planetaketo.es>',
    to: [email],
    subject: `🚀 ¡Nuevo Producto! ${productTitle} con 20% de descuento`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">🚀 ¡Nuevo Producto Disponible!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Exclusivo para suscriptores del newsletter</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <div style="text-align: center; margin-bottom: 30px;">
            ${productImage ? `
              <img src="${productImage}" alt="${productTitle}" 
                   style="max-width: 200px; height: auto; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
            ` : ''}
            <h2 style="color: #333; margin: 0 0 10px 0;">${productTitle}</h2>
            <div style="margin: 20px 0;">
              <span style="text-decoration: line-through; color: #999; font-size: 18px;">€${productPrice.toFixed(2)}</span>
              <span style="color: #e74c3c; font-size: 24px; font-weight: bold; margin-left: 10px;">€${discountedPrice.toFixed(2)}</span>
              <span style="background: #e74c3c; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-left: 10px;">20% OFF</span>
            </div>
          </div>
          
          <div style="background: #fff; padding: 25px; border-radius: 12px; margin: 20px 0; box-shadow: 0 4px 16px rgba(0,0,0,0.1);">
            <h3 style="color: #333; margin: 0 0 15px 0; text-align: center;">🎁 Tu Código de Descuento Exclusivo</h3>
            <div style="text-align: center; margin: 20px 0;">
              <span style="background: #f8f9fa; border: 2px dashed #667eea; padding: 15px 25px; font-size: 18px; font-weight: bold; color: #667eea; display: inline-block; border-radius: 8px;">
                ${discountCode}
              </span>
            </div>
            <p style="text-align: center; color: #666; margin: 0; font-size: 14px;">
              <strong>Válido para 1 uso únicamente</strong> • <strong>Aplica en este o cualquier producto de la tienda</strong>
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://store.planetaketo.es/?product=${productId}" 
               style="background: #667eea; color: white; padding: 15px 30px; 
                      text-decoration: none; border-radius: 8px; display: inline-block;
                      font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
              🛒 Comprar Ahora con Descuento
            </a>
          </div>
          
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; border-left: 4px solid #4caf50; margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0; color: #2e7d32;">⚡ Oferta por tiempo limitado:</h4>
            <ul style="margin: 0; padding-left: 20px; color: #333;">
              <li>20% de descuento exclusivo para suscriptores</li>
              <li><strong>Código válido para cualquier producto de la tienda</strong></li>
              <li>Descarga inmediata después de la compra</li>
              <li>Soporte completo incluido</li>
              <li>Garantía de satisfacción</li>
            </ul>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          
          <p style="text-align: center; color: #666; font-size: 14px;">
            ¿Necesitas ayuda? Escríbenos a <a href="mailto:info@planetaketo.es" style="color: #667eea;">info@planetaketo.es</a><br>
            <a href="https://store.planetaketo.es" style="color: #667eea; text-decoration: none;">🌐 store.planetaketo.es</a>
          </p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              Recibiste este email porque estás suscrito a nuestro newsletter.<br>
              Si no deseas recibir más emails, puedes darte de baja en cualquier momento.
            </p>
          </div>
        </div>
      </div>
    `,
  })

  if (error) {
    console.error('Error sending newsletter:', error)
    throw error
  }

  return data
}

export const sendAdvisoryPurchaseEmail = async (
  email: string,
  name: string,
  ketoCode: string,
  productTitle: string,
  password: string,
  subscribedToNewsletter: boolean = false
) => {
  const { data, error } = await resend.emails.send({
    from: 'Planeta Keto <noreply@planetaketo.es>',
    to: [email],
    subject: `¡Asesoría Confirmada! - ${productTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">¡Gracias ${name}!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Tu asesoría ha sido confirmada</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333;">Detalles de tu asesoría:</h2>
          <p><strong>Servicio:</strong> ${productTitle}</p>
          <p><strong>Código de transacción:</strong> ${ketoCode}</p>
          <p><strong>Contraseña de acceso:</strong> ${password}</p>
          
          <div style="margin: 30px 0; padding: 20px; background: #e3f2fd; border-radius: 8px; border-left: 4px solid #2196f3;">
            <h3 style="margin: 0 0 15px 0; color: #1565c0;">📅 Próximos pasos para tu asesoría:</h3>
            <ol style="margin: 0; padding-left: 20px; color: #333;">
              <li><strong>Programa tu cita:</strong> Habrás visto el calendario en la página anterior para seleccionar tu fecha y hora preferida.</li>
              <li><strong>Confirmación automática:</strong> Recibirás un email de Calendly con los detalles de tu cita.</li>
              <li><strong>Enlace de videollamada:</strong> Se incluirá en el email de confirmación de la cita.</li>
              <li><strong>Recordatorio:</strong> Te notificaremos 24h antes de tu sesión.</li>
            </ol>
          </div>
          
          <div style="margin: 30px 0; padding: 20px; background: #e8f5e8; border-radius: 8px; border-left: 4px solid #4caf50;">
            <h3 style="margin: 0 0 10px 0; color: #2e7d32;">📋 Información importante para tu sesión:</h3>
            <ul style="margin: 0; padding-left: 20px; color: #333;">
              <li><strong>Duración:</strong> La sesión tendrá una duración aproximada de 60 minutos</li>
              <li><strong>Preparación:</strong> Ten lista cualquier pregunta específica sobre tu alimentación keto</li>
              <li><strong>Reprogramación:</strong> Puedes cambiar la fecha hasta 2h antes de la cita</li>
              <li><strong>Soporte:</strong> Si tienes dudas, responde a este email</li>
            </ul>
          </div>
          
          ${subscribedToNewsletter ? `
            <div style="margin: 30px 0; padding: 20px; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
              <h3 style="margin: 0 0 10px 0; color: #856404;">🎉 ¡Bienvenido a nuestro Newsletter!</h3>
              <p style="margin: 0; color: #333;">
                Te has suscrito exitosamente. Recibirás notificaciones sobre nuevos productos, promociones especiales 
                y un <strong>20% de descuento permanente</strong> en futuras compras.
              </p>
            </div>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <h3 style="color: #333; margin-bottom: 15px;">🌟 ¡Nos vemos pronto en tu asesoría!</h3>
            <p style="color: #666; margin-bottom: 20px;">
              Estamos emocionados de ayudarte en tu viaje hacia una alimentación keto exitosa.
            </p>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          
          <p style="text-align: center; color: #666; font-size: 14px;">
            ¿Necesitas ayuda? Escríbenos a <a href="mailto:info@planetaketo.es" style="color: #667eea;">info@planetaketo.es</a><br>
            <a href="https://store.planetaketo.es" style="color: #667eea; text-decoration: none;">🌐 store.planetaketo.es</a>
          </p>
        </div>
      </div>
    `,
  })

  if (error) {
    console.error('Error sending advisory email:', error)
    throw error
  }

  return data
}

export const sendAdminAdvisoryNotification = async (
  customerName: string,
  customerEmail: string,
  productTitle: string,
  ketoCode: string,
  appointmentDateTime?: string
) => {
  const { data, error } = await resend.emails.send({
    from: 'Planeta Keto <noreply@planetaketo.es>',
    to: ['info@planetaketo.es'],
    subject: `🗓️ Nueva Asesoría Vendida - ${productTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px;">🗓️ Nueva Asesoría Vendida</h1>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333;">Detalles de la venta:</h2>
          
          <div style="background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <p><strong>Cliente:</strong> ${customerName}</p>
            <p><strong>Email:</strong> ${customerEmail}</p>
            <p><strong>Servicio:</strong> ${productTitle}</p>
            <p><strong>Código de transacción:</strong> ${ketoCode}</p>
            ${appointmentDateTime ? `<p><strong>Fecha y hora programada:</strong> ${appointmentDateTime}</p>` : `<p><strong>Estado:</strong> Esperando programación de cita</p>`}
          </div>
          
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3;">
            <h3 style="margin: 0 0 10px 0; color: #1565c0;">📋 Recordatorio:</h3>
            <ul style="margin: 0; padding-left: 20px; color: #333;">
              <li>El cliente debe programar su cita usando Calendly</li>
              <li>Recibirás una notificación cuando programe la sesión</li>
              <li>Prepara el material específico para ${productTitle}</li>
              <li>Revisa el perfil del cliente antes de la sesión</li>
            </ul>
          </div>
        </div>
      </div>
    `,
  })

  if (error) {
    console.error('Error sending admin notification:', error)
    throw error
  }

  return data
}