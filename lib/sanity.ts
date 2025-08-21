import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: true,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
})

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// Schemas para Sanity Studio
export const productSchema = {
  name: 'product',
  title: 'Producto',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Descripción',
      type: 'text',
    },
    {
      name: 'price',
      title: 'Precio (€)',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(0),
    },
    {
      name: 'stripePriceId',
      title: 'Stripe Price ID',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Imagen',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'includes',
      title: 'Qué incluye',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'type',
      title: 'Tipo',
      type: 'string',
      options: {
        list: [
          { title: 'Digital', value: 'digital' },
          { title: 'Servicio', value: 'service' },
        ],
      },
    },
    {
      name: 'fileUrl',
      title: 'URL del archivo (para productos digitales)',
      type: 'string',
    },
    {
      name: 'createdAt',
      title: 'Creado',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    },
  ],
}

export const amazonListSchema = {
  name: 'amazonList',
  title: 'Lista Amazon',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'url',
      title: 'URL Amazon',
      type: 'url',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Imagen',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'order',
      title: 'Orden',
      type: 'number',
      initialValue: 0,
    },
    {
      name: 'createdAt',
      title: 'Creado',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    },
  ],
}

export const transactionSchema = {
  name: 'transaction',
  title: 'Transacción',
  type: 'document',
  fields: [
    {
      name: 'ketoCode',
      title: 'Código Keto',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'stripeSessionId',
      title: 'Stripe Session ID',
      type: 'string',
    },
    {
      name: 'amount',
      title: 'Monto (€)',
      type: 'number',
    },
    {
      name: 'stripeCommission',
      title: 'Comisión Stripe (€)',
      type: 'number',
    },
    {
      name: 'iva',
      title: 'IVA (€)',
      type: 'number',
    },
    {
      name: 'irpf',
      title: 'IRPF (€)',
      type: 'number',
    },
    {
      name: 'netAmount',
      title: 'Monto Neto (€)',
      type: 'number',
    },
    {
      name: 'customerEmail',
      title: 'Email Cliente',
      type: 'string',
    },
    {
      name: 'customerName',
      title: 'Nombre Cliente',
      type: 'string',
    },
    {
      name: 'productId',
      title: 'ID Producto',
      type: 'reference',
      to: [{ type: 'product' }],
    },
    {
      name: 'paymentMethod',
      title: 'Método de Pago',
      type: 'string',
    },
    {
      name: 'city',
      title: 'Ciudad',
      type: 'string',
    },
    {
      name: 'status',
      title: 'Estado',
      type: 'string',
      options: {
        list: [
          { title: 'Exitoso', value: 'success' },
          { title: 'Pendiente', value: 'pending' },
          { title: 'Fallido', value: 'failed' },
          { title: 'Devuelto', value: 'refunded' },
        ],
      },
    },
    {
      name: 'downloadCount',
      title: 'Descargas',
      type: 'number',
      initialValue: 0,
    },
    {
      name: 'maxDownloads',
      title: 'Máximo Descargas',
      type: 'number',
      initialValue: 2,
    },
    {
      name: 'createdAt',
      title: 'Fecha',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    },
  ],
}