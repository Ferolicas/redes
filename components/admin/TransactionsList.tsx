'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface TransactionsListProps {
  filter: string
}

export default function TransactionsList({ filter }: TransactionsListProps) {
  const getQueryParams = (): Record<string, string> => {
    switch (filter) {
      case 'daily':
        return { period: 'day', status: 'success' }
      case 'monthly':
        return { period: 'month', status: 'success' }
      case 'total':
        return { status: 'success' }
      case 'failed':
        return { status: 'failed' }
      case 'pending':
        return { status: 'pending' }
      case 'refunds':
        return { status: 'refunded' }
      default:
        return {}
    }
  }

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions', filter],
    queryFn: async () => {
      const params = new URLSearchParams(getQueryParams())
      const res = await fetch(`/api/transactions?${params}`)
      return res.json()
    },
  })

  if (isLoading) {
    return <div className="text-white">Cargando transacciones...</div>
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-400'
      case 'pending':
        return 'text-yellow-400'
      case 'failed':
        return 'text-red-400'
      case 'refunded':
        return 'text-orange-400'
      default:
        return 'text-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return 'Exitoso'
      case 'pending':
        return 'Pendiente'
      case 'failed':
        return 'Fallido'
      case 'refunded':
        return 'Devuelto'
      default:
        return status
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-3 px-4 text-gray-300 font-medium">Fecha</th>
            <th className="text-left py-3 px-4 text-gray-300 font-medium">Producto</th>
            <th className="text-left py-3 px-4 text-gray-300 font-medium">Cliente</th>
            <th className="text-left py-3 px-4 text-gray-300 font-medium">Monto</th>
            <th className="text-left py-3 px-4 text-gray-300 font-medium">Método</th>
            <th className="text-left py-3 px-4 text-gray-300 font-medium">Ciudad</th>
            <th className="text-left py-3 px-4 text-gray-300 font-medium">Estado</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction: any) => (
            <tr key={transaction._id} className="border-b border-white/5 hover:bg-white/5">
              <td className="py-3 px-4 text-white">
                {format(new Date(transaction.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
              </td>
              <td className="py-3 px-4 text-white">
                {transaction.productId?.title || 'N/A'}
              </td>
              <td className="py-3 px-4 text-white">
                <div>
                  <div className="font-medium">{transaction.customerName}</div>
                  <div className="text-xs text-gray-400">{transaction.customerEmail}</div>
                </div>
              </td>
              <td className="py-3 px-4 text-white">
                <div>
                  <div className="font-medium">{transaction.amount?.toFixed(2)}€</div>
                  {transaction.netAmount && (
                    <div className="text-xs text-green-400">
                      Neto: {transaction.netAmount.toFixed(2)}€
                    </div>
                  )}
                </div>
              </td>
              <td className="py-3 px-4 text-white capitalize">
                {transaction.paymentMethod}
              </td>
              <td className="py-3 px-4 text-white">
                {transaction.city}
              </td>
              <td className={`py-3 px-4 font-medium ${getStatusColor(transaction.status)}`}>
                {getStatusText(transaction.status)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {transactions.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No hay transacciones para mostrar
        </div>
      )}
    </div>
  )
}