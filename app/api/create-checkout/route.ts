import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { sanityClient } from '@/lib/sanity'

export async function POST(request: Request) {
  try {
    const { productId } = await request.json()

    // Obtener información del producto desde Sanity
    const product = await sanityClient.fetch(`
      *[_type == "product" && _id == $productId][0]{
        _id,
        title,
        price,
        stripePriceId
      }
    `, { productId })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Crear Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(product.price * 100), // Stripe usa centavos
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        productId: product._id,
        productTitle: product.title,
      },
      receipt_email: null, // Se llenará cuando el usuario complete el formulario
    })

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      amount: product.price 
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json({ error: 'Error creating payment intent' }, { status: 500 })
  }
}