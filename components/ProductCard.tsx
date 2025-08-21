import React from 'react'
import Image from 'next/image'
import { Product } from '@/types'
import { urlFor } from '@/lib/sanity'

interface ProductCardProps {
  product: Product
  onClick: () => void
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 cursor-pointer 
                 transform transition-all duration-200 hover:scale-105 hover:bg-white/20 
                 hover:shadow-xl hover:shadow-purple-500/25"
    >
      {product.image && (
        <div className="aspect-square mb-3 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
          <Image
            src={urlFor(product.image).width(200).height(200).url()}
            alt={product.title}
            width={200}
            height={200}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <h3 className="text-white font-semibold text-sm mb-2 leading-tight">
        {product.title}
      </h3>
      
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-white">
          {product.price}€
        </span>
        <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs 
                         px-3 py-1.5 rounded-full font-medium transition-all hover:shadow-lg">
          Comprar
        </button>
      </div>
    </div>
  )
}