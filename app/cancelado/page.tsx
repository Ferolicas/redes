import { XCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CanceladoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center">
        <div className="mb-6">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Pago Cancelado
          </h1>
          <p className="text-gray-600">
            No se procesó ningún pago. Puedes intentarlo de nuevo cuando gustes.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/links"
            className="block w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg 
                     font-medium hover:shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            <ArrowLeft size={20} />
            <span>Volver a productos</span>
          </Link>
          
          <p className="text-sm text-gray-500">
            Si tuviste problemas con el pago, puedes contactarnos
          </p>
        </div>
      </div>
    </div>
  )
}