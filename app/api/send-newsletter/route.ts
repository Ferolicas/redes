import { NextResponse } from 'next/server'
import { sanityClient } from '@/lib/sanity'
import { sendNewProductNewsletter } from '@/lib/resend'

export async function POST(request: Request) {
  try {
    const { productId } = await request.json()

    // Obtener información del producto
    const product = await sanityClient.fetch(`
      *[_type == "product" && _id == $productId][0] {
        _id,
        title,
        price,
        image
      }
    `, { productId })

    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }

    // Obtener todos los suscriptores del newsletter
    const subscribers = await sanityClient.fetch(`
      *[_type == "clientes" && suscritoNewsletter == true] {
        _id,
        nombre,
        email
      }
    `)

    if (subscribers.length === 0) {
      return NextResponse.json({ message: 'No hay suscriptores activos' })
    }

    const results = []
    const errors = []

    // Enviar email a cada suscriptor con su código personalizado
    for (const subscriber of subscribers) {
      try {
        // Generar código de descuento personalizado
        const discountCodeResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/generate-discount-code`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clienteId: subscriber._id
          }),
        })

        const discountData = await discountCodeResponse.json()
        
        if (discountData.success) {
          // Enviar newsletter con código personalizado
          await sendNewProductNewsletter(
            subscriber.email,
            subscriber.nombre,
            product.title,
            product.price,
            product.image,
            discountData.codigo
          )
          
          results.push({
            email: subscriber.email,
            success: true,
            discountCode: discountData.codigo
          })
        } else {
          errors.push({
            email: subscriber.email,
            error: 'No se pudo generar código de descuento'
          })
        }
      } catch (error) {
        console.error(`Error sending newsletter to ${subscriber.email}:`, error)
        errors.push({
          email: subscriber.email,
          error: error instanceof Error ? error.message : 'Error desconocido'
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Newsletter enviado a ${results.length} suscriptores`,
      results,
      errors,
      totalSubscribers: subscribers.length,
      successCount: results.length,
      errorCount: errors.length
    })
  } catch (error) {
    console.error('Error sending newsletter:', error)
    return NextResponse.json({ error: 'Error al enviar newsletter' }, { status: 500 })
  }
}