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