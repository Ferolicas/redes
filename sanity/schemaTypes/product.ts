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
      name: 'type',
      title: 'Tipo de Producto',
      type: 'string',
      options: {
        list: [
          { title: 'Digital', value: 'digital' },
          { title: 'Servicio', value: 'service' },
          { title: 'Físico', value: 'physical' },
        ],
      },
      initialValue: 'digital',
    }),
    defineField({
      name: 'fileUrl',
      title: 'URL del archivo (para productos digitales)',
      type: 'string',
      hidden: ({ document }) => document?.type !== 'digital',
    }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'string',
      options: {
        list: [
          { title: 'Recetas Keto', value: 'recipes' },
          { title: 'Planes de Alimentación', value: 'meal-plans' },
          { title: 'Guías Nutricionales', value: 'nutrition-guides' },
          { title: 'Suplementos', value: 'supplements' },
          { title: 'Asesoría', value: 'consulting' },
        ],
      },
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
      type: 'type',
    },
    prepare(selection) {
      const { title, media, price, type } = selection
      return {
        title,
        subtitle: `€${price} - ${type}`,
        media,
      }
    },
  },
})