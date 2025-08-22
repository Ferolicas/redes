'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useState, useRef } from 'react'
import { ShoppingBag, ExternalLink, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from '../../components/ProductCard'
import AmazonCard from '../../components/AmazonCard'
import PurchaseModal from '../../components/PurchaseModal'
import { Product, AmazonList } from '../../types'

export default function LinksPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [productsOffset, setProductsOffset] = useState(0)
  const [listsOffset, setListsOffset] = useState(0)
  const amazonScrollRef = useRef<HTMLDivElement>(null)

  const { data: webElements } = useQuery({
    queryKey: ['webElements'],
    queryFn: async () => {
      const res = await fetch('/api/web-elements')
      return res.json()
    },
  })

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

  const handleProductsScroll = (direction: 'up' | 'down') => {
    const newOffset = direction === 'down' 
      ? Math.min(productsOffset + 2, Math.max(0, products.length - 4))
      : Math.max(0, productsOffset - 2)
    setProductsOffset(newOffset)
  }

  const handleAmazonScroll = (direction: 'left' | 'right') => {
    if (amazonScrollRef.current) {
      const scrollAmount = amazonScrollRef.current.clientWidth
      const newScrollLeft = direction === 'right'
        ? amazonScrollRef.current.scrollLeft + scrollAmount
        : amazonScrollRef.current.scrollLeft - scrollAmount
      
      amazonScrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      })
    }
  }

  const visibleProducts = products.slice(productsOffset, productsOffset + 4)

  return (
    <div className="h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white font-['Inter'] overflow-hidden">
      {/* Header - 20% */}
      <div className="h-[20%] px-8 py-6 flex items-center justify-center border-b border-white/10">
        <div className="text-center max-w-4xl">
          <div className="flex items-center justify-center gap-6 mb-4">
            {webElements?.logo && (
              <img 
                src={webElements.logo} 
                alt="Logo" 
                className="h-16 w-16 object-contain rounded-xl bg-white/10 p-2"
              />
            )}
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">
                {webElements?.title || 'Planeta Keto'}
              </h1>
              <p className="text-xl text-white/80">
                {webElements?.subtitle || '¡Recetas Keto para todos!'}
              </p>
            </div>
          </div>
          <p className="text-white/70 max-w-2xl mx-auto">
            {webElements?.description || 'Solo carne, grasas, huevos y verduras • Sin harinas ni edulcorantes'}
          </p>
        </div>
      </div>

      {/* Products Section - 50% */}
      <div className="h-[50%] px-8 py-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <ShoppingBag className="mr-3" size={24} />
            Productos y Servicios
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={() => handleProductsScroll('up')}
              disabled={productsOffset === 0}
              className="p-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => handleProductsScroll('down')}
              disabled={productsOffset >= products.length - 4}
              className="p-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        
        <div className="h-full max-h-[calc(100%-80px)]">
          <div className="grid grid-cols-2 gap-6 h-full">
            {visibleProducts.map((product: Product, index) => (
              <div 
                key={product._id}
                className="h-full"
              >
                <div 
                  onClick={() => setSelectedProduct(product)}
                  className="h-full rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 hover:bg-white/20 transition-all cursor-pointer group"
                >
                  <div className="h-full flex flex-col">
                    {product.image && (
                      <img 
                        src={product.image} 
                        alt={product.title}
                        className="w-full h-32 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform"
                      />
                    )}
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="text-white/70 text-sm mb-4 line-clamp-2 flex-1">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-right">
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-white/50 line-through text-sm block">
                            €{product.originalPrice}
                          </span>
                        )}
                        <span className="text-white font-bold text-xl">
                          €{product.price}
                        </span>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-white/20 text-white/80 text-xs">
                        {product.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Amazon Lists Section - 30% */}
      <div className="h-[30%] px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <ExternalLink className="mr-3" size={24} />
            Listas de Ideas
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={() => handleAmazonScroll('left')}
              className="p-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => handleAmazonScroll('right')}
              className="p-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div 
          ref={amazonScrollRef}
          className="flex gap-6 overflow-x-auto h-full max-h-[calc(100%-80px)] pb-4 scrollbar-hide"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {amazonLists.map((list: AmazonList) => (
            <div 
              key={list._id}
              className="flex-none w-80 h-full"
              style={{ scrollSnapAlign: 'start' }}
            >
              <a
                href={list.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 hover:bg-white/20 transition-all group"
              >
                <div className="h-full flex flex-col">
                  {list.image && (
                    <img 
                      src={list.image} 
                      alt={list.title}
                      className="w-full h-24 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform"
                    />
                  )}
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                    {list.title}
                  </h3>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="px-3 py-1 rounded-full bg-white/20 text-white/80 text-xs">
                      {list.category}
                    </span>
                    <span className="text-white/60 text-sm">
                      {list.clickCount} clicks
                    </span>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>

        {/* Amazon Affiliate Notice */}
        <div className="mt-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-3">
          <p className="text-yellow-100 text-xs text-center">
            <Sparkles className="inline mr-1" size={14} />
            <strong>Amazon Afiliados:</strong> Como asociado de Amazon, ganamos con compras cualificadas
          </p>
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