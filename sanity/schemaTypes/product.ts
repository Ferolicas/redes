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
      title: 'Precio (€)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
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
    }),
    defineField({
      name: 'gallery',
      title: 'Galería de Imágenes',
      type: 'array',
      of: [
        {
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
        },
      ],
    }),
    defineField({
      name: 'includes',
      title: 'Qué incluye',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Lista de elementos que incluye el producto',
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
      name: 'featured',
      title: 'Producto Destacado',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'active',
      title: 'Activo',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Orden de visualización',
      type: 'number',
      initialValue: 0,
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
      category: 'category',
    },
    prepare(selection) {
      const { title, media, price, category } = selection
      return {
        title,
        subtitle: `€${price} - ${category}`,
        media,
      }
    },
  },
})