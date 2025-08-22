import { defineType, defineField } from 'sanity'

export const discountCodes = defineType({
  name: 'discountCodes',
  title: 'Códigos de Descuento',
  type: 'document',
  icon: () => '🎁',
  fields: [
    defineField({
      name: 'codigo',
      title: 'Código',
      type: 'string',
      validation: Rule => Rule.required().min(5).max(20)
    }),
    defineField({
      name: 'descuento',
      title: 'Porcentaje de Descuento',
      type: 'number',
      validation: Rule => Rule.required().min(1).max(100)
    }),
    defineField({
      name: 'activo',
      title: 'Código Activo',
      type: 'boolean',
      initialValue: true
    }),
    defineField({
      name: 'usoUnico',
      title: 'Uso Único',
      type: 'boolean',
      initialValue: true
    }),
    defineField({
      name: 'usado',
      title: 'Ya Usado',
      type: 'boolean',
      initialValue: false,
      readOnly: true
    }),
    defineField({
      name: 'fechaCreacion',
      title: 'Fecha de Creación',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    }),
    defineField({
      name: 'fechaExpiracion',
      title: 'Fecha de Expiración',
      type: 'datetime'
    }),
    defineField({
      name: 'stripeCouponId',
      title: 'ID del Cupón en Stripe',
      type: 'string',
      description: 'ID del cupón correspondiente en Stripe',
      readOnly: true
    }),
    defineField({
      name: 'clienteAsignado',
      title: 'Cliente Asignado',
      type: 'reference',
      to: [{ type: 'clientes' }]
    }),
    defineField({
      name: 'productoEspecifico',
      title: 'Producto Específico (opcional)',
      type: 'reference',
      to: [{ type: 'product' }]
    })
  ],
  preview: {
    select: {
      title: 'codigo',
      subtitle: 'descuento',
      usado: 'usado',
      activo: 'activo'
    },
    prepare(selection) {
      const { title, subtitle, usado, activo } = selection
      const status = usado ? '✅ Usado' : activo ? '🟢 Activo' : '🔴 Inactivo'
      return {
        title: title || 'Sin código',
        subtitle: `${subtitle}% - ${status}`
      }
    }
  },
  orderings: [
    {
      title: 'Fecha de Creación (Más Reciente)',
      name: 'fechaCreacionDesc',
      by: [{ field: 'fechaCreacion', direction: 'desc' }]
    },
    {
      title: 'Código A-Z',
      name: 'codigoAsc',
      by: [{ field: 'codigo', direction: 'asc' }]
    }
  ]
})