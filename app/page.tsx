'use client'

import React, { Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ShoppingBag, ExternalLink, Sparkles, ChevronLeft, ChevronRight, Youtube, Instagram, MessageCircle, Facebook, Mail } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import AmazonCard from '../components/AmazonCard'
import PurchaseModal from '../components/PurchaseModal'
import { Product, AmazonList } from '../types'

function HomePageContent() {
  const searchParams = useSearchParams()
  const productId = searchParams.get('product')
  
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
      ? Math.min(productsOffset + 2, Math.max(0, products.length - 2))
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

  const handleAmazonClick = async (listId: string, url: string) => {
    try {
      // Track the click
      await fetch('/api/track-click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listId,
          clickType: 'amazon_list'
        }),
      })
    } catch (error) {
      console.error('Error tracking click:', error)
    }
    
    // Open the link
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleProductClick = async (productId: string, product: Product) => {
    try {
      // Track the click
      await fetch('/api/track-click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          clickType: 'product'
        }),
      })
    } catch (error) {
      console.error('Error tracking click:', error)
    }
    
    // Open the modal
    setSelectedProduct(product)
  }

  // Track page visit
  useEffect(() => {
    const trackVisit = async () => {
      try {
        await fetch('/api/track-visit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      } catch (error) {
        console.error('Error tracking visit:', error)
      }
    }

    trackVisit()
  }, [])

  // Efecto para abrir modal del producto si se pasa por URL
  useEffect(() => {
    if (productId && products.length > 0) {
      const product = products.find(p => p._id === productId)
      if (product) {
        setSelectedProduct(product)
      }
    }
  }, [productId, products])

  const visibleProducts = products.slice(productsOffset, productsOffset + 2)

  return (
    <div className="h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white font-['Inter'] overflow-hidden relative">
      {/* Desktop Container - Centers the mobile view */}
      <div className="h-full w-full lg:flex lg:items-center lg:justify-center lg:bg-black/20">
        <div className="h-full w-full lg:max-w-md lg:h-full bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 lg:shadow-2xl relative overflow-hidden">
      {/* Floating Social Media Buttons */}
      <div className="fixed top-4 right-0 lg:absolute lg:top-4 lg:right-0 z-50 flex flex-col">
        <a
          href="https://www.youtube.com/@planetaketo"
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 bg-red-600 hover:bg-red-700 flex items-center justify-center transition-all hover:scale-110 shadow-lg rounded-l-lg border-l border-t border-b border-red-700"
        >
          <Youtube size={14} className="text-white" />
        </a>
        <a
          href="https://www.instagram.com/planetaketorecetas/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 flex items-center justify-center transition-all hover:scale-110 shadow-lg rounded-l-lg border-l border-purple-600"
        >
          <Instagram size={14} className="text-white" />
        </a>
        <a
          href="https://www.tiktok.com/@planetaketo"
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 bg-gray-900 hover:bg-black flex items-center justify-center transition-all hover:scale-110 shadow-lg rounded-l-lg border-l border-gray-700"
        >
          <MessageCircle size={14} className="text-white" />
        </a>
        <a
          href="https://www.facebook.com/planetaketo"
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-all hover:scale-110 shadow-lg rounded-l-lg border-l border-blue-700"
        >
          <Facebook size={14} className="text-white" />
        </a>
        <a
          href="mailto:info@planetaketo.es"
          className="w-8 h-8 bg-green-600 hover:bg-green-700 flex items-center justify-center transition-all hover:scale-110 shadow-lg rounded-l-lg border-l border-b border-green-700"
        >
          <Mail size={14} className="text-white" />
        </a>
      </div>
      
      {/* Top AdSense Ad Space */}
      <div className="w-full h-[8vh] flex items-center justify-center border-b border-white/10">
        <div className="w-full max-w-sm h-16 bg-white/5 rounded-lg border border-white/20 flex items-center justify-center">
          <span className="text-white/60 text-xs">AdSense - Top Banner</span>
        </div>
      </div>
      
      {/* Header - 15% on mobile */}
      <div className="h-[15vh] px-4 py-3 flex items-center border-b border-white/10">
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

      {/* Products Section - 45% on mobile */}
      <div className="h-[45vh] px-4 py-3 border-b border-white/10">
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
              disabled={productsOffset >= products.length - 2}
              className="p-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        
        <div className="h-[calc(100%-48px)] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          <div className="grid grid-cols-1 gap-3">
            {visibleProducts.map((product: Product, index) => (
              <div 
                key={product._id}
                className="h-auto"
              >
                <div 
                  onClick={() => handleProductClick(product._id, product)}
                  className="rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-3 hover:bg-white/20 transition-all cursor-pointer group"
                >
                  <div className="flex gap-3">
                    {/* Imagen - 30% */}
                    <div className="w-[30%] flex-shrink-0">
                      {product.image && (
                        <img 
                          src={product.image} 
                          alt={product.title}
                          className="w-full aspect-square object-cover rounded-lg group-hover:scale-105 transition-transform"
                        />
                      )}
                    </div>
                    
                    {/* Contenido - 70% */}
                    <div className="w-[70%] flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm sm:text-base font-semibold text-white mb-1 line-clamp-2 leading-tight">
                          {product.title}
                        </h3>
                        <div className="text-white/70 text-xs mb-2 line-clamp-3 leading-tight">
                          <p>{product.description}</p>
                        </div>
                      </div>
                      
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
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Amazon Lists Section - 24% on mobile */}
      <div className="h-[24vh] px-4 py-3">
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
          className="flex gap-3 overflow-x-auto lg:overflow-x-visible lg:grid lg:grid-cols-2 lg:gap-2 h-[calc(100%-88px)] pb-2 scrollbar-hide"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {amazonLists.map((list: AmazonList) => (
            <div 
              key={list._id}
              className="flex-none w-64 sm:w-72 lg:w-full h-full lg:h-auto"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div
                onClick={() => handleAmazonClick(list._id, list.url)}
                className="block h-full lg:h-auto rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-3 hover:bg-white/20 transition-all group cursor-pointer"
              >
                <div className="h-full lg:h-auto flex gap-3">
                  {/* 30% para imagen a la izquierda */}
                  <div className="w-[30%] flex-shrink-0">
                    {list.image ? (
                      <img 
                        src={list.image} 
                        alt={list.title}
                        className="w-full h-full lg:h-auto lg:aspect-square object-cover rounded-lg group-hover:scale-105 transition-transform"
                        style={{ padding: '3%' }}
                      />
                    ) : (
                      <div className="w-full h-full lg:h-auto lg:aspect-square bg-white/10 rounded-lg flex items-center justify-center">
                        <ExternalLink size={20} className="text-white/50" />
                      </div>
                    )}
                  </div>
                  
                  {/* 70% para contenido a la derecha */}
                  <div className="w-[70%] flex flex-col justify-between">
                    <h3 className="text-sm sm:text-base font-semibold text-white mb-2 line-clamp-3 lg:line-clamp-2 leading-tight">
                      {list.title}
                    </h3>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="px-2 py-1 rounded-full bg-white/20 text-white/80 text-xs">
                        {list.category}
                      </span>
                      <span className="text-white/60 text-xs">
                        {list.clickCount || 0} clicks
                      </span>
                    </div>
                  </div>
                </div>
              </div>
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

      {/* Bottom AdSense Ad Space */}
      <div className="w-full h-[8vh] flex items-center justify-center border-t border-white/10">
        <div className="w-full max-w-sm h-16 bg-white/5 rounded-lg border border-white/20 flex items-center justify-center">
          <span className="text-white/60 text-xs">AdSense - Bottom Banner</span>
        </div>
      </div>

      {/* Modal de Compra */}
      {selectedProduct && (
        <PurchaseModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
        </div> {/* Close lg:max-w-md container */}
      </div> {/* Close lg:flex container */}
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white font-['Inter'] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  )
}