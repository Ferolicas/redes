import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe, calculateTaxes, generateKetoCode } from '../../../lib/stripe'
import { sanityClient } from '../../../lib/sanity'
import { sendPurchaseEmail } from '../../../lib/resend'

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')!

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object

    try {
      // Obtener detalles del producto
      const product = await sanityClient.fetch(
        `*[_type == "product" && _id == $productId][0]`,
        { productId: session.metadata?.productId }
      )

      if (!product) {
        throw new Error('Product not found')
      }

      // Generar número de transacción único
      const transactionCount = await sanityClient.fetch(`count(*[_type == "transaction"])`)
      const transactionNumber = transactionCount + 1001

      // Calcular impuestos
      const amount = session.amount_total! / 100 // Stripe usa centavos
      const taxes = calculateTaxes(amount)

      // Generar código KETO
      const ketoCode = generateKetoCode('success', transactionNumber)

      // Crear transacción en Sanity
      const transaction = await sanityClient.create({
        _type: 'transaction',
        ketoCode,
        stripeSessionId: session.id,
        amount,
        ...taxes,
        customerEmail: session.customer_details?.email,
        customerName: session.customer_details?.name,
        productId: {
         _ref: product._id,
         _type: 'reference',
       },
       paymentMethod: session.payment_method_types?.[0] || 'card',
       city: session.customer_details?.address?.city || 'N/A',
       status: 'success',
       createdAt: new Date().toISOString(),
     })

     // Preparar URL de descarga si es producto digital
     let downloadUrl
     if (product.type === 'digital' && product.fileUrl) {
       downloadUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/download/${ketoCode}/${transaction._id}`
     }

     // Enviar email
     await sendPurchaseEmail(
       session.customer_details?.email!,
       session.customer_details?.name!,
       ketoCode,
       product.title,
       downloadUrl
     )

     console.log('Transaction processed successfully:', ketoCode)
   } catch (error) {
     console.error('Error processing transaction:', error)
     return NextResponse.json({ error: 'Error processing transaction' }, { status: 500 })
   }
 }

 return NextResponse.json({ received: true })
}