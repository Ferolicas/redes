'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, Check } from 'lucide-react'
import { Product } from '@/types'
import { urlFor } from '@/lib/sanity'
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative">
          {product.image && (
            <div className="aspect-square w-full bg-gradient-to-br from-blue-500 to-purple-600">
              <Image
                src={urlFor(product.image).width(400).height(400).url()}
                alt={product.title}
                width={400}
                height={400}
                className="w-full h-full object-cover rounded-t-2xl"
              />
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-2 hover:bg-black/70"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {product.title}
          </h2>
          
          <p className="text-gray-600 mb-4">
            {product.description}
          </p>

          {/* Qué incluye */}
          {product.includes && product.includes.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Qué incluye:</h3>
              <div className="space-y-2">
                {product.includes.map((item, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Check className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Precio */}
          <div className="mb-6">
            <div className="text-3xl font-bold text-gray-900">
              {product.price}€
            </div>
          </div>

          {/* Botón de compra */}
          <button
            onClick={handlePurchase}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl 
                     font-semibold text-lg transition-all hover:shadow-lg hover:scale-105 
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Procesando...' : 'Comprar ahora'}
          </button>

          <p className="text-xs text-gray-500 mt-3 text-center">
            Pago seguro con Stripe • Apple Pay • Google Pay disponibles
          </p>
        </div>
      </div>
    </div>
  )
}