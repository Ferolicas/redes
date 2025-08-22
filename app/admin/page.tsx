'use client'

import { useState, useEffect } from 'react' // Modificado
import AdminLogin from '@/components/AdminLogin'
import { 
  Plus, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  BarChart3,
  ShoppingBag,
  Package,
  ChevronDown,
  ChevronUp,
  List,
  LogOut
} from 'lucide-react'
import { urlFor } from '@/lib/sanity'

// Tipos para los formularios
interface ProductFormData {
  title: string;
  description: string;
  price: string;
  originalPrice: string;
  stripePriceId: string;
  category: string;
  image: File | null;
  file: File | null;
}

interface ListFormData {
  title: string;
  category: string;
  url: string;
  image: File | null;
}

// Modal para crear producto
const CreateProductModal = ({ 
  onClose, 
  productForm, 
  setProductForm 
}: { 
  onClose: () => void;
  productForm: ProductFormData;
  setProductForm: React.Dispatch<React.SetStateAction<ProductFormData>>;
}) => {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageAsset = null
      let fileAsset = null

      // Subir imagen si existe
      if (productForm.image) {
        const imageFormData = new FormData()
        imageFormData.append('file', productForm.image)
        const imageResponse = await fetch('/api/upload', {
          method: 'POST',
          body: imageFormData,
        })
        if (imageResponse.ok) {
          imageAsset = await imageResponse.json()
        }
      }

      // Subir archivo PDF si existe
      if (productForm.file) {
        const fileFormData = new FormData()
        fileFormData.append('file', productForm.file)
        const fileResponse = await fetch('/api/upload', {
          method: 'POST',
          body: fileFormData,
        })
        if (fileResponse.ok) {
          fileAsset = await fileResponse.json()
        }
      }

      // Preparar datos para enviar
      const productData = {
        title: productForm.title,
        slug: {
          _type: 'slug',
          current: productForm.title.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .trim()
        },
        description: productForm.description,
        price: parseFloat(productForm.price),
        originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : undefined,
        stripePriceId: productForm.stripePriceId,
        category: productForm.category,
        ...(imageAsset && {
          image: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: imageAsset._id
            }
          }
        }),
        ...(fileAsset && {
          pdfFile: {
            _type: 'file',
            asset: {
              _type: 'reference',
              _ref: fileAsset._id
            }
          }
        })
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        throw new Error('Error al crear el producto')
      }

      const result = await response.json()
      console.log('Producto creado exitosamente:', result)
      
      // Recargar página para mostrar el nuevo producto
      window.location.reload()
      onClose()
    } catch (error) {
      console.error('Error al crear producto:', error)
      alert('Error al crear el producto. Por favor, inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setProductForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="m-4 w-full max-w-md animate-in slide-in-from-bottom-4 duration-300 rounded-3xl bg-slate-900 p-8 shadow-2xl border border-slate-700 max-h-[90vh] overflow-y-auto">
        <h2 className="mb-6 text-xl font-semibold text-white">Nuevo Producto</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            value={productForm.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full rounded-2xl border border-slate-600 bg-slate-800 p-4 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            placeholder="Nombre del producto"
            required
          />
          <textarea 
            value={productForm.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="h-24 w-full rounded-2xl border border-slate-600 bg-slate-800 p-4 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
            placeholder="Descripción del producto"
          />
          <input 
            value={productForm.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            className="w-full rounded-2xl border border-slate-600 bg-slate-800 p-4 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            placeholder="Precio a Cobrar (€)"
            type="number"
            step="0.01"
            min="0"
            required
          />
          <input 
            value={productForm.originalPrice}
            onChange={(e) => handleInputChange('originalPrice', e.target.value)}
            className="w-full rounded-2xl border border-slate-600 bg-slate-800 p-4 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            placeholder="Precio Original (€) - Opcional"
            type="number"
            step="0.01"
            min="0"
          />
          <input 
            value={productForm.stripePriceId}
            onChange={(e) => handleInputChange('stripePriceId', e.target.value)}
            className="w-full rounded-2xl border border-slate-600 bg-slate-800 p-4 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            placeholder="Stripe Price ID"
            required
          />
          <select
            value={productForm.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full rounded-2xl border border-slate-600 bg-slate-800 p-4 text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          >
            <option value="Asesoria">Asesoría</option>
            <option value="Libro">Libro</option>
            <option value="Servicios">Servicios</option>
          </select>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Imagen del producto</label>
            <input 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0]
                if (file) {
                  setProductForm(prev => ({ ...prev, image: file }))
                }
              }}
              className="w-full rounded-2xl border border-slate-600 bg-slate-800 p-4 text-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
              type="file"
              accept="image/*"
              required
            />
            {productForm.image && (
              <p className="text-xs text-green-400">Imagen seleccionada: {productForm.image.name}</p>
            )}
          </div>
          {productForm.category === 'Libro' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Archivo PDF del libro</label>
              <input 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setProductForm(prev => ({ ...prev, file: file }))
                  }
                }}
                className="w-full rounded-2xl border border-slate-600 bg-slate-800 p-4 text-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
                type="file"
                accept=".pdf"
              />
              {productForm.file && (
                <p className="text-xs text-green-400">Archivo seleccionado: {productForm.file.name}</p>
              )}
            </div>
          )}
          <div className="mt-6 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-2xl bg-slate-800 py-3 px-4 font-medium text-slate-300 hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 py-3 px-4 font-medium text-white hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Creando...' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Modal para crear lista
