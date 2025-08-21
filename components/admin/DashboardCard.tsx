import React, { ReactNode } from 'react'

interface DashboardCardProps {
  title: string
  icon: ReactNode
  stats: {
    count: number
    amount: number
  }
  onClick: () => void
  selected: boolean
}

export default function DashboardCard({ title, icon, stats, onClick, selected }: DashboardCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 cursor-pointer 
        transform transition-all duration-200 hover:scale-105 hover:bg-white/20 
        hover:shadow-xl hover:shadow-purple-500/25
        ${selected ? 'ring-2 ring-blue-400 bg-white/20' : ''}
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-gray-300 font-medium text-sm">
          {title}
        </div>
        {icon}
      </div>
      
      <div className="space-y-1">
        {stats.count > 0 && (
          <div className="text-2xl font-bold text-white">
            {stats.count}
          </div>
        )}
        
        {stats.amount > 0 && (
          <div className="text-lg font-semibold text-green-400">
            {stats.amount.toFixed(2)}€
          </div>
        )}
        
        {stats.count === 0 && stats.amount === 0 && (
          <div className="text-2xl font-bold text-gray-400">
            0
          </div>
        )}
      </div>
    </div>
  )
}