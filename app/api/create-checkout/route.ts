import { NextResponse } from 'next/server'
import { stripe, validateCoupon } from '@/lib/stripe'
import { sanityClient } from '@/lib/sanity'

export async function POST(request: Request) {
  try {
    const { productId, discountCode } = await request.json()

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

    // Validar código de descuento si se proporciona
    let discountAmount = 0
    let coupon = null
    if (discountCode) {
      coupon = await validateCoupon(discountCode)
      if (!coupon || !coupon.valid) {
        return NextResponse.json({ error: 'Invalid discount code' }, { status: 400 })
      }
      discountAmount = coupon.percent_off ? (product.price * coupon.percent_off / 100) : 0
    }

    const finalAmount = product.price - discountAmount

    // Crear Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(finalAmount * 100), // Stripe usa centavos
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        productId: product._id,
        productTitle: product.title,
        discountCode: discountCode || '',
        originalPrice: product.price.toString(),
        finalPrice: finalAmount.toString(),
      },
      receipt_email: undefined, // Se llenará cuando el usuario complete el formulario
    })

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      amount: finalAmount,
      originalPrice: product.price,
      discount: discountAmount,
      discountCode: discountCode || null
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json({ error: 'Error creating payment intent' }, { status: 500 })
  }
}