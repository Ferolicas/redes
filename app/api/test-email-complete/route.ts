import { NextResponse } from 'next/server'
import { sendPurchaseEmailWithNewsletter, sendNewProductNewsletter } from '@/lib/resend'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'checkout'
  
  try {
    if (type === 'checkout') {
      // Email de checkout con newsletter
      const data = await sendPurchaseEmailWithNewsletter(
        'ferneyolicas@gmail.com',
        'Ferney',
        'KETO-TEST-12345',
        'Guía Completa Dieta Keto',
        '12345678*',
        true, // suscrito al newsletter
        'https://planetaketo.es/test-download'
      )
      
      return NextResponse.json({ 
        success: true, 
        message: 'Email de checkout con newsletter enviado a ferneyolicas@gmail.com',
        emailId: data?.id 
      })
    } else if (type === 'newsletter') {
      // Email de newsletter para nuevo producto
      const data = await sendNewProductNewsletter(
        'ferneyolicas@gmail.com',
        'Ferney',
        'Nueva Guía: Recetas Keto Avanzadas',
        49.99,
        'https://via.placeholder.com/400x300/667eea/ffffff?text=Recetas+Keto',
        'KETO20-ABC123'
      )
      
      return NextResponse.json({ 
        success: true, 
        message: 'Email de newsletter para nuevo producto enviado a ferneyolicas@gmail.com',
        emailId: data?.id 
      })
    } else {
      return NextResponse.json({ error: 'Tipo inválido. Usa ?type=checkout o ?type=newsletter' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error sending test email:', error)
    return NextResponse.json({ error: 'Error sending email', details: error }, { status: 500 })
  }
}