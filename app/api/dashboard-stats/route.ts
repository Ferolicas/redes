import { NextResponse } from 'next/server'
import { sanityClient } from '../../../lib/sanity'

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

    // Pagos fallidos
    const failedPayments = await sanityClient.fetch(`count(*[_type == "transaction" && status == "failed"])`)

    // Obtener total de productos
    const totalProducts = await sanityClient.fetch(`count(*[_type == "product"])`)

    // Obtener ventas exitosas de productos del día (en euros)
    const dailyProductSalesData = await sanityClient.fetch(`
      *[_type == "transaction" && status == "success" && createdAt >= $todayStart] {
        amount,
        netAmount
      }
    `, { todayStart: todayStart.toISOString() })
    const dailyProductSales = dailyProductSalesData.reduce((sum: number, t: any) => sum + (t.netAmount || t.amount || 0), 0)

    // Obtener ventas exitosas totales de productos (en euros)
    const totalProductSalesData = await sanityClient.fetch(`
      *[_type == "transaction" && status == "success"] {
        amount,
        netAmount
      }
    `)
    const totalProductSales = totalProductSalesData.reduce((sum: number, t: any) => sum + (t.netAmount || t.amount || 0), 0)

    // Obtener pedidos del día (todos los estados) - valor en euros
    const dailyOrdersData = await sanityClient.fetch(`
      *[_type == "transaction" && createdAt >= $todayStart] {
        amount,
        netAmount,
        status
      }
    `, { todayStart: todayStart.toISOString() })
    const dailyOrdersAmount = dailyOrdersData.reduce((sum: number, t: any) => sum + (t.netAmount || t.amount || 0), 0)
    const dailyOrdersCount = dailyOrdersData.length

    // Obtener pedidos totales (todos los estados) - valor en euros
    const totalOrdersData = await sanityClient.fetch(`
      *[_type == "transaction"] {
        amount,
        netAmount,
        status
      }
    `)
    const totalOrdersAmount = totalOrdersData.reduce((sum: number, t: any) => sum + (t.netAmount || t.amount || 0), 0)
    const totalOrdersCount = totalOrdersData.length

    // Cálculos
    const calculateStats = (transactions: any[]) => ({
      count: transactions.length,
      amount: transactions.reduce((sum, t) => sum + (t.amount || 0), 0),
      net: transactions.reduce((sum, t) => sum + (t.netAmount || 0), 0),
    })

    // Calcular IVA e IRPF desde las ventas (21% IVA, 15% IRPF)
    const totalIVA = totalSales.reduce((sum: number, t: any) => {
      // Si existe el valor IVA almacenado, usarlo; si no, calcular 21% del amount
      const iva = t.iva !== undefined && t.iva !== null ? t.iva : ((t.amount || 0) * 0.21)
      return sum + iva
    }, 0)
    
    const totalIRPF = totalSales.reduce((sum: number, t: any) => {
      // Si existe el valor IRPF almacenado, usarlo; si no, calcular 15% del amount
      const irpf = t.irpf !== undefined && t.irpf !== null ? t.irpf : ((t.amount || 0) * 0.15)
      return sum + irpf
    }, 0)

    const stats = {
      dailySales: calculateStats(dailySales),
      monthlySales: calculateStats(monthlySales),
      totalSales: calculateStats(totalSales),
      totalIVA: Number(totalIVA.toFixed(2)),
      totalIRPF: Number(totalIRPF.toFixed(2)),
      failedPayments,
      products: {
        total: totalProducts,
        dailySales: Number(dailyProductSales.toFixed(2)),
        totalSales: Number(totalProductSales.toFixed(2))
      },
      orders: {
        daily: Number(dailyOrdersAmount.toFixed(2)),
        total: Number(totalOrdersAmount.toFixed(2)),
        dailyCount: dailyOrdersCount,
        totalCount: totalOrdersCount
      }
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ error: 'Error fetching stats' }, { status: 500 })
  }
}