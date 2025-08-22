'use client'

import { useState, useEffect } from 'react'
import { 
  ArrowLeft,
  Save,
  Upload
} from 'lucide-react'

export default function AdminWebPage() {
  const [webElements, setWebElements] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  
  const [webForm, setWebForm] = useState<{
    title: string;
    subtitle: string;
    description: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    logo: File | null;
  }>({
    title: '',
    subtitle: '',
    description: '',
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    accentColor: '#10B981',
    logo: null
  })

  useEffect(() => {
    fetchWebElements()
  }, [])

  const fetchWebElements = async () => {
    try {
      const response = await fetch('/api/web-elements')
      if (!response.ok) {
        throw new Error('Failed to fetch web elements')
      }
      const data = await response.json()
      if (data) {
        setWebElements(data)
        setWebForm({
          title: data.title || '',
          subtitle: data.subtitle || '',
          description: data.description || '',
          primaryColor: data.colors?.primary || '#3B82F6',
          secondaryColor: data.colors?.secondary || '#8B5CF6',
          accentColor: data.colors?.accent || '#10B981',
          logo: null
        })
      }
    } catch (err: any) {
      setError(err.message)
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setWebForm(prev => ({ ...prev, [field]: value }))
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setWebForm(prev => ({ ...prev, logo: file }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      // TODO: Implementar actualización de elementos web
      console.log('Web elements to update:', webForm)
      // Aquí iría la lógica para actualizar en Sanity
      
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulación
      
      alert('Elementos de la web actualizados exitosamente')
    } catch (err: any) {
      alert('Error al actualizar: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white font-['Inter'] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/80">Cargando elementos de la web...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white font-['Inter']">
      {/* Header */}
      <div className="px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => window.history.back()}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Administrar Web</h1>
            <p className="text-white/80">Configurar elementos visuales de la página</p>
          </div>
        </div>

        {/* Formulario */}
        <div className="max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Logo */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">Logo</label>
              <div className="flex items-center gap-4">
                {webElements?.logo && (
                  <img 
                    src={webElements.logo} 
                    alt="Logo actual" 
                    className="h-16 w-16 object-contain rounded-lg bg-white/10 p-2"
                  />
                )}
                <label className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl hover:bg-white/30 transition-all cursor-pointer">
                  <Upload size={16} />
                  Subir Logo
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Título */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">Título</label>
              <input 
                value={webForm.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full rounded-2xl border border-white/30 bg-white/10 backdrop-blur-md p-4 text-white placeholder-white/60 focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                placeholder="Título de la web"
                required
              />
            </div>

            {/* Subtítulo */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">Subtítulo</label>
              <input 
                value={webForm.subtitle}
                onChange={(e) => handleInputChange('subtitle', e.target.value)}
                className="w-full rounded-2xl border border-white/30 bg-white/10 backdrop-blur-md p-4 text-white placeholder-white/60 focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                placeholder="Subtítulo de la web"
                required
              />
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">Descripción</label>
              <textarea 
                value={webForm.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="h-24 w-full rounded-2xl border border-white/30 bg-white/10 backdrop-blur-md p-4 text-white placeholder-white/60 focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all resize-none"
                placeholder="Descripción de la web"
                required
              />
            </div>

            {/* Colores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/90">Color Primario</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="color"
                    value={webForm.primaryColor}
                    onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                    className="h-12 w-16 rounded-lg border border-white/30 bg-transparent cursor-pointer"
                  />
                  <input 
                    value={webForm.primaryColor}
                    onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                    className="flex-1 rounded-2xl border border-white/30 bg-white/10 backdrop-blur-md p-3 text-white placeholder-white/60 focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/90">Color Secundario</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="color"
                    value={webForm.secondaryColor}
                    onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                    className="h-12 w-16 rounded-lg border border-white/30 bg-transparent cursor-pointer"
                  />
                  <input 
                    value={webForm.secondaryColor}
                    onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                    className="flex-1 rounded-2xl border border-white/30 bg-white/10 backdrop-blur-md p-3 text-white placeholder-white/60 focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/90">Color de Acento</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="color"
                    value={webForm.accentColor}
                    onChange={(e) => handleInputChange('accentColor', e.target.value)}
                    className="h-12 w-16 rounded-lg border border-white/30 bg-transparent cursor-pointer"
                  />
                  <input 
                    value={webForm.accentColor}
                    onChange={(e) => handleInputChange('accentColor', e.target.value)}
                    className="flex-1 rounded-2xl border border-white/30 bg-white/10 backdrop-blur-md p-3 text-white placeholder-white/60 focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Botón Guardar */}
            <button 
              type="submit"
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 p-4 text-white hover:bg-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}