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

export const createStripeCoupon = async (code: string, percentOff: number = 20) => {
  try {
    const coupon = await stripe.coupons.create({
      id: code,
      percent_off: percentOff,
      duration: 'once',
      max_redemptions: 1,
      currency: 'eur'
    })
    return coupon
  } catch (error) {
    console.error('Error creating Stripe coupon:', error)
    throw error
  }
}

export const validateCoupon = async (code: string) => {
  try {
    const coupon = await stripe.coupons.retrieve(code)
    return coupon
  } catch (error) {
    console.error('Error validating coupon:', error)
    return null
  }
}