import { NextResponse } from 'next/server'
import { sanityClient } from '@/lib/sanity'

export async function GET() {
  try {
    const lists = await sanityClient.fetch(`
      *[_type == "amazonList"] | order(order asc, createdAt desc) {
        _id,
        title,
        url,
        image,
        order,
        createdAt
      }
    `)

    return NextResponse.json(lists)
  } catch (error) {
    console.error('Error fetching Amazon lists:', error)
    return NextResponse.json({ error: 'Error fetching Amazon lists' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const list = await sanityClient.create({
      _type: 'amazonList',
      ...data,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json(list)
  } catch (error) {
    console.error('Error creating Amazon list:', error)
    return NextResponse.json({ error: 'Error creating Amazon list' }, { status: 500 })
  }
}