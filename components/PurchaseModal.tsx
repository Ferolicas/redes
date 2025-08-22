'use client'

import { useState, useEffect } from 'react'
import { X, Check } from 'lucide-react'
import { Product } from '@/types'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PurchaseModalProps {
  product: Product
  onClose: () => void
}

function CheckoutForm({ product, onClose }: { product: Product; onClose: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setLoading(true)
    setError(null)

    const { error: submitError } = await elements.submit()
    if (submitError) {
      setError(submitError.message || 'Error al procesar el pago')
      setLoading(false)
      return
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/exito`,
      },
    })

    if (confirmError) {
      setError(confirmError.message || 'Error al confirmar el pago')
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement 
        options={{
          layout: "tabs",
        }}
      />
      {error && (
        <div className="text-red-400 text-sm p-3 bg-red-500/10 rounded-lg border border-red-500/20">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl 
                 font-semibold text-lg transition-all hover:shadow-lg hover:scale-105 
                 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {loading ? 'Procesando...' : `Pagar €${product.price}`}
      </button>
    </form>
  )
}

export default function PurchaseModal({ product, onClose }: PurchaseModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loadingIntent, setLoadingIntent] = useState(true)

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/create-checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: product._id,
          }),
        })

        const data = await response.json()
        if (data.error) {
          console.error('Error:', data.error)
          alert('Error al crear el pago. Inténtalo de nuevo.')
          onClose()
          return
        }

        setClientSecret(data.clientSecret)
      } catch (error) {
        console.error('Error:', error)
        alert('Error al crear el pago. Inténtalo de nuevo.')
        onClose()
      } finally {
        setLoadingIntent(false)
      }
    }

    createPaymentIntent()
  }, [product._id, onClose])

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
        <div className="h-[40%] p-4 flex flex-col flex-shrink-0">
          <h3 className="text-sm font-semibold text-white/90 mb-4 text-center">Finalizar Compra</h3>
          
          <div className="flex-1 flex flex-col justify-center">
            {loadingIntent ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <span className="ml-3 text-white/70">Preparando pago...</span>
              </div>
            ) : clientSecret ? (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'night',
                    variables: {
                      colorPrimary: '#3b82f6',
                      colorBackground: '#1e293b',
                      colorText: '#f1f5f9',
                      colorDanger: '#ef4444',
                      fontFamily: 'Inter, system-ui, sans-serif',
                      spacingUnit: '4px',
                      borderRadius: '8px',
                    },
                  },
                }}
              >
                <CheckoutForm product={product} onClose={onClose} />
              </Elements>
            ) : (
              <div className="text-center text-red-400">
                Error al cargar el formulario de pago
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}