import { NextResponse } from 'next/server'
import { sanityClient } from '../../../lib/sanity'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const period = searchParams.get('period') // 'day', 'month', 'total'

    let dateFilter = ''
    const now = new Date()

    if (period === 'day') {
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      dateFilter = `&& createdAt >= "${todayStart.toISOString()}"`
    } else if (period === 'month') {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      dateFilter = `&& createdAt >= "${monthStart.toISOString()}"`
    }

    const statusFilter = status ? `&& status == "${status}"` : ''

    const transactions = await sanityClient.fetch(`
      *[_type == "transaction" ${statusFilter} ${dateFilter}] | order(createdAt desc) {
        _id,
        ketoCode,
        amount,
        netAmount,
        customerEmail,
        customerName,
        productId->{title},
        paymentMethod,
        city,
        status,
        createdAt
      }
    `)

    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json({ error: 'Error fetching transactions' }, { status: 500 })
  }
}