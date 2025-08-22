export interface Product {
  _id: string
  title: string
  description: string
  price: number
  originalPrice?: number
  stripePriceId: string
  image: any
  includes: string[]
  category: string
  type: 'digital' | 'service'
  fileUrl?: string
  createdAt: string
}

export interface AmazonList {
  _id: string
  title: string
  url: string
  image: any
  category: string
  clickCount: number
  order: number
  createdAt: string
}

export interface Transaction {
  _id: string
  ketoCode: string
  stripeSessionId: string
  amount: number
  stripeCommission: number
  iva: number
  irpf: number
  netAmount: number
  customerEmail: string
  customerName: string
  productId: Product
  paymentMethod: string
  city: string
  status: 'success' | 'pending' | 'failed' | 'refunded'
  downloadCount: number
  maxDownloads: number
  createdAt: string
}

export interface DashboardStats {
  dailySales: {
    count: number
    amount: number
    net: number
  }
  monthlySales: {
    count: number
    amount: number
    net: number
  }
  totalSales: {
    count: number
    amount: number
    net: number
  }
  monthlyIVA: number
  monthlyIRPF: number
  totalIVA: number
  totalIRPF: number
  failedPayments: number
  pendingPayments: number
  refunds: number
}