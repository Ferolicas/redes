import { NextResponse } from 'next/server'
import { sanityClient } from '../../../lib/sanity'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let statusFilter = ''
    if (status && status !== 'all') {
      statusFilter = `&& status == "${status}"`
    }

    const orders = await sanityClient.fetch(`
      *[_type == "transaction" ${statusFilter}] | order(createdAt desc) {
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

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Error fetching orders' }, { status: 500 })
  }
}