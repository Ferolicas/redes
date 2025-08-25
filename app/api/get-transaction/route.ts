import { NextResponse } from 'next/server'
import { sanityClient } from '@/lib/sanity'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const paymentIntentId = searchParams.get('paymentIntentId')

    if (!paymentIntentId) {
      return NextResponse.json({ error: 'Payment Intent ID requerido' }, { status: 400 })
    }

    // Buscar la transacción por paymentIntentId
    const transaction = await sanityClient.fetch(`
      *[_type == "transaction" && stripeSessionId == $paymentIntentId][0] {
        _id,
        ketoCode,
        amount,
        productId->{
          _id,
          title,
          category,
          description,
          image,
          calendlyUrl
        },
        status,
        paymentMethod,
        customerName,
        customerEmail,
        createdAt
      }
    `, { paymentIntentId })

    if (!transaction) {
      return NextResponse.json({ error: 'Transacción no encontrada' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      transaction: transaction
    })
  } catch (error) {
    console.error('Error fetching transaction:', error)
    return NextResponse.json({ error: 'Error al obtener transacción' }, { status: 500 })
  }
}