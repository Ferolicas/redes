import { NextResponse } from 'next/server'
import { sanityClient } from '@/lib/sanity'
import { createStripeCoupon } from '@/lib/stripe'

export async function POST(request: Request) {
  try {
    const { clienteId } = await request.json()

    // Generar código único
    const generateUniqueCode = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let result = 'KETO20-'
      for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return result
    }

    let codigo = generateUniqueCode()
    let codeExists = true
    
    // Verificar que el código sea único
    while (codeExists) {
      const existingCode = await sanityClient.fetch(`
        *[_type == "discountCodes" && codigo == $codigo][0]
      `, { codigo })
      
      if (!existingCode) {
        codeExists = false
      } else {
        codigo = generateUniqueCode()
      }
    }

    // Crear el cupón en Stripe
    let stripeCoupon = null
    try {
      stripeCoupon = await createStripeCoupon(codigo, 20)
    } catch (stripeError) {
      console.error('Error creating Stripe coupon:', stripeError)
      // Continue even if Stripe fails, but log the error
    }

    // Crear el código de descuento en Sanity
    const discountCode = await sanityClient.create({
      _type: 'discountCodes',
      codigo,
      descuento: 20,
      activo: true,
      usoUnico: true,
      usado: false,
      fechaCreacion: new Date().toISOString(),
      stripeCouponId: stripeCoupon?.id || null,
      clienteAsignado: clienteId ? {
        _ref: clienteId,
        _type: 'reference'
      } : undefined
    })

    return NextResponse.json({ 
      success: true, 
      codigo: discountCode.codigo,
      discountCode,
      stripeCoupon: stripeCoupon ? { id: stripeCoupon.id } : null
    })
  } catch (error) {
    console.error('Error generating discount code:', error)
    return NextResponse.json({ error: 'Error al generar código de descuento' }, { status: 500 })
  }
}