import { NextResponse } from 'next/server'
import { sanityClient } from '@/lib/sanity'

export async function GET() {
  try {
    const products = await sanityClient.fetch(`
      *[_type == "product"] | order(featured desc, createdAt desc) {
        _id,
        title,
        description,
        price,
        originalPrice,
        stripePriceId,
        category,
        featured,
        "image": image.asset->url,
        "pdfFile": pdfFile.asset->url,
        createdAt
      }
    `)

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Error fetching products' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const product = await sanityClient.create({
      _type: 'product',
      ...data,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Error creating product' }, { status: 500 })
  }
}