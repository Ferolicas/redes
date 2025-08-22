import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { discountCode, productId } = await request.json()

    // Test discount code with the checkout API
    const response = await fetch('http://localhost:3000/api/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId,
        discountCode: discountCode || ''
      }),
    })

    const data = await response.json()
    console.log('Checkout response:', data)
    
    return NextResponse.json({
      success: !data.error,
      message: data.error ? `Error: ${data.error}` : 'Código de descuento aplicado exitosamente',
      originalPrice: data.originalPrice,
      finalPrice: data.amount,
      discount: data.discount,
      discountCode: data.discountCode,
      savings: data.discount || 0,
      percentOff: data.originalPrice && data.discount ? Math.round((data.discount / data.originalPrice) * 100) : 0
    })
  } catch (error) {
    console.error('Error testing discount:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Error al probar código de descuento' 
    }, { status: 500 })
  }
}