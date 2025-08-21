import { NextResponse } from 'next/server'
import { sanityClient } from '@/lib/sanity'

export async function GET() {
  try {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    // Ventas del día
    const dailySales = await sanityClient.fetch(`
      *[_type == "transaction" && status == "success" && createdAt >= $todayStart] {
        amount,
        netAmount
      }
    `, { todayStart: todayStart.toISOString() })

    // Ventas del mes
    const monthlySales = await sanityClient.fetch(`
      *[_type == "transaction" && status == "success" && createdAt >= $monthStart] {
        amount,
        netAmount,
        iva,
        irpf
      }
    `, { monthStart: monthStart.toISOString() })

    // Ventas totales
    const totalSales = await sanityClient.fetch(`
      *[_type == "transaction" && status == "success"] {
        amount,
        netAmount,
        iva,
        irpf
      }
    `)

    // Pagos fallidos, pendientes y devoluciones
    const failedPayments = await sanityClient.fetch(`count(*[_type == "transaction" && status == "failed"])`)
    const pendingPayments = await sanityClient.fetch(`count(*[_type == "transaction" && status == "pending"])`)
    const refunds = await sanityClient.fetch(`count(*[_type == "transaction" && status == "refunded"])`)

    // Cálculos
    const calculateStats = (transactions: any[]) => ({
      count: transactions.length,
      amount: transactions.reduce((sum, t) => sum + t.amount, 0),
      net: transactions.reduce((sum, t) => sum + t.netAmount, 0),
    })

    const monthlyIVA = monthlySales.reduce((sum: number, t: any) => sum + (t.iva || 0), 0)
    const monthlyIRPF = monthlySales.reduce((sum: number, t: any) => sum + (t.irpf || 0), 0)
    const totalIVA = totalSales.reduce((sum: number, t: any) => sum + (t.iva || 0), 0)
    const totalIRPF = totalSales.reduce((sum: number, t: any) => sum + (t.irpf || 0), 0)

    const stats = {
      dailySales: calculateStats(dailySales),
      monthlySales: calculateStats(monthlySales),
      totalSales: calculateStats(totalSales),
      monthlyIVA: Number(monthlyIVA.toFixed(2)),
      monthlyIRPF: Number(monthlyIRPF.toFixed(2)),
      totalIVA: Number(totalIVA.toFixed(2)),
      totalIRPF: Number(totalIRPF.toFixed(2)),
      failedPayments,
      pendingPayments,
      refunds,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ error: 'Error fetching stats' }, { status: 500 })
  }
}