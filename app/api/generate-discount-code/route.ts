import { NextResponse } from 'next/server'
import { sanityClient } from '@/lib/sanity'

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

    // Crear el código de descuento
    const discountCode = await sanityClient.create({
      _type: 'discountCodes',
      codigo,
      descuento: 20,
      activo: true,
      usoUnico: true,
      usado: false,
      fechaCreacion: new Date().toISOString(),
      clienteAsignado: clienteId ? {
        _ref: clienteId,
        _type: 'reference'
      } : undefined
    })

    return NextResponse.json({ 
      success: true, 
      codigo: discountCode.codigo,
      discountCode
    })
  } catch (error) {
    console.error('Error generating discount code:', error)
    return NextResponse.json({ error: 'Error al generar código de descuento' }, { status: 500 })
  }
}