'use client'

import { useState } from 'react'
import { X, Check } from 'lucide-react'
import { Product } from '@/types'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PurchaseModalProps {
  product: Product
  onClose: () => void
}

export default function PurchaseModal({ product, onClose }: PurchaseModalProps) {
  const [loading, setLoading] = useState(false)

  const handlePurchase = async () => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: product.stripePriceId,
          productId: product._id,
        }),
      })

      const { sessionId } = await response.json()
      const stripe = await stripePromise

      if (stripe) {
        await stripe.redirectToCheckout({ sessionId })
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al procesar el pago. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const discountPercentage = product.originalPrice && product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl max-w-sm w-full h-[90vh] flex flex-col text-white border border-white/10">
        {/* Header - 20% */}
        <div className="h-[20%] relative p-4 border-b border-white/10 flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 bg-white/20 text-white rounded-full p-2 hover:bg-white/30 backdrop-blur-md z-10"
          >
            <X size={16} />
          </button>
          
          <div className="flex items-center gap-4 h-full">
            {product.image && (
              <img
                src={product.image}
                alt={product.title}
                className="w-16 h-16 object-cover rounded-lg bg-white/10"
              />
            )}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-white mb-1 line-clamp-2 leading-tight">
                {product.title}
              </h2>
              <div className="flex items-center gap-2">
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-white/60 line-through text-sm">
                      €{product.originalPrice}
                    </span>
                    <span className="text-white font-bold text-xl">
                      €{product.price}
                    </span>
                    <span className="text-green-400 text-sm font-medium bg-green-400/20 px-2 py-1 rounded">
                      {discountPercentage}% off
                    </span>
                  </>
                )}
                {(!product.originalPrice || product.originalPrice <= product.price) && (
                  <span className="text-white font-bold text-xl">
                    €{product.price}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description - 40% */}
        <div className="h-[40%] p-4 border-b border-white/10 flex-shrink-0">
          <h3 className="text-sm font-semibold text-white/90 mb-3">Descripción</h3>
          <div className="h-[calc(100%-32px)] overflow-y-auto scrollbar-hide">
            <p className="text-white/70 text-sm mb-4 leading-relaxed">
              {product.description}
            </p>

            {/* Qué incluye */}
            {product.includes && product.includes.length > 0 && (
              <div>
                <h4 className="font-semibold text-white/90 mb-2 text-sm">Qué incluye:</h4>
                <div className="space-y-2">
                  {product.includes.map((item, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Check className="text-green-400 mt-0.5 flex-shrink-0" size={14} />
                      <span className="text-xs text-white/70 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payment Section - 40% */}
        <div className="h-[40%] p-4 flex flex-col justify-center flex-shrink-0">
          <h3 className="text-sm font-semibold text-white/90 mb-4 text-center">Finalizar Compra</h3>
          
          <div className="flex-1 flex flex-col justify-center">
            <button
              onClick={handlePurchase}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl 
                       font-semibold text-lg transition-all hover:shadow-lg hover:scale-105 
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mb-4"
            >
              {loading ? 'Procesando...' : 'Comprar Ahora'}
            </button>

            <div className="text-center space-y-2">
              <p className="text-xs text-white/60">
                🔒 Pago seguro con Stripe
              </p>
              <p className="text-xs text-white/60">
                💳 Tarjetas • Apple Pay • Google Pay
              </p>
              <p className="text-xs text-white/50">
                Procesamiento instantáneo y seguro
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}