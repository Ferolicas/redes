import { defineType, defineField } from 'sanity'

export const clientes = defineType({
  name: 'clientes',
  title: 'Clientes',
  type: 'document',
  icon: () => '👥',
  fields: [
    defineField({
      name: 'clienteId',
      title: 'ID de Cliente',
      type: 'string',
      readOnly: true,
      initialValue: () => `CL-${Date.now()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
    }),
    defineField({
      name: 'nombre',
      title: 'Nombre Completo',
      type: 'string',
      validation: Rule => Rule.required().min(2).max(100)
    }),
    defineField({
      name: 'email',
      title: 'Correo Electrónico',
      type: 'string',
      validation: Rule => Rule.required().email()
    }),
    defineField({
      name: 'telefono',
      title: 'Número de Teléfono',
      type: 'string',
      validation: Rule => Rule.required().min(8)
    }),
    defineField({
      name: 'pais',
      title: 'País',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'productoComprado',
      title: 'Producto Comprado',
      type: 'reference',
      to: [{ type: 'product' }],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'archivoProducto',
      title: 'Archivo del Producto',
      type: 'file',
      options: {
        accept: '.pdf,.doc,.docx,.epub'
      }
    }),
    defineField({
      name: 'fechaCompra',
      title: 'Fecha de Compra',
      type: 'datetime',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'precioCompra',
      title: 'Precio de Compra',
      type: 'number',
      validation: Rule => Rule.required().min(0)
    }),
    defineField({
      name: 'metodoPago',
      title: 'Método de Pago',
      type: 'string',
      options: {
        list: [
          { title: 'Tarjeta de Crédito/Débito', value: 'card' },
          { title: 'PayPal', value: 'paypal' },
          { title: 'Bancontact', value: 'bancontact' },
          { title: 'iDEAL', value: 'ideal' },
          { title: 'SEPA', value: 'sepa_debit' },
          { title: 'Klarna', value: 'klarna' }
        ]
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'estadoTransaccion',
      title: 'Estado de Transacción',
      type: 'string',
      options: {
        list: [
          { title: '✅ Exitoso', value: 'exitoso' },
          { title: '⏳ Pendiente', value: 'pendiente' }
        ]
      },
      validation: Rule => Rule.required(),
      initialValue: 'pendiente'
    }),
    defineField({
      name: 'estadoVenta',
      title: 'Estado de Venta',
      type: 'string',
      options: {
        list: [
          { title: '✅ Exitoso', value: 'exitoso' },
          { title: '⏳ Pendiente', value: 'pendiente' },
          { title: '↩️ Devolución', value: 'devolucion' }
        ]
      },
      validation: Rule => Rule.required(),
      initialValue: 'pendiente'
    }),
    defineField({
      name: 'codigoTransaccion',
      title: 'Código de Transacción',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'contrasenaAcceso',
      title: 'Contraseña de Acceso (Cifrada)',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'contadorDescargas',
      title: 'Contador de Descargas',
      type: 'number',
      initialValue: 0,
      validation: Rule => Rule.required().min(0).max(2)
    }),
    defineField({
      name: 'maxDescargas',
      title: 'Máximo de Descargas Permitidas',
      type: 'number',
      initialValue: 2,
      validation: Rule => Rule.required().min(1).max(5)
    }),
    defineField({
      name: 'suscritoNewsletter',
      title: 'Suscrito al Newsletter',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'fechaSuscripcionNewsletter',
      title: 'Fecha de Suscripción al Newsletter',
      type: 'datetime'
    }),
    defineField({
      name: 'codigosDescuentoUsados',
      title: 'Códigos de Descuento Usados',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'codigo', type: 'string', title: 'Código' },
            { name: 'fechaUso', type: 'datetime', title: 'Fecha de Uso' },
            { name: 'descuento', type: 'number', title: 'Porcentaje de Descuento' }
          ]
        }
      ]
    })
  ],
  preview: {
    select: {
      title: 'nombre',
      subtitle: 'email',
      media: 'productoComprado.image'
    },
    prepare(selection) {
      const { title, subtitle } = selection
      return {
        title: title || 'Cliente Sin Nombre',
        subtitle: subtitle || 'Sin email'
      }
    }
  },
  orderings: [
    {
      title: 'Fecha de Compra (Más Reciente)',
      name: 'fechaCompraDesc',
      by: [{ field: 'fechaCompra', direction: 'desc' }]
    },
    {
      title: 'Nombre A-Z',
      name: 'nombreAsc',
      by: [{ field: 'nombre', direction: 'asc' }]
    }
  ]
})