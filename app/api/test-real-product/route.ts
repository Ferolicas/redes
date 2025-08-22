import { NextResponse } from 'next/server'
import { sendNewProductNewsletter } from '@/lib/resend'

export async function GET() {
  try {
    // Datos del producto real de Sanity
    const realProduct = {
      _id: "YCcXUTfa7ZEsJt6zbX3c8e",
      title: "PLANIFICADOR KETO 30 DIAS",
      price: 14.75,
      image: "https://cdn.sanity.io/images/qbxfey9f/production/d821ffdcdc4f082327b6dc6e661ea5b8e9691fea-1077x1539.png"
    }

    // Generar código de descuento dinámico
    const discountCodeResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/generate-discount-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clienteId: null // Sin cliente específico para esta prueba
      }),
    })

    const discountData = await discountCodeResponse.json()
    
    if (!discountData.success) {
      return NextResponse.json({ error: 'Error generando código de descuento' }, { status: 500 })
    }

    // Enviar newsletter con el producto real y código dinámico
    const data = await sendNewProductNewsletter(
      'ferneyolicas@gmail.com',
      'Ferney',
      realProduct.title,
      realProduct.price,
      realProduct._id, // ID real del producto
      realProduct.image,
      discountData.codigo
    )
    
    return NextResponse.json({ 
      success: true, 
      message: `Newsletter del producto REAL enviado a ferneyolicas@gmail.com`,
      product: realProduct.title,
      productId: realProduct._id,
      discountCode: discountData.codigo,
      stripeCoupon: discountData.stripeCoupon,
      testUrl: `https://store.planetaketo.es/?product=${realProduct._id}`,
      emailId: data?.id 
    })
  } catch (error) {
    console.error('Error sending real product newsletter:', error)
    return NextResponse.json({ error: 'Error sending email', details: error }, { status: 500 })
  }
}