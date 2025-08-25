'use client'

import React, { Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { ShoppingBag, ExternalLink, Sparkles, ChevronLeft, ChevronRight, Youtube, Instagram, MessageCircle, Facebook, Mail } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import AmazonCard from '../components/AmazonCard'
import PurchaseModal from '../components/PurchaseModal'
import { Product, AmazonList } from '../types'

function HomePageContent() {
  const searchParams = useSearchParams()
  const productId = searchParams.get('product')
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
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
      const data = await res.json()
      // Ordenar productos: fijados primero, luego por fecha de creación descendente
      return data.sort((a: Product, b: Product) => {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
    },
  })

  const { data: amazonLists = [] } = useQuery<AmazonList[]>({
    queryKey: ['amazonLists'],
    queryFn: async () => {
      const res = await fetch('/api/amazon-lists')
      return res.json()
    },
  })


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


  return (
    <div className="h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white font-['Inter'] overflow-hidden relative">
      {/* Desktop Container - Centers the mobile view */}
      <div className="h-full w-full lg:flex lg:items-center lg:justify-center lg:bg-black/20 lg:p-4">
        <div className="h-full w-full lg:max-w-md lg:h-[95vh] bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 lg:shadow-2xl lg:rounded-2xl relative overflow-hidden">
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
      <div className="w-full h-[60px] flex items-center justify-center border-b border-white/10">
        <div className="w-[320px] h-[50px] flex items-center justify-center">
          <Script id="top-banner-config" strategy="lazyOnload">
            {`
              atOptions = {
                'key' : '1fb4c7e89e9afdaf65fe05041740b21e',
                'format' : 'iframe',
                'height' : 50,
                'width' : 320,
                'params' : {}
              };
            `}
          </Script>
          <Script 
            src="//www.highperformanceformat.com/1fb4c7e89e9afdaf65fe05041740b21e/invoke.js"
            strategy="lazyOnload"
          />
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
          
          {/* Text Content - 63% (reducido 10%) */}
          <div className="w-[63%] min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-white mb-1 line-clamp-2 leading-tight">
              {webElements?.title || 'Planeta Keto'}
            </h1>
            <p className="text-sm text-white/80 mb-1 line-clamp-1">
              {webElements?.subtitle || '¡Recetas Keto para todos!'}
            </p>
            {webElements?.description && (
              <p className="text-white/70 text-xs line-clamp-2 leading-tight whitespace-pre-line">
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
        </div>
        
        <div 
          className="flex gap-3 overflow-x-auto h-[calc(100%-48px)] pb-2 scrollbar-hide"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {products.map((product: Product) => (
            <div 
              key={product._id}
              className="flex-none w-64 sm:w-72 h-full"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div 
                onClick={() => handleProductClick(product._id, product)}
                className="h-full rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-3 lg:p-2 hover:bg-white/20 transition-all cursor-pointer group"
              >
                <div className="h-full flex flex-col">
                  {product.image && (
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="w-full h-32 sm:h-36 lg:h-24 object-cover rounded-lg mb-2 group-hover:scale-105 transition-transform"
                    />
                  )}
                  {product.featured && (
                    <div className="mb-2">
                      <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-xs font-medium border border-yellow-500/30">
                        ⭐ Destacado
                      </span>
                    </div>
                  )}
                  <h3 className="text-sm sm:text-base font-semibold text-white mb-1 line-clamp-2 leading-tight">
                    {product.title}
                  </h3>
                  <div className="text-white/70 text-xs mb-2 flex-1 leading-tight overflow-hidden">
                    <p className="whitespace-pre-wrap line-clamp-4">
                      {product.description}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-end justify-between">
                      <div className="text-left flex-1">
                        {product.originalPrice && product.originalPrice > product.price && (
                          <>
                            <span className="text-white/50 line-through text-xs block">
                              €{product.originalPrice}
                            </span>
                            <div className="flex items-center gap-1 flex-wrap">
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
                      <span className="px-2 py-1 rounded-full bg-white/20 text-white/80 text-xs ml-2">
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

      {/* Amazon Lists Section - 24% on mobile */}
      <div className="h-[24vh] lg:h-[30vh] px-4 py-3">
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
              <div
                onClick={() => handleAmazonClick(list._id, list.url)}
                className="block h-full rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-2 lg:p-3 hover:bg-white/20 transition-all group cursor-pointer"
              >
                <div className="h-full flex gap-3">
                  {/* 30% para imagen a la izquierda */}
                  <div className="w-[30%] flex-shrink-0">
                    {list.image ? (
                      <img 
                        src={list.image} 
                        alt={list.title}
                        className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform"
                        style={{ padding: '3%' }}
                      />
                    ) : (
                      <div className="w-full h-full bg-white/10 rounded-lg flex items-center justify-center">
                        <ExternalLink size={20} className="text-white/50" />
                      </div>
                    )}
                  </div>
                  
                  {/* 70% para contenido a la derecha */}
                  <div className="w-[70%] flex flex-col justify-between">
                    <h3 className="text-sm sm:text-base lg:text-sm font-semibold text-white mb-1 line-clamp-4 leading-tight">
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
      <div className="w-full h-[60px] flex items-center justify-center border-t border-white/10">
        <div className="w-[320px] h-[50px] flex items-center justify-center">
          <Script 
            src="//pl27507724.profitableratecpm.com/656d60aa1292caa70d9528146f9a8fb1/invoke.js"
            strategy="lazyOnload"
            data-cfasync="false"
          />
          <div id="container-656d60aa1292caa70d9528146f9a8fb1"></div>
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