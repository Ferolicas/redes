import { NextResponse } from 'next/server'
import { sanityClient } from '@/lib/sanity'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'today' // today, week, month, all

    const today = new Date().toISOString().split('T')[0]
    let dateFilter = ''

    switch (period) {
      case 'today':
        dateFilter = `date == "${today}"`
        break
      case 'week':
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        const weekAgoStr = weekAgo.toISOString().split('T')[0]
        dateFilter = `date >= "${weekAgoStr}"`
        break
      case 'month':
        const monthAgo = new Date()
        monthAgo.setMonth(monthAgo.getMonth() - 1)
        const monthAgoStr = monthAgo.toISOString().split('T')[0]
        dateFilter = `date >= "${monthAgoStr}"`
        break
      default:
        dateFilter = 'true' // All records
    }

    // Get analytics data
    const analytics = await sanityClient.fetch(`
      *[_type == "analytics" && ${dateFilter}] | order(date desc) {
        _id,
        date,
        dailyVisits,
        totalVisits,
        productClicks[] {
          productId->{
            _id,
            title,
            category,
            image
          },
          clicks
        },
        listClicks[] {
          listId->{
            _id,
            title,
            category,
            image
          },
          clicks
        }
      }
    `)

    // Get current totals
    const currentTotals = await sanityClient.fetch(`
      *[_type == "analytics"] | order(date desc)[0] {
        totalVisits
      }
    `)

    // Aggregate data
    const totalDailyVisits = analytics.reduce((sum: number, day: any) => sum + (day.dailyVisits || 0), 0)
    const currentTotalVisits = currentTotals?.totalVisits || 0

    // Top products by clicks
    const productClickMap = new Map()
    analytics.forEach((day: any) => {
      day.productClicks?.forEach((click: any) => {
        if (click.productId) {
          const existing = productClickMap.get(click.productId._id) || { 
            product: click.productId, 
            clicks: 0 
          }
          existing.clicks += click.clicks
          productClickMap.set(click.productId._id, existing)
        }
      })
    })

    // Top lists by clicks
    const listClickMap = new Map()
    analytics.forEach((day: any) => {
      day.listClicks?.forEach((click: any) => {
        if (click.listId) {
          const existing = listClickMap.get(click.listId._id) || { 
            list: click.listId, 
            clicks: 0 
          }
          existing.clicks += click.clicks
          listClickMap.set(click.listId._id, existing)
        }
      })
    })

    const topProducts = Array.from(productClickMap.values())
      .sort((a: any, b: any) => b.clicks - a.clicks)
      .slice(0, 10)

    const topLists = Array.from(listClickMap.values())
      .sort((a: any, b: any) => b.clicks - a.clicks)
      .slice(0, 10)

    return NextResponse.json({
      success: true,
      data: {
        period,
        summary: {
          totalVisitsPeriod: totalDailyVisits,
          totalVisitsOverall: currentTotalVisits,
          daysInPeriod: analytics.length
        },
        dailyData: analytics,
        topProducts,
        topLists
      }
    })
  } catch (error) {
    console.error('Error getting analytics:', error)
    return NextResponse.json({ error: 'Error getting analytics' }, { status: 500 })
  }
}