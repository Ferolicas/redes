import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Para pruebas, redirigir al PDF real de tu producto
    const realPdfUrl = "https://cdn.sanity.io/files/qbxfey9f/production/bd56026aec72a15cc6921a1802545b3a41c4671e.pdf"
    
    return NextResponse.redirect(realPdfUrl)
  } catch (error) {
    console.error('Error in test download:', error)
    return NextResponse.json({ error: 'Error en la descarga de prueba' }, { status: 500 })
  }
}