const CreateListModal = ({ 
  onClose, 
  listForm, 
  setListForm 
}: { 
  onClose: () => void;
  listForm: ListFormData;
  setListForm: React.Dispatch<React.SetStateAction<ListFormData>>;
}) => {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageAsset = null

      // Subir imagen si existe
      if (listForm.image) {
        const imageFormData = new FormData()
        imageFormData.append('file', listForm.image)
        const imageResponse = await fetch('/api/upload', {
          method: 'POST',
          body: imageFormData,
        })
        if (imageResponse.ok) {
          imageAsset = await imageResponse.json()
        }
      }

      // Preparar datos para enviar
      const listData = {
        title: listForm.title,
        slug: {
          _type: 'slug',
          current: listForm.title.toLowerCase()
            .replace(/[^\w\s-]/g, '') // Eliminar caracteres especiales
            .replace(/\s+/g, '-')     // Reemplazar espacios por guiones
            .trim()
        },
        category: listForm.category,
        url: listForm.url,
        ...(imageAsset && {
          image: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: imageAsset._id
            }
          }
        })
      }

      const response = await fetch('/api/amazon-lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listData),
      })

      if (!response.ok) {
        throw new Error('Error al crear la lista')
      }

      const result = await response.json()
      console.log('Lista creada exitosamente:', result)
      
      // Recargar página para mostrar la nueva lista
      window.location.reload()
      onClose()
    } catch (error) {
      console.error('Error al crear lista:', error)
      alert('Error al crear la lista. Por favor, inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setListForm(prev => ({ ...prev, [field]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setListForm(prev => ({ ...prev, image: file }))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="m-4 w-full max-w-md animate-in slide-in-from-bottom-4 duration-300 rounded-3xl bg-slate-900 p-8 shadow-2xl border border-slate-700">
        <h2 className="mb-6 text-xl font-semibold text-white">Nueva Lista Amazon</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            value={listForm.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full rounded-2xl border border-slate-600 bg-slate-800 p-4 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            placeholder="Título de la lista"
            required
          />
          <select
            value={listForm.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full rounded-2xl border border-slate-600 bg-slate-800 p-4 text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          >
            <option value="cooking">Cocina Keto</option>
            <option value="supplements">Suplementos</option>
            <option value="utensils">Utensilios</option>
            <option value="ingredients">Ingredientes</option>
            <option value="books">Libros</option>
            <option value="sports">Deportes</option>
          </select>
          <input 
            value={listForm.url}
            onChange={(e) => handleInputChange('url', e.target.value)}
            className="w-full rounded-2xl border border-slate-600 bg-slate-800 p-4 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            placeholder="URL de Amazon"
            type="url"
            required
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Imagen de la lista</label>
            <input 
              onChange={handleImageChange}
              className="w-full rounded-2xl border border-slate-600 bg-slate-800 p-4 text-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
              type="file"
              accept="image/*"
            />
            {listForm.image && (
              <p className="text-xs text-green-400">Imagen seleccionada: {listForm.image.name}</p>
            )}
          </div>
          <div className="mt-6 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-2xl bg-slate-800 py-3 px-4 font-medium text-slate-300 hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 py-3 px-4 font-medium text-white hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Creando...' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showProductModal, setShowProductModal] = useState(false)
  const [showListModal, setShowListModal] = useState(false)
  const [activeView, setActiveView] = useState('dashboard')
  const [isExpanded, setIsExpanded] = useState(false)

  // Verificar autenticación al cargar
  useEffect(() => {
    const authStatus = localStorage.getItem('admin_authenticated')
    setIsAuthenticated(authStatus === 'true')
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated')
    setIsAuthenticated(false)
  }

  // --- Nuevos estados para los productos ---
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // --- Estados para ventas exitosas ---
  const [successfulSales, setSuccessfulSales] = useState<any[]>([])
  const [salesLoading, setSalesLoading] = useState(true)
  const [salesError, setSalesError] = useState(null)
  
  // --- Estados para formularios ---
  const [productForm, setProductForm] = useState<ProductFormData>({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    stripePriceId: '',
    category: 'Asesoria',
    image: null,
    file: null
  })
  
  const [listForm, setListForm] = useState<ListFormData>({
    title: '',
    category: 'cooking',
    url: '',
    image: null
  })
  
  // --- Estados para estadísticas del dashboard ---
  const [dashboardStats, setDashboardStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [statsError, setStatsError] = useState(null)
  
  // --- Estados para pedidos ---
  const [orders, setOrders] = useState<any[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [ordersError, setOrdersError] = useState(null)
  const [orderStatusFilter, setOrderStatusFilter] = useState('all')
  
  // --- Estados para listas de Amazon ---
  const [amazonLists, setAmazonLists] = useState<any[]>([])
  const [listsLoading, setListsLoading] = useState(true)
  const [listsError, setListsError] = useState(null)

  // --- Hook para cargar productos desde la API ---
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Error al obtener los productos');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []); // Se ejecuta solo una vez al cargar el componente

  // --- Hook para cargar ventas exitosas ---
  useEffect(() => {
    const fetchSuccessfulSales = async () => {
      setSalesLoading(true);
      setSalesError(null);
      try {
        const response = await fetch('/api/successful-sales');
        if (!response.ok) {
          throw new Error('Error al obtener las ventas');
        }
        const data = await response.json();
        setSuccessfulSales(data);
      } catch (err: any) {
        setSalesError(err.message);
        console.error(err);
      } finally {
        setSalesLoading(false);
      }
    };

    fetchSuccessfulSales();
  }, []);
  
  // --- Hook para cargar listas de Amazon ---
  useEffect(() => {
    const fetchAmazonLists = async () => {
      setListsLoading(true);
      setListsError(null);
      try {
        const response = await fetch('/api/amazon-lists');
        if (!response.ok) {
          throw new Error('Error al obtener las listas');
        }
        const data = await response.json();
        setAmazonLists(data);
      } catch (err: any) {
        setListsError(err.message);
        console.error(err);
      } finally {
        setListsLoading(false);
      }
    };

    fetchAmazonLists();
  }, []);

  // --- Hook para cargar estadísticas del dashboard ---
  useEffect(() => {
    const fetchDashboardStats = async () => {
      setStatsLoading(true);
      setStatsError(null);
      try {
        const response = await fetch('/api/dashboard-stats');
        if (!response.ok) {
          throw new Error('Error al obtener las estadísticas');
        }
        const data = await response.json();
        setDashboardStats(data);
      } catch (err: any) {
        setStatsError(err.message);
        console.error(err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // --- Hook para cargar pedidos ---
  useEffect(() => {
    const fetchOrders = async () => {
      setOrdersLoading(true);
      setOrdersError(null);
      try {
        const response = await fetch(`/api/orders?status=${orderStatusFilter}`);
        if (!response.ok) {
          throw new Error('Error al obtener los pedidos');
        }
        const data = await response.json();
        setOrders(data);
      } catch (err: any) {
        setOrdersError(err.message);
        console.error(err);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [orderStatusFilter]);


  // Usar estadísticas reales o valores por defecto
  const stats = dashboardStats || {
    totalSales: { net: 0, count: 0 },
    monthlySales: { net: 0, count: 0 },
    dailySales: { net: 0, count: 0 },
    failedPayments: 0,
    totalIVA: 0,
    totalIRPF: 0,
    products: { total: 0, dailySales: 0, totalSales: 0 },
    orders: { daily: 0, total: 0 }
  }

  const getCurrentValue = () => {
    switch (activeView) {
      case 'dashboard':
        return {
          title: 'Ventas Totales',
          amount: stats?.totalSales.net || 0,
          count: stats?.totalSales.count || 0
        }
      case 'products':
        return {
          title: `${stats?.products?.total || 0} productos`,
          amount: stats?.products?.total || 0,
          count: stats?.products?.totalSales || 0
        }
      case 'orders':
        return {
          title: `${stats?.orders?.daily || 0} pedidos hoy`,
          amount: stats?.orders?.total || 0,
          count: 0
        }
      default:
        return { title: 'Ventas Totales', amount: 0, count: 0 }
    }
  }

  const currentData = getCurrentValue()

  const TransactionsList = ({ filter }: { filter: string }) => {
    // Formatear fecha y hora
    const formatDateTime = (dateString: string) => {
      const date = new Date(dateString)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      
      const isToday = date.toDateString() === today.toDateString()
      const isYesterday = date.toDateString() === yesterday.toDateString()
      
      const time = date.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
      
      if (isToday) return `Hoy, ${time}`
      if (isYesterday) return `Ayer, ${time}`
      return date.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    // Mapear método de pago a emoji/texto
    const getPaymentMethodDisplay = (method: string) => {
      const methods: { [key: string]: string } = {
        'card': '💳 Tarjeta',
        'paypal': '🅿️ PayPal',
        'bancontact': '🏦 Bancontact',
        'ideal': '🇳🇱 iDEAL',
        'sepa_debit': '🏦 SEPA',
        'klarna': '🛍️ Klarna'
      }
      return methods[method] || '💳 Tarjeta'
    }

    if (salesLoading) {
      return (
        <div className="text-center text-slate-400 py-8">
          <p>Cargando ventas...</p>
        </div>
      )
    }

    if (salesError) {
      return (
        <div className="text-center text-red-400 py-8">
          <p>{salesError}</p>
        </div>
      )
    }

    if (successfulSales.length === 0) {
      return (
        <div className="text-center text-slate-400 py-8">
          <DollarSign size={48} className="mx-auto mb-4 opacity-50" />
          <p>No hay ventas exitosas aún</p>
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {successfulSales.map((sale) => (
          <div key={sale._id} className="flex items-center justify-between rounded-2xl bg-slate-800/80 backdrop-blur-sm p-4 border border-slate-700/50 hover:bg-slate-800 transition-all">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-green-500 shadow-lg">
                <DollarSign size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-white">
                  Venta - {sale.productId?.title || 'Producto'}
                </div>
                <div className="text-sm text-slate-400">
                  {formatDateTime(sale.createdAt)}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {sale.city && `📍 ${sale.city}`} • {getPaymentMethodDisplay(sale.paymentMethod)}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-white">+€{sale.netAmount?.toFixed(2) || sale.amount?.toFixed(2)}</div>
              <div className="text-sm text-green-400">Completado</div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const OrdersList = () => {
    // Formatear fecha y hora
    const formatDateTime = (dateString: string) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    // Mapear método de pago a emoji/texto
    const getPaymentMethodDisplay = (method: string) => {
      const methods: { [key: string]: string } = {
        'card': '💳 Tarjeta',
        'paypal': '🅿️ PayPal',
        'bancontact': '🏦 Bancontact',
        'ideal': '🇳🇱 iDEAL',
        'sepa_debit': '🏦 SEPA',
        'klarna': '🛍️ Klarna'
      }
      return methods[method] || '💳 Tarjeta'
    }

    // Obtener color del estado
    const getStatusColor = (status: string) => {
      const colors: { [key: string]: string } = {
        'success': 'text-green-400',
        'pending': 'text-yellow-400',
        'failed': 'text-red-400',
        'refunded': 'text-orange-400'
      }
      return colors[status] || 'text-slate-400'
    }

    // Obtener texto del estado
    const getStatusText = (status: string) => {
      const texts: { [key: string]: string } = {
        'success': 'Exitoso',
        'pending': 'Pendiente',
        'failed': 'Fallido',
        'refunded': 'Devuelto'
      }
      return texts[status] || status
    }

    if (ordersLoading) {
      return (
        <div className="text-center text-slate-400 py-8">
          <p>Cargando pedidos...</p>
        </div>
      )
    }

    if (ordersError) {
      return (
        <div className="text-center text-red-400 py-8">
          <p>{ordersError}</p>
        </div>
      )
    }

    if (orders.length === 0) {
      return (
        <div className="text-center text-slate-400 py-8">
          <ShoppingBag size={48} className="mx-auto mb-4 opacity-50" />
          <p>No hay pedidos{orderStatusFilter !== 'all' ? ` ${getStatusText(orderStatusFilter).toLowerCase()}s` : ''}</p>
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order._id} className="flex items-center justify-between rounded-2xl bg-slate-800/80 backdrop-blur-sm p-4 border border-slate-700/50 hover:bg-slate-800 transition-all">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg">
                <ShoppingBag size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-white">
                  {order.productId?.title || 'Producto'}
                </div>
                <div className="text-sm text-slate-400">
                  {formatDateTime(order.createdAt)} • {order.customerName || order.customerEmail}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {order.city && order.city !== 'N/A' && `📍 ${order.city} • `}{getPaymentMethodDisplay(order.paymentMethod)} • {order.ketoCode}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-white">€{order.amount?.toFixed(2) || '0.00'}</div>
              <div className={`text-sm ${getStatusColor(order.status)}`}>{getStatusText(order.status)}</div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const adminContent = (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white font-['Inter']">{/* Header eliminado */}

      {/* Header con logout */}
      <div className="flex justify-end p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all text-white text-sm"
        >
          <LogOut size={16} />
          Cerrar Sesión
        </button>
      </div>

      {/* Valor principal */}
      <div className="mb-8 px-6 text-center">
        <p className="mb-3 text-sm text-white/80 font-medium">Personal • Todas las cuentas</p>
        <h1 className="mb-3 text-7xl font-extralight tracking-tight">
          {activeView === 'dashboard' ? `€${currentData.amount.toFixed(2)}` : currentData.amount}
        </h1>
        <p className="text-sm text-white/80">{currentData.count} ventas</p>
      </div>

      {/* Botones de acción principales */}
      <div className="mb-8 px-6">
        <div className="flex justify-center gap-12">
          <button
            onClick={() => setShowProductModal(true)}
            className="group flex flex-col items-center gap-3"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-lg hover:bg-white/30 transition-all group-hover:scale-105">
              <Plus size={26} />
            </div>
            <span className="text-sm font-medium">Nuevo Producto</span>
          </button>

          <button
            onClick={() => setShowListModal(true)}
            className="group flex flex-col items-center gap-3"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-lg hover:bg-white/30 transition-all group-hover:scale-105">
              <Plus size={26} />
            </div>
            <span className="text-sm font-medium">Nueva Lista</span>
          </button>
        </div>
      </div>

      {/* Indicadores de página */}
      <div className="mb-8 flex justify-center gap-2">
        <div className="h-2 w-2 rounded-full bg-white/40"></div>
        <div className="h-2 w-2 rounded-full bg-white/80"></div>
        <div className="h-2 w-2 rounded-full bg-white/40"></div>
      </div>

      {/* Área de contenido principal */}
      <div className="flex-1 rounded-t-3xl bg-slate-900 shadow-2xl">
        <div className="p-6 pb-24">
          
          {/* Contenido según vista activa */}
          {activeView === 'dashboard' && (
            <div>
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-700/50 bg-slate-800/80 backdrop-blur-sm p-5 text-center hover:bg-slate-800 transition-all group">
                  <DollarSign className="mx-auto mb-3 text-blue-400 group-hover:scale-110 transition-transform" size={24} />
                  <div className="font-bold text-white text-lg">€{stats?.totalSales.net?.toFixed(2) || '0.00'}</div>
                  <div className="text-xs text-slate-400 font-medium">Ventas Totales</div>
                </div>
                <div className="rounded-2xl border border-slate-700/50 bg-slate-800/80 backdrop-blur-sm p-5 text-center hover:bg-slate-800 transition-all group">
                  <TrendingUp className="mx-auto mb-3 text-green-400 group-hover:scale-110 transition-transform" size={24} />
                  <div className="font-bold text-white text-lg">€{stats?.monthlySales.net?.toFixed(2) || '0.00'}</div>
                  <div className="text-xs text-slate-400 font-medium">Este Mes</div>
                </div>
                <div className="rounded-2xl border border-slate-700/50 bg-slate-800/80 backdrop-blur-sm p-5 text-center hover:bg-slate-800 transition-all group">
                  <Calendar className="mx-auto mb-3 text-yellow-400 group-hover:scale-110 transition-transform" size={24} />
                  <div className="font-bold text-white text-lg">€{stats?.dailySales.net?.toFixed(2) || '0.00'}</div>
                  <div className="text-xs text-slate-400 font-medium">Hoy</div>
                </div>
                <div className="rounded-2xl border border-slate-700/50 bg-slate-800/80 backdrop-blur-sm p-5 text-center hover:bg-slate-800 transition-all group">
                  <div className="mx-auto mb-3 text-xl text-red-400 group-hover:scale-110 transition-transform">⚠️</div>
                  <div className="font-bold text-white text-lg">{stats?.failedPayments || 0}</div>
                  <div className="text-xs text-slate-400 font-medium">Fallidos</div>
                </div>
              </div>
            </div>
          )}

          {/* --- BLOQUE DE LISTAS DE AMAZON --- */}
          {activeView === 'lists' && (
            <div>
              <h3 className="mb-6 font-semibold text-white text-lg">Listas de Amazon</h3>
              {listsLoading ? (
                <p className="text-center text-slate-400">Cargando listas...</p>
              ) : listsError ? (
                <p className="text-center text-red-400">{listsError}</p>
              ) : amazonLists.length > 0 ? (
                <div className="space-y-4">
                  {amazonLists.map((list) => (
                    <div 
                      key={list._id} 
                      className="flex rounded-2xl bg-slate-800/80 border border-slate-700/50 hover:bg-slate-800 transition-all overflow-hidden h-16"
                    >
                      {/* 30% para imagen */}
                      <div className="w-3/12 p-1">
                        {list.image ? (
                          <img 
                            src={list.image} 
                            alt={list.title}
                            className="w-full h-full object-cover rounded-xl"
                            style={{ padding: '3%' }}
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-700 rounded-xl flex items-center justify-center" style={{ margin: '3%', width: '94%', height: '94%' }}>
                            <List size={16} className="text-slate-500" />
                          </div>
                        )}
                      </div>
                      {/* 70% para título */}
                      <div className="w-9/12 p-3 flex items-center">
                        <p className="font-medium text-white text-sm truncate">{list.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400">
                  <List size={56} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No hay listas</p>
                  <p className="text-sm text-slate-500 mt-2">Crea tu primera lista usando el botón de arriba</p>
                </div>
              )}
            </div>
          )}

          {/* --- BLOQUE DE PRODUCTOS MODIFICADO --- */}
          {activeView === 'products' && (
            <div>
              <h3 className="mb-6 font-semibold text-white text-lg">Productos</h3>
              {isLoading ? (
                <p className="text-center text-slate-400">Cargando productos...</p>
              ) : error ? (
                <p className="text-center text-red-400">{error}</p>
              ) : products.length > 0 ? (
                <div className="space-y-4">
                  {products.map((product) => (
                    <div 
                      key={product._id} 
                      className="rounded-2xl bg-slate-800/80 border border-slate-700/50 hover:bg-slate-800 transition-all overflow-hidden p-3"
                    >
                      <div className="flex flex-col h-full">
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.title}
                            className="w-full h-32 object-cover rounded-xl mb-3"
                          />
                        ) : (
                          <div className="w-full h-32 bg-slate-700 rounded-xl flex items-center justify-center mb-3">
                            <Package size={24} className="text-slate-500" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-white text-sm truncate mb-1">{product.title}</p>
                          <div className="text-xs text-slate-400 mb-2 max-h-16 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
                            <p className="whitespace-pre-wrap">
                              {product.description}
                            </p>
                          </div>
                          <p className="font-semibold text-sm text-white">€{product.price?.toFixed(2) || '0.00'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400">
                  <Package size={56} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No hay productos</p>
                  <p className="text-sm text-slate-500 mt-2">Crea tu primer producto usando el botón de arriba</p>
                </div>
              )}
            </div>
          )}

          {activeView === 'orders' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-white text-lg">Pedidos</h3>
                <select 
                  value={orderStatusFilter} 
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="rounded-xl bg-slate-800 border border-slate-600 text-white text-sm px-3 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="all">Todos</option>
                  <option value="success">Exitosos</option>
                  <option value="pending">Pendientes</option>
                  <option value="failed">Fallidos</option>
                  <option value="refunded">Devueltos</option>
                </select>
              </div>
              <OrdersList />
            </div>
          )}

          {/* Sección Ver todo - Solo para dashboard y products */}
          {activeView !== 'orders' && (
            <>
              <div 
                className="mt-8 cursor-pointer text-center"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <div className="flex items-center justify-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                  <span className="text-sm font-medium">Ver todo</span>
                  {isExpanded ? 
                    <ChevronUp size={16} className="transition-transform" /> : 
                    <ChevronDown size={16} className="transition-transform" />
                  }
                </div>
              </div>

              {isExpanded && (
                <div className="mt-6 max-h-64 overflow-y-auto border-t border-slate-700/50 pt-6 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-slate-800">
                  {activeView === 'dashboard' ? (
                    <div>
                      <h4 className="mb-4 text-sm font-medium text-slate-300">Información Fiscal</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/80 backdrop-blur-sm p-4 text-center hover:bg-slate-800 transition-all group">
                          <div className="mx-auto mb-2 text-xl text-orange-400 group-hover:scale-110 transition-transform">🧾</div>
                          <div className="font-bold text-white text-lg">€{stats?.totalIVA?.toFixed(2) || '0.00'}</div>
                          <div className="text-xs text-slate-400 font-medium">IVA Total</div>
                        </div>
                        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/80 backdrop-blur-sm p-4 text-center hover:bg-slate-800 transition-all group">
                          <div className="mx-auto mb-2 text-xl text-purple-400 group-hover:scale-110 transition-transform">📊</div>
                          <div className="font-bold text-white text-lg">€{stats?.totalIRPF?.toFixed(2) || '0.00'}</div>
                          <div className="text-xs text-slate-400 font-medium">IRPF Total</div>
                        </div>
                      </div>
                    </div>
                  ) : activeView === 'products' ? (
                    <div>
                      <h4 className="mb-4 text-sm font-medium text-slate-300">Ventas Exitosas</h4>
                      <TransactionsList filter="recent" />
                    </div>
                  ) : (
                    <div className="text-center text-slate-400 py-4">
                      <p className="text-sm">No hay más información para mostrar</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Navegación inferior */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-slate-700/50 bg-slate-900/95 backdrop-blur-md">
        <div className="flex items-center justify-around px-4 py-4">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeView === 'dashboard' 
                ? 'text-white scale-105' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <BarChart3 size={20} />
            <span className="text-xs font-medium">Dashboard</span>
          </button>
          <button
            onClick={() => setActiveView('products')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeView === 'products' 
                ? 'text-white scale-105' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Package size={20} />
            <span className="text-xs font-medium">Productos</span>
          </button>
          <button
            onClick={() => setActiveView('lists')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeView === 'lists' 
                ? 'text-white scale-105' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <List size={20} />
            <span className="text-xs font-medium">Listas</span>
          </button>
          <button
            onClick={() => setActiveView('orders')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeView === 'orders' 
                ? 'text-white scale-105' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <ShoppingBag size={20} />
            <span className="text-xs font-medium">Pedidos</span>
          </button>
        </div>
      </div>

      {/* Modales */}
      {showProductModal && (
        <CreateProductModal 
          productForm={productForm}
          setProductForm={setProductForm}
          onClose={() => {
            setShowProductModal(false)
            setProductForm({
              title: '',
              description: '',
              price: '',
              originalPrice: '',
              stripePriceId: '',
              category: 'Asesoria',
              image: null,
              file: null
            })
          }} 
        />
      )}

      {showListModal && (
        <CreateListModal 
          listForm={listForm}
          setListForm={setListForm}
          onClose={() => {
            setShowListModal(false)
            setListForm({
              title: '',
              category: 'cooking',
              url: '',
              image: null
            })
          }} 
        />
      )}
    </div>
  )

  // Si no está autenticado, mostrar el login
  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />
  }

  // Si está autenticado, mostrar el admin
  return adminContent
}