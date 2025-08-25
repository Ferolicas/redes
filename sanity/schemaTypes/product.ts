import { defineType, defineField } from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Producto',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'price',
      title: 'Precio a Cobrar (€)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'originalPrice',
      title: 'Precio Original (€)',
      type: 'number',
      validation: (Rule) => Rule.min(0),
      description: 'Precio original antes del descuento (opcional)',
    }),
    defineField({
      name: 'stripePriceId',
      title: 'Stripe Price ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Imagen Principal',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Texto alternativo',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'string',
      options: {
        list: [
          { title: 'Asesoría', value: 'Asesoria' },
          { title: 'Libro', value: 'Libro' },
          { title: 'Servicios', value: 'Servicios' },
        ],
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'Asesoria',
    }),
    defineField({
      name: 'pdfFile',
      title: 'Archivo PDF (para libros)',
      type: 'file',
      options: {
        accept: '.pdf'
      },
      hidden: ({ document }) => document?.category !== 'Libro',
    }),
    defineField({
      name: 'calendlyUrl',
      title: 'URL de Calendly (para asesorías)',
      type: 'url',
      hidden: ({ document }) => document?.category !== 'Asesoria',
      description: 'URL específica de Calendly para este tipo de asesoría',
    }),
    defineField({
      name: 'featured',
      title: 'Fijar',
      type: 'boolean',
      initialValue: false,
      description: 'Mostrar este producto como destacado',
    }),
    defineField({
      name: 'clickCount',
      title: 'Número de clicks',
      type: 'number',
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: 'createdAt',
      title: 'Fecha de Creación',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      price: 'price',
      originalPrice: 'originalPrice',
      category: 'category',
      featured: 'featured',
      clickCount: 'clickCount',
    },
    prepare(selection) {
      const { title, media, price, originalPrice, category, featured, clickCount } = selection
      const priceText = originalPrice && originalPrice > price 
        ? `€${price} (antes €${originalPrice})` 
        : `€${price}`
      return {
        title: `${featured ? '📌 ' : ''}${title}`,
        subtitle: `${priceText} - ${category} • ${clickCount || 0} clicks`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Más nuevos primero',
      name: 'createdDesc',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'createdAt', direction: 'desc' }
      ],
    },
    {
      title: 'Más antiguos primero',
      name: 'createdAsc',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'createdAt', direction: 'asc' }
      ],
    },
    {
      title: 'Precio menor a mayor',
      name: 'priceAsc',
      by: [{ field: 'price', direction: 'asc' }],
    },
    {
      title: 'Precio mayor a menor',
      name: 'priceDesc',
      by: [{ field: 'price', direction: 'desc' }],
    },
    {
      title: 'Más clicks',
      name: 'clicksDesc',
      by: [{ field: 'clickCount', direction: 'desc' }],
    },
  ],
})