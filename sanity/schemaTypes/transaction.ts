import { defineType, defineField } from 'sanity'

export const transaction = defineType({
  name: 'transaction',
  title: 'Transacción',
  type: 'document',
  fields: [
    defineField({
      name: 'ketoCode',
      title: 'Código Keto',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Código único para la descarga del producto',
    }),
    defineField({
      name: 'stripeSessionId',
      title: 'Stripe Session ID',
      type: 'string',
      description: 'ID de la sesión de Stripe',
    }),
    defineField({
      name: 'stripePaymentIntentId',
      title: 'Stripe Payment Intent ID',
      type: 'string',
      description: 'ID del payment intent de Stripe',
    }),
    defineField({
      name: 'amount',
      title: 'Monto Total (€)',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'stripeCommission',
      title: 'Comisión Stripe (€)',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'iva',
      title: 'IVA (€)',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'irpf',
      title: 'IRPF (€)',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'netAmount',
      title: 'Monto Neto (€)',
      type: 'number',
      validation: (Rule) => Rule.min(0),
      description: 'Monto después de comisiones e impuestos',
    }),
    defineField({
      name: 'customerEmail',
      title: 'Email del Cliente',
      type: 'string',
    }),
    defineField({
      name: 'customerName',
      title: 'Nombre del Cliente',
      type: 'string',
    }),
    defineField({
      name: 'customerPhone',
      title: 'Teléfono del Cliente',
      type: 'string',
    }),
    defineField({
      name: 'productId',
      title: 'Producto',
      type: 'reference',
      to: [{ type: 'product' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'paymentMethod',
      title: 'Método de Pago',
      type: 'string',
      options: {
        list: [
          { title: 'Tarjeta de Crédito', value: 'card' },
          { title: 'Bizum', value: 'bizum' },
          { title: 'PayPal', value: 'paypal' },
          { title: 'Transferencia', value: 'transfer' },
          { title: 'Otro', value: 'other' },
        ],
      },
    }),
    defineField({
      name: 'country',
      title: 'País',
      type: 'string',
    }),
    defineField({
      name: 'city',
      title: 'Ciudad',
      type: 'string',
    }),
    defineField({
      name: 'status',
      title: 'Estado',
      type: 'string',
      options: {
        list: [
          { title: '✅ Exitoso', value: 'success' },
          { title: '⏳ Pendiente', value: 'pending' },
          { title: '❌ Fallido', value: 'failed' },
          { title: '🔄 Devuelto', value: 'refunded' },
          { title: '⚠️ Cancelado', value: 'canceled' },
        ],
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'downloadCount',
      title: 'Número de Descargas',
      type: 'number',
      initialValue: 0,
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'maxDownloads',
      title: 'Máximo de Descargas Permitidas',
      type: 'number',
      initialValue: 2,
      validation: (Rule) => Rule.min(1).max(10),
    }),
    defineField({
      name: 'lastDownloadAt',
      title: 'Última Descarga',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'notes',
      title: 'Notas Internas',
      type: 'text',
      rows: 3,
      description: 'Notas para uso interno',
    }),
    defineField({
      name: 'createdAt',
      title: 'Fecha de Transacción',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Última Actualización',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      customerEmail: 'customerEmail',
      customerName: 'customerName',
      amount: 'amount',
      status: 'status',
      ketoCode: 'ketoCode',
      createdAt: 'createdAt',
      product: 'productId.title',
    },
    prepare(selection: any) {
      const { customerEmail, customerName, amount, status, ketoCode, createdAt, product } = selection
      const date = createdAt ? new Date(createdAt).toLocaleDateString() : ''
      const statusEmoji: Record<string, string> = {
        success: '✅',
        pending: '⏳',
        failed: '❌',
        refunded: '🔄',
        canceled: '⚠️',
      }
      const emoji = statusEmoji[status as string] || '❓'
      
      return {
        title: `${customerName || customerEmail} - €${amount}`,
        subtitle: `${emoji} ${product} - ${ketoCode} - ${date}`,
      }
    },
  },
  orderings: [
    {
      title: 'Más recientes',
      name: 'createdDesc',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
    {
      title: 'Más antiguos',
      name: 'createdAsc',
      by: [{ field: 'createdAt', direction: 'asc' }],
    },
    {
      title: 'Monto mayor',
      name: 'amountDesc',
      by: [{ field: 'amount', direction: 'desc' }],
    },
    {
      title: 'Por estado',
      name: 'status',
      by: [
        { field: 'status', direction: 'asc' },
        { field: 'createdAt', direction: 'desc' },
      ],
    },
  ],
})