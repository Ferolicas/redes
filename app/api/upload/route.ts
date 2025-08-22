import { NextRequest, NextResponse } from 'next/server'
import { sanityClient } from '@/lib/sanity'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    
    // Determinar si es imagen o archivo
    const isImage = file.type.startsWith('image/')
    
    const asset = await sanityClient.assets.upload(
      isImage ? 'image' : 'file', 
      Buffer.from(buffer), 
      {
        filename: file.name,
      }
    )

    return NextResponse.json({ 
      _id: asset._id,
      url: asset.url 
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 })
  }
}