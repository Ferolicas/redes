'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { 
  Plus, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  AlertCircle, 
  Clock, 
  RotateCcw,
  Receipt,
  FileText,
  BarChart3,
  ShoppingBag,
  Users,
  Settings,
  Home,
  Package
} from 'lucide-react'
import DashboardCard from '../../components/admin/DashboardCard'
import CreateProductModal from '../../components/admin/CreateProductModal'
import CreateListModal from '../../components/admin/CreateListModal'
import TransactionsList from '../../components/admin/TransactionsList'
import { DashboardStats } from '../../types'

export default function AdminPage() {
  const [showProductModal, setShowProductModal] = useState(false)
  const [showListModal, setShowListModal] = useState(false)
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [activeView, setActiveView] = useState('dashboard')

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const res = await fetch('/api/dashboard-stats')
      return res.json()
    },
  })

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'products', label: 'Productos', icon: Package },
    { id: 'orders', label: 'Pedidos', icon: ShoppingBag },
    { id: 'customers', label: 'Clientes', icon: Users },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen flex-center">
        <div className="card animate-pulse-glow">
          <div className="text-xl font-semibold">Cargando panel...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen container py-8">
      <div className="animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-between items-center mb-8">
            <a href="/" className="btn btn-secondary">
              <Home size={20} />
              Volver al inicio
            </a>
            <div className="flex gap-4">
              <button
                onClick={() => setShowProductModal(true)}
                className="btn btn-primary"
              >
                <Plus size={20} />
                Nuevo Producto
              </button>
              <button
                onClick={() => setShowListModal(true)}
                className="btn btn-secondary"
              >
                <Plus size={20} />
                Nueva Lista
              </button>
            </div>
          </div>
          
          <h1 className="gradient-text text-5xl font-bold mb-4">Admin Panel</h1>
          <p className="text-xl text-center max-w-2xl mx-auto">
            Gestiona tu negocio de forma visual y eficiente con tarjetas interactivas
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
          {navigationItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`card cursor-pointer text-center transition-all duration-300 ${
                activeView === item.id 
                  ? 'gradient-border animate-pulse-glow' 
                  : 'hover:scale-105'
              }`}
            >
              <div className="flex flex-col items-center gap-4">
                <div className={`p-4 rounded-2xl ${
                  activeView === item.id 
                    ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30' 
                    : 'bg-white/5'
                }`}>
                  <item.icon size={32} className={
                    activeView === item.id ? 'text-white' : 'text-gray-400'
                  } />
                </div>
                <h3 className={`font-semibold text-lg ${
                  activeView === item.id ? 'text-white' : 'text-gray-300'
                }`}>
                  {item.label}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Dashboard Content */}
        {activeView === 'dashboard' && (
          <div className="space-y-12">
            {/* Main Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card gradient-border group cursor-pointer hover:scale-105 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl">
                    <DollarSign className="text-purple-400" size={32} />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold gradient-text">${stats?.totalSales.net || 0}</div>
                    <div className="text-sm text-gray-400">{stats?.totalSales.count || 0} ventas</div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white">Ventas Totales</h3>
                <p className="text-gray-400 text-sm mt-2">Ingresos acumulados</p>
              </div>

              <div className="card gradient-border group cursor-pointer hover:scale-105 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl">
                    <TrendingUp className="text-blue-400" size={32} />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold gradient-text">${stats?.monthlySales.net || 0}</div>
                    <div className="text-sm text-gray-400">{stats?.monthlySales.count || 0} ventas</div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white">Este Mes</h3>
                <p className="text-gray-400 text-sm mt-2">Rendimiento mensual</p>
              </div>

              <div className="card gradient-border group cursor-pointer hover:scale-105 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl">
                    <Calendar className="text-green-400" size={32} />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold gradient-text">${stats?.dailySales.net || 0}</div>
                    <div className="text-sm text-gray-400">{stats?.dailySales.count || 0} ventas</div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white">Hoy</h3>
                <p className="text-gray-400 text-sm mt-2">Ventas del día</p>
              </div>

              <div className="card gradient-border group cursor-pointer hover:scale-105 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl">
                    <AlertCircle className="text-orange-400" size={32} />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold gradient-text">{stats?.failedPayments || 0}</div>
                    <div className="text-sm text-gray-400">fallos</div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white">Pagos Fallidos</h3>
                <p className="text-gray-400 text-sm mt-2">Requieren atención</p>
              </div>
            </div>

            {/* Secondary Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex flex-col">
                <div 
                  className={`card cursor-pointer transition-all duration-300 hover:scale-105 ${
                    selectedCard === 'pending' ? 'gradient-border animate-pulse-glow' : ''
                  }`}
                  onClick={() => setSelectedCard(selectedCard === 'pending' ? null : 'pending')}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-yellow-500/20 rounded-xl">
                      <Clock className="text-yellow-400" size={24} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{stats?.pendingPayments || 0}</div>
                      <h3 className="font-semibold text-white">Pagos Pendientes</h3>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">Click para ver detalles</p>
                </div>
                
                {/* Transaction Details for this card */}
                {selectedCard === 'pending' && (
                  <div className="card gradient-border mt-4 animate-fade-in-up">
                    <h2 className="text-xl font-bold gradient-text mb-4">
                      Detalles de Pagos Pendientes
                    </h2>
                    <TransactionsList filter={selectedCard} />
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <div 
                  className={`card cursor-pointer transition-all duration-300 hover:scale-105 ${
                    selectedCard === 'refunds' ? 'gradient-border animate-pulse-glow' : ''
                  }`}
                  onClick={() => setSelectedCard(selectedCard === 'refunds' ? null : 'refunds')}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-orange-500/20 rounded-xl">
                      <RotateCcw className="text-orange-400" size={24} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{stats?.refunds || 0}</div>
                      <h3 className="font-semibold text-white">Devoluciones</h3>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">Click para ver detalles</p>
                </div>
                
                {/* Transaction Details for this card */}
                {selectedCard === 'refunds' && (
                  <div className="card gradient-border mt-4 animate-fade-in-up">
                    <h2 className="text-xl font-bold gradient-text mb-4">
                      Detalles de Devoluciones
                    </h2>
                    <TransactionsList filter={selectedCard} />
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <div 
                  className={`card cursor-pointer transition-all duration-300 hover:scale-105 ${
                    selectedCard === 'monthlyIVA' ? 'gradient-border animate-pulse-glow' : ''
                  }`}
                  onClick={() => setSelectedCard(selectedCard === 'monthlyIVA' ? null : 'monthlyIVA')}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-indigo-500/20 rounded-xl">
                      <Receipt className="text-indigo-400" size={24} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">${stats?.monthlyIVA || 0}</div>
                      <h3 className="font-semibold text-white">IVA del Mes</h3>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">Click para ver detalles</p>
                </div>
                
                {/* Transaction Details for this card */}
                {selectedCard === 'monthlyIVA' && (
                  <div className="card gradient-border mt-4 animate-fade-in-up">
                    <h2 className="text-xl font-bold gradient-text mb-4">
                      Detalles de IVA del Mes
                    </h2>
                    <TransactionsList filter={selectedCard} />
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <div 
                  className={`card cursor-pointer transition-all duration-300 hover:scale-105 ${
                    selectedCard === 'monthlyIRPF' ? 'gradient-border animate-pulse-glow' : ''
                  }`}
                  onClick={() => setSelectedCard(selectedCard === 'monthlyIRPF' ? null : 'monthlyIRPF')}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-pink-500/20 rounded-xl">
                      <FileText className="text-pink-400" size={24} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">${stats?.monthlyIRPF || 0}</div>
                      <h3 className="font-semibold text-white">IRPF del Mes</h3>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">Click para ver detalles</p>
                </div>
                
                {/* Transaction Details for this card */}
                {selectedCard === 'monthlyIRPF' && (
                  <div className="card gradient-border mt-4 animate-fade-in-up">
                    <h2 className="text-xl font-bold gradient-text mb-4">
                      Detalles de IRPF del Mes
                    </h2>
                    <TransactionsList filter={selectedCard} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Other Views */}
        {activeView !== 'dashboard' && (
          <div className="card text-center gradient-border max-w-2xl mx-auto">
            <div className="text-8xl mb-6">🚧</div>
            <h3 className="text-3xl font-bold gradient-text mb-4">En Construcción</h3>
            <p className="text-xl text-gray-400 mb-8">
              La sección de <span className="text-white font-semibold">
                {navigationItems.find(item => item.id === activeView)?.label}
              </span> estará disponible próximamente
            </p>
            <button 
              onClick={() => setActiveView('dashboard')}
              className="btn btn-primary"
            >
              Volver al Dashboard
            </button>
          </div>
        )}
      </div>

      {/* Modales */}
      {showProductModal && (
        <CreateProductModal onClose={() => setShowProductModal(false)} />
      )}

      {showListModal && (
        <CreateListModal onClose={() => setShowListModal(false)} />
      )}
    </div>
  )
}