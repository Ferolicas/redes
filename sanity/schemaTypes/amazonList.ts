import { defineType, defineField } from 'sanity'

export const amazonList = defineType({
  name: 'amazonList',
  title: 'Lista Amazon',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título de la Lista',
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
      name: 'category',
      title: 'Categoría',
      type: 'string',
      options: {
        list: [
          { title: 'Cocina Keto', value: 'cooking' },
          { title: 'Suplementos', value: 'supplements' },
          { title: 'Utensilios', value: 'utensils' },
          { title: 'Ingredientes', value: 'ingredients' },
          { title: 'Libros', value: 'books' },
          { title: 'Deportes', value: 'sports' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Imagen de la Lista',
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
      name: 'url',
      title: 'URL de Amazon',
      type: 'url',
      validation: (Rule) => Rule.required().uri({
        scheme: ['http', 'https'],
      }),
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
      category: 'category',
      clickCount: 'clickCount',
    },
    prepare(selection) {
      const { title, media, category, clickCount } = selection
      return {
        title,
        subtitle: `${category || 'Sin categoría'} • ${clickCount} clicks`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Más antiguas primero',
      name: 'createdAsc',
      by: [{ field: 'createdAt', direction: 'asc' }],
    },
    {
      title: 'Más recientes primero',
      name: 'createdDesc',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
    {
      title: 'Más clicks',
      name: 'clicksDesc',
      by: [{ field: 'clickCount', direction: 'desc' }],
    },
  ],
})