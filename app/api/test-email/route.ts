import { NextResponse } from 'next/server'
import { resend } from '@/lib/resend'

export async function GET() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Planeta Keto <noreply@planetaketo.es>',
      to: ['ferneyolicas@gmail.com'],
      subject: '🧪 EMAIL DE PRUEBA - ¡Gracias por tu compra! - Guía Completa Dieta Keto',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">¡Gracias Ferney!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Tu compra se ha procesado exitosamente</p>
            <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.8;">🧪 ESTE ES UN EMAIL DE PRUEBA</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333;">Detalles de tu compra:</h2>
            <p><strong>Producto:</strong> Guía Completa Dieta Keto</p>
            <p><strong>Código de transacción:</strong> KETO-TEST-12345</p>
            <p><strong>Contraseña de acceso:</strong> 12345678*</p>
            
            <div style="margin: 30px 0; text-align: center;">
              <a href="https://planetaketo.es/test-download" 
                 style="background: #667eea; color: white; padding: 15px 30px; 
                        text-decoration: none; border-radius: 5px; display: inline-block;
                        font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
                📚 Descargar Guía Completa Dieta Keto
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
            
            <div style="margin: 30px 0; padding: 20px; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
              <h3 style="margin: 0 0 10px 0; color: #856404;">📋 Información importante:</h3>
              <ul style="margin: 0; padding-left: 20px; color: #333;">
                <li><strong>Descargas permitidas:</strong> Máximo 2 por seguridad</li>
                <li><strong>Formato:</strong> PDF optimizado para todos los dispositivos</li>
                <li><strong>Soporte:</strong> Responde a este email si tienes dudas</li>
              </ul>
            </div>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
            
            <div style="text-align: center;">
              <h3 style="color: #333; margin-bottom: 15px;">🌟 ¡Comienza tu transformación hoy!</h3>
              <p style="color: #666; margin-bottom: 20px;">
                Tu nueva guía contiene todo lo que necesitas para comenzar exitosamente con la dieta keto.
              </p>
              
              <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h4 style="margin: 0 0 10px 0; color: #1976d2;">📞 ¿Necesitas ayuda personalizada?</h4>
                <p style="margin: 0; color: #333;">
                  Si tienes preguntas específicas sobre la dieta keto o necesitas asesoría personalizada,
                  <strong> responde a este email</strong> y te ayudaremos.
                </p>
              </div>
            </div>
            
            <p style="text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
              ¿Necesitas ayuda? Responde a este email<br>
              <a href="https://planetaketo.es" style="color: #667eea; text-decoration: none;">🌐 planetaketo.es</a>
            </p>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                🧪 Este es un email de prueba enviado desde Planeta Keto<br>
                Si recibiste este email por error, puedes ignorarlo.
              </p>
            </div>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error('Error sending test email:', error)
      return NextResponse.json({ error: 'Error sending email', details: error }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Email de prueba enviado exitosamente a ferneyolicas@gmail.com',
      emailId: data?.id 
    })
  } catch (error) {
    console.error('Error in test email endpoint:', error)
    return NextResponse.json({ error: 'Error sending test email' }, { status: 500 })
  }
}