import { NextResponse } from 'next/server'
import { sanityClient } from '@/lib/sanity'
import { sendPurchaseEmailWithNewsletter, sendAdvisoryPurchaseEmail, sendAdminAdvisoryNotification } from '@/lib/resend'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { 
      paymentIntentId, 
      nombre, 
      email, 
      telefono, 
      pais,
      suscribirNewsletter = false 
    } = await request.json()

    // Buscar la transacción existente por paymentIntentId
    const existingTransaction = await sanityClient.fetch(`
      *[_type == "transaction" && stripeSessionId == $paymentIntentId][0] {
        _id,
        ketoCode,
        amount,
        productId->{
          _id,
          title,
          category,
          fileUrl,
          image
        },
        status,
        paymentMethod
      }
    `, { paymentIntentId })

    if (!existingTransaction) {
      return NextResponse.json({ error: 'Transacción no encontrada' }, { status: 404 })
    }

    if (existingTransaction.status !== 'success') {
      return NextResponse.json({ error: 'La transacción no fue exitosa' }, { status: 400 })
    }

    // Verificar si ya existe un cliente con este código de transacción
    const existingCustomer = await sanityClient.fetch(`
      *[_type == "clientes" && codigoTransaccion == $ketoCode][0]
    `, { ketoCode: existingTransaction.ketoCode })

    if (existingCustomer) {
      return NextResponse.json({ error: 'Ya existe un cliente registrado para esta transacción' }, { status: 400 })
    }

    // Generar contraseña cifrada
    const rawPassword = 'KETOPAGO1234*'
    const hashedPassword = await bcrypt.hash(rawPassword, 12)

    // Crear cliente en Sanity
    const clienteData = {
      _type: 'clientes',
      nombre,
      email,
      telefono,
      pais,
      productoComprado: {
        _ref: existingTransaction.productId._id,
        _type: 'reference'
      },
      fechaCompra: new Date().toISOString(),
      precioCompra: existingTransaction.amount,
      metodoPago: existingTransaction.paymentMethod,
      estadoTransaccion: 'exitoso',
      estadoVenta: 'exitoso',
      codigoTransaccion: existingTransaction.ketoCode,
      contrasenaAcceso: hashedPassword,
      contadorDescargas: 0,
      maxDescargas: 2,
      suscritoNewsletter: suscribirNewsletter,
      fechaSuscripcionNewsletter: suscribirNewsletter ? new Date().toISOString() : null,
      codigosDescuentoUsados: []
    }

    const cliente = await sanityClient.create(clienteData)

    // Preparar URL de descarga si es un libro digital
    let downloadUrl
    if (existingTransaction.productId.category === 'Libro' && existingTransaction.productId.fileUrl) {
      downloadUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/download/${existingTransaction.ketoCode}/${existingTransaction._id}`
    }

    // Enviar email específico según el tipo de producto
    if (existingTransaction.productId.category === 'Asesoria') {
      // Enviar email de asesoría
      await sendAdvisoryPurchaseEmail(
        email,
        nombre,
        existingTransaction.ketoCode,
        existingTransaction.productId.title,
        rawPassword,
        suscribirNewsletter
      )
      
      // Enviar notificación al administrador
      await sendAdminAdvisoryNotification(
        nombre,
        email,
        existingTransaction.productId.title,
        existingTransaction.ketoCode
      )
    } else {
      // Enviar email con newsletter para productos digitales
      await sendPurchaseEmailWithNewsletter(
        email,
        nombre,
        existingTransaction.ketoCode,
        existingTransaction.productId.title,
        rawPassword,
        suscribirNewsletter,
        downloadUrl
      )
    }

    return NextResponse.json({ 
      success: true, 
      cliente: cliente,
      message: 'Cliente registrado exitosamente y email enviado'
    })
  } catch (error) {
    console.error('Error saving customer:', error)
    return NextResponse.json({ error: 'Error al guardar cliente' }, { status: 500 })
  }
}