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

  if (event.type === 'payment_intent.succeeded' || event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object

    try {
      // Obtener Payment Intent con información expandida para acceder a los charges y payment method
      const fullPaymentIntent = await stripe.paymentIntents.retrieve(paymentIntent.id, {
        expand: ['charges.data.payment_method_details', 'payment_method']
      })
      // Obtener detalles del producto
      const product = await sanityClient.fetch(
        `*[_type == "product" && _id == $productId][0]`,
        { productId: paymentIntent.metadata?.productId }
      )

      if (!product) {
        throw new Error('Product not found')
      }

      // Generar número de transacción único
      const transactionCount = await sanityClient.fetch(`count(*[_type == "transaction"])`)
      const transactionNumber = transactionCount + 1001

      // Calcular impuestos
      const amount = fullPaymentIntent.amount / 100 // Stripe usa centavos
      const taxes = calculateTaxes(amount)

      // Determinar estado de la transacción
      const status = event.type === 'payment_intent.succeeded' ? 'success' : 'failed'
      
      // Generar código KETO
      const ketoCode = generateKetoCode(status, transactionNumber)

      // Obtener información del método de pago para datos del cliente
      let customerEmail = 'N/A'
      let customerName = 'N/A'
      let city = 'N/A'
      let paymentMethodType = 'card'

      // Intentar obtener datos del charge primero
      if ((fullPaymentIntent as any).charges?.data?.length > 0) {
        const charge = (fullPaymentIntent as any).charges.data[0]
        customerEmail = charge.billing_details?.email || fullPaymentIntent.receipt_email || 'N/A'
        customerName = charge.billing_details?.name || 'N/A'
        city = charge.billing_details?.address?.city || 'N/A'
        
        // Obtener el método de pago actual usado
        if (charge.payment_method_details?.type) {
          paymentMethodType = charge.payment_method_details.type
        }
      }

      // Si no tenemos datos del cliente, intentar obtenerlos del payment method
      if ((customerEmail === 'N/A' || customerName === 'N/A' || city === 'N/A') && (fullPaymentIntent as any).payment_method) {
        const paymentMethod = (fullPaymentIntent as any).payment_method
        
        if (paymentMethod.billing_details) {
          if (customerEmail === 'N/A' && paymentMethod.billing_details.email) {
            customerEmail = paymentMethod.billing_details.email
          }
          if (customerName === 'N/A' && paymentMethod.billing_details.name) {
            customerName = paymentMethod.billing_details.name
          }
          if (city === 'N/A' && paymentMethod.billing_details.address?.city) {
            city = paymentMethod.billing_details.address.city
          }
        }
        
        if (paymentMethodType === 'card' && paymentMethod.type) {
          paymentMethodType = paymentMethod.type
        }
      }

      // Crear transacción en Sanity
      const transaction = await sanityClient.create({
        _type: 'transaction',
        ketoCode,
        stripeSessionId: fullPaymentIntent.id,
        amount,
        ...taxes,
        customerEmail,
        customerName,
        productId: {
         _ref: product._id,
         _type: 'reference',
       },
       paymentMethod: paymentMethodType,
       city,
       status,
       createdAt: new Date().toISOString(),
       failureReason: event.type === 'payment_intent.payment_failed' ? fullPaymentIntent.last_payment_error?.message : undefined,
     })

     // Solo enviar email y preparar descarga para pagos exitosos
     if (status === 'success') {
       // Preparar URL de descarga si es producto digital
       let downloadUrl
       if (product.type === 'digital' && product.fileUrl) {
         downloadUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/download/${ketoCode}/${transaction._id}`
       }

       // Enviar email solo para pagos exitosos
       if (customerEmail && customerEmail !== 'N/A') {
         await sendPurchaseEmail(
           customerEmail,
           customerName || 'Cliente',
           ketoCode,
           product.title,
           downloadUrl
         )
       }
     }

     console.log(`Transaction processed (${status}):`, ketoCode)
   } catch (error) {
     console.error('Error processing transaction:', error)
     return NextResponse.json({ error: 'Error processing transaction' }, { status: 500 })
   }
 }

 return NextResponse.json({ received: true })
}