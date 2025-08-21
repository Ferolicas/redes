'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface CreateListModalProps {
  onClose: () => void
}

export default function CreateListModal({ onClose }: CreateListModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    order: 0,
  })

  const queryClient = useQueryClient()

  const createListMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/amazon-lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amazonLists'] })
      onClose()
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createListMutation.mutate(formData)
  }

  return (
   <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
     <div className="bg-white rounded-2xl max-w-md w-full">
       <div className="flex justify-between items-center p-6 border-b">
         <h2 className="text-2xl font-bold">Crear Lista de Ideas</h2>
         <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
           <X size={24} />
         </button>
       </div>

       <form onSubmit={handleSubmit} className="p-6 space-y-6">
         {/* Título */}
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">
             Título de la Lista
           </label>
           <input
             type="text"
             required
             placeholder="Aceites Keto Recomendados"
             value={formData.title}
             onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
           />
         </div>

         {/* URL */}
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">
             Enlace de Amazon
           </label>
           <input
             type="url"
             required
             placeholder="https://amazon.es/..."
             value={formData.url}
             onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
           />
         </div>

         {/* Orden */}
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">
             Posición de Orden
           </label>
           <input
             type="number"
             min="0"
             value={formData.order}
             onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
           />
           <p className="text-sm text-gray-500 mt-1">
             Orden más bajo aparece primero (0 = arriba)
           </p>
         </div>

         {/* Botones */}
         <div className="flex justify-end space-x-4 pt-4">
           <button
             type="button"
             onClick={onClose}
             className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
           >
             Cancelar
           </button>
           
           <button
             type="submit"
             disabled={createListMutation.isPending}
             className="px-6 py-2 bg-gradient-to-r from-orange-500 to-yellow-600 text-white rounded-lg 
                        hover:shadow-lg transition-all disabled:opacity-50"
           >
             {createListMutation.isPending ? 'Creando...' : 'Crear Lista'}
           </button>
         </div>
       </form>
     </div>
   </div>
 )
}