import { NextResponse } from 'next/server'
import { sanityClient } from '@/lib/sanity'

export async function GET() {
  try {
    const webElements = await sanityClient.fetch(`
      *[_type == "webElements"][0]{
        _id,
        title,
        subtitle,
        description,
        "logo": logo.asset->url,
        colors
      }
    `)

    return NextResponse.json(webElements)
  } catch (error) {
    console.error('Error fetching web elements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch web elements' }, 
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // TODO: Implementar creación/actualización de elementos web en Sanity
    console.log('Web elements data:', data)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating web elements:', error)
    return NextResponse.json(
      { error: 'Failed to update web elements' }, 
      { status: 500 }
    )
  }
}