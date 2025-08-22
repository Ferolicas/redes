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
      {/* Header - 18% on mobile */}
      <div className="h-[18vh] px-4 py-3 flex items-center border-b border-white/10">
        <div className="flex items-center w-full gap-4">
          {/* Logo - 30% */}
          <div className="w-[30%] flex-shrink-0">
            {webElements?.logo && (
              <img 
                src={webElements.logo} 
                alt="Logo" 
                className="w-full aspect-square object-contain rounded-xl bg-white/10 p-2"
              />
            )}
          </div>
          
          {/* Text Content - 70% */}
          <div className="w-[70%] min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-white mb-1 line-clamp-2 leading-tight">
              {webElements?.title || 'Planeta Keto'}
            </h1>
            <p className="text-sm text-white/80 mb-1 line-clamp-1">
              {webElements?.subtitle || '¡Recetas Keto para todos!'}
            </p>
            {webElements?.description && (
              <p className="text-white/70 text-xs line-clamp-2 leading-tight">
                {webElements.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Products Section - 52% on mobile */}
      <div className="h-[52vh] px-4 py-3 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center">
            <ShoppingBag className="mr-2" size={18} />
            Productos
          </h2>
          <div className="flex gap-1">
            <button 
              onClick={() => handleProductsScroll('up')}
              disabled={productsOffset === 0}
              className="p-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={() => handleProductsScroll('down')}
              disabled={productsOffset >= products.length - 4}
              className="p-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        
        <div className="h-[calc(100%-48px)]">
          <div className="grid grid-cols-2 gap-3 h-full">
            {visibleProducts.map((product: Product, index) => (
              <div 
                key={product._id}
                className="h-full"
              >
                <div 
                  onClick={() => setSelectedProduct(product)}
                  className="h-full rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-3 hover:bg-white/20 transition-all cursor-pointer group"
                >
                  <div className="h-full flex flex-col">
                    {product.image && (
                      <img 
                        src={product.image} 
                        alt={product.title}
                        className="w-full h-20 sm:h-24 object-cover rounded-lg mb-2 group-hover:scale-105 transition-transform"
                      />
                    )}
                    <h3 className="text-sm sm:text-base font-semibold text-white mb-1 line-clamp-2 leading-tight">
                      {product.title}
                    </h3>
                    <p className="text-white/70 text-xs mb-2 line-clamp-2 flex-1 leading-tight">
                      {product.description}
                    </p>
                    <div className="flex items-end justify-between">
                      <div className="text-left">
                        {product.originalPrice && product.originalPrice > product.price && (
                          <>
                            <span className="text-white/50 line-through text-xs block">
                              €{product.originalPrice}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-bold text-sm sm:text-base">
                                €{product.price}
                              </span>
                              <span className="text-green-400 text-xs font-medium">
                                ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off)
                              </span>
                            </div>
                          </>
                        )}
                        {(!product.originalPrice || product.originalPrice <= product.price) && (
                          <span className="text-white font-bold text-sm sm:text-base">
                            €{product.price}
                          </span>
                        )}
                      </div>
                      <span className="px-2 py-1 rounded-full bg-white/20 text-white/80 text-xs">
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

      {/* Amazon Lists Section - 30% on mobile */}
      <div className="h-[30vh] px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center">
            <ExternalLink className="mr-2" size={18} />
            Listas
          </h2>
          <div className="flex gap-1">
            <button 
              onClick={() => handleAmazonScroll('left')}
              className="p-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={() => handleAmazonScroll('right')}
              className="p-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div 
          ref={amazonScrollRef}
          className="flex gap-3 overflow-x-auto h-[calc(100%-88px)] pb-2 scrollbar-hide"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {amazonLists.map((list: AmazonList) => (
            <div 
              key={list._id}
              className="flex-none w-64 sm:w-72 h-full"
              style={{ scrollSnapAlign: 'start' }}
            >
              <a
                href={list.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-3 hover:bg-white/20 transition-all group"
              >
                <div className="h-full flex flex-col">
                  {list.image && (
                    <img 
                      src={list.image} 
                      alt={list.title}
                      className="w-full h-16 sm:h-20 object-cover rounded-lg mb-2 group-hover:scale-105 transition-transform"
                    />
                  )}
                  <h3 className="text-sm sm:text-base font-semibold text-white mb-2 line-clamp-2 leading-tight">
                    {list.title}
                  </h3>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="px-2 py-1 rounded-full bg-white/20 text-white/80 text-xs">
                      {list.category}
                    </span>
                    <span className="text-white/60 text-xs">
                      {list.clickCount} clicks
                    </span>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>

        {/* Amazon Affiliate Notice */}
        <div className="mt-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-2">
          <p className="text-yellow-100 text-xs text-center">
            <Sparkles className="inline mr-1" size={12} />
            <strong>Amazon Afiliados:</strong> Ganamos con compras cualificadas
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