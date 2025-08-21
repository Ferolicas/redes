import React from 'react'
import { AmazonList } from '@/types'
import { urlFor } from '@/lib/sanity'
import { ExternalLink } from 'lucide-react'

interface AmazonCardProps {
  list: AmazonList
}

export default function AmazonCard({ list }: AmazonCardProps) {
  const handleClick = () => {
    window.location.href = list.url
  }

  return (
    <div
      onClick={handleClick}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 cursor-pointer 
                 transform transition-all duration-200 hover:scale-102 hover:bg-white/20 
                 hover:shadow-xl hover:shadow-orange-500/25 flex items-center space-x-4"
    >
      {list.image && (
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-orange-500 to-yellow-600 flex-shrink-0">
          <img
            src={urlFor(list.image).width(64).height(64).url()}
            alt={list.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="flex-1">
        <h3 className="text-white font-semibold text-sm mb-1 leading-tight">
          {list.title}
        </h3>
        <p className="text-gray-400 text-xs">Ver en Amazon</p>
      </div>
      
      <ExternalLink className="text-gray-400" size={16} />
    </div>
  )
}