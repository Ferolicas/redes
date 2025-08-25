import { NextResponse } from 'next/server'
import { sanityClient } from '@/lib/sanity'

export async function POST(request: Request) {
  try {
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format

    // Check if we have analytics for today
    const todaysAnalytics = await sanityClient.fetch(`
      *[_type == "analytics" && date == $date][0] {
        _id,
        dailyVisits,
        totalVisits
      }
    `, { date: today })

    if (todaysAnalytics) {
      // Update existing record
      await sanityClient.patch(todaysAnalytics._id)
        .inc({ 
          dailyVisits: 1,
          totalVisits: 1
        })
        .commit()
    } else {
      // Get total visits from yesterday to continue the count
      const latestAnalytics = await sanityClient.fetch(`
        *[_type == "analytics"] | order(date desc)[0] {
          totalVisits
        }
      `)

      const previousTotal = latestAnalytics?.totalVisits || 0

      // Create new record for today
      await sanityClient.create({
        _type: 'analytics',
        date: today,
        dailyVisits: 1,
        totalVisits: previousTotal + 1,
        productClicks: [],
        listClicks: [],
        createdAt: new Date().toISOString()
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Visit tracked successfully'
    })
  } catch (error) {
    console.error('Error tracking visit:', error)
    return NextResponse.json({ error: 'Error tracking visit' }, { status: 500 })
  }
}