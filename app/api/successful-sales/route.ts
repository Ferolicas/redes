import { NextResponse } from 'next/server'
import { sanityClient } from '../../../lib/sanity'

export async function GET() {
  try {
    const successfulSales = await sanityClient.fetch(`
      *[_type == "transaction" && status == "success"] | order(createdAt desc) {
        _id,
        ketoCode,
        amount,
        netAmount,
        customerEmail,
        customerName,
        productId->{
          title,
          _id
        },
        paymentMethod,
        city,
        status,
        createdAt
      }
    `)

    return NextResponse.json(successfulSales)
  } catch (error) {
    console.error('Error fetching successful sales:', error)
    return NextResponse.json({ error: 'Error fetching successful sales' }, { status: 500 })
  }
}