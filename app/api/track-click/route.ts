import { NextResponse } from 'next/server'
import { sanityClient } from '@/lib/sanity'

export async function POST(request: Request) {
  try {
    const { listId, productId, clickType } = await request.json()

    if (clickType === 'amazon_list' && listId) {
      // Update Amazon list click count
      const currentList = await sanityClient.fetch(`
        *[_type == "amazonList" && _id == $listId][0] {
          _id,
          clickCount
        }
      `, { listId })

      if (currentList) {
        await sanityClient.patch(listId)
          .inc({ clickCount: 1 })
          .commit()
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Amazon list click tracked',
        newCount: (currentList?.clickCount || 0) + 1
      })
    } 
    
    if (clickType === 'product' && productId) {
      // Update product click count
      const currentProduct = await sanityClient.fetch(`
        *[_type == "product" && _id == $productId][0] {
          _id,
          clickCount
        }
      `, { productId })

      if (currentProduct) {
        await sanityClient.patch(productId)
          .inc({ clickCount: 1 })
          .commit()
      } else {
        // If product doesn't have clickCount field, set it
        await sanityClient.patch(productId)
          .set({ clickCount: 1 })
          .commit()
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Product click tracked',
        newCount: (currentProduct?.clickCount || 0) + 1
      })
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  } catch (error) {
    console.error('Error tracking click:', error)
    return NextResponse.json({ error: 'Error tracking click' }, { status: 500 })
  }
}