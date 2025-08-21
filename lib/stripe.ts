import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
})

export const calculateTaxes = (amount: number) => {
  const stripeCommission = amount * 0.014 + 0.25
  const grossAmount = amount - stripeCommission
  const iva = grossAmount * 0.21
  const irpf = grossAmount * 0.15
  const netAmount = grossAmount - iva - irpf

  return {
    stripeCommission: Number(stripeCommission.toFixed(2)),
    iva: Number(iva.toFixed(2)),
    irpf: Number(irpf.toFixed(2)),
    netAmount: Number(netAmount.toFixed(2)),
  }
}

export const generateKetoCode = (status: 'success' | 'pending' | 'failed', number: number): string => {
  const prefixes = {
    success: 'KETOPAGO',
    pending: 'KETOPEN',
    failed: 'KETODEN',
  }
  
  return `${prefixes[status]}-${number.toString().padStart(4, '0')}`
}