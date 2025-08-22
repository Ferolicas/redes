import { NextResponse } from 'next/server'
import { sendPurchaseEmailWithNewsletter } from '@/lib/resend'

export async function GET() {
  try {
    // Datos del producto real de Sanity
    const realProduct = {
      _id: "YCcXUTfa7ZEsJt6zbX3c8e",
      title: "PLANIFICADOR KETO 30 DIAS",
      price: 14.75,
      category: "Libro",
      pdfFile: "https://cdn.sanity.io/files/qbxfey9f/production/bd56026aec72a15cc6921a1802545b3a41c4671e.pdf"
    }

    // URL de descarga que SÍ funciona para pruebas
    const downloadUrl = `http://localhost:3002/api/test-download`

    // Enviar email de checkout con el producto real
    const data = await sendPurchaseEmailWithNewsletter(
      'ferneyolicas@gmail.com',
      'Ferney Olicas',
      'KETO-SUCCESS-2024',
      realProduct.title,
      '12345678*', // Contraseña como pediste
      true, // suscrito al newsletter
      downloadUrl
    )
    
    return NextResponse.json({ 
      success: true, 
      message: `Email de COMPRA del producto REAL enviado a ferneyolicas@gmail.com`,
      product: realProduct.title,
      productId: realProduct._id,
      downloadUrl: downloadUrl,
      transactionCode: 'KETO-SUCCESS-2024',
      emailId: data?.id 
    })
  } catch (error) {
    console.error('Error sending real checkout email:', error)
    return NextResponse.json({ error: 'Error sending email', details: error }, { status: 500 })
  }
}