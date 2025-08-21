'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { ShoppingBag, ExternalLink, Sparkles } from 'lucide-react'
import ProductCard from '../../components/ProductCard'
import AmazonCard from '../../components/AmazonCard'
import PurchaseModal from '../../components/PurchaseModal'
import { Product, AmazonList } from '../../types'

export default function LinksPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch('/api/products')
      return res.json()
    },
  })

  const { data: amazonLists = [] } = useQuery<AmazonList[]>({
    queryKey: ['amazonLists'],
    queryFn: async () => {
      const res = await fetch('/api/amazon-lists')
      return res.json()
    },
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <div className="relative pt-16 pb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-3xl"></div>
        <div className="relative max-w-md mx-auto text-center px-6">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  PK
                </span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Planeta Keto</h1>
            <p className="text-gray-300 text-lg">¡Recetas Keto para todos!</p>
            <p className="text-gray-400 text-sm mt-2">
              Solo carne, grasas, huevos y verduras • Sin harinas ni edulcorantes
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 pb-20">
        {/* Productos y Servicios */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <ShoppingBag className="mr-2" size={20} />
            Productos y Servicios
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            {products.map((product: Product) => (
              <ProductCard
                key={product._id}
                product={product}
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        </div>

        {/* Amazon Afiliados */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
            <p className="text-yellow-100 text-sm text-center">
              <Sparkles className="inline mr-1" size={16} />
              <strong>Amazon Afiliados:</strong> Como asociado de Amazon, ganamos con compras cualificadas
            </p>
          </div>
          
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <ExternalLink className="mr-2" size={20} />
            Listas de Ideas
          </h2>
          
          <div className="space-y-4">
            {amazonLists.map((list: AmazonList) => (
              <AmazonCard key={list._id} list={list} />
            ))}
          </div>
        </div>
      </div>

      {/* Modal de Compra */}
      {selectedProduct && (
        <PurchaseModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  )
}