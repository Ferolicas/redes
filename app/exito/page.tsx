'use client'

import { useSearchParams } from 'next/navigation'
import { CheckCircle, Download, Mail } from 'lucide-react'
import Link from 'next/link'

export default function ExitoPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Pago Exitoso!
          </h1>
          <p className="text-gray-600">
            Tu compra se ha procesado correctamente
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center space-x-2 text-green-800 mb-2">
            <Mail size={20} />
            <span className="font-medium">Revisa tu email</span>
          </div>
          <p className="text-sm text-green-700">
            Te hemos enviado un correo con los detalles de tu compra y las instrucciones para acceder a tu producto.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            <strong>Código de transacción:</strong> Se ha enviado a tu email
          </p>
          <p className="text-sm text-gray-600">
            <strong>Contraseña de acceso:</strong> KETOPAGO1234*
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <Link
            href="/links"
            className="block w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg 
                     font-medium hover:shadow-lg transition-all"
          >
            Ver más productos
          </Link>
          
          <Link
            href="https://planetaketo.es"
            className="block w-full border border-gray-300 text-gray-700 py-3 rounded-lg 
                     font-medium hover:bg-gray-50 transition-all"
          >
            Ir a Planeta Keto
          </Link>
        </div>
      </div>
    </div>
  )
}