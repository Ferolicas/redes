import { defineType, defineField } from 'sanity'

export const webElements = defineType({
  name: 'webElements',
  title: 'Elementos de la Web',
  type: 'document',
  fields: [
    defineField({
      name: 'logo',
      title: 'Logo',
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
      name: 'title',
      title: 'Título',
      type: 'string',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtítulo',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'colors',
      title: 'Colores',
      type: 'object',
      fields: [
        {
          name: 'primary',
          title: 'Color Primario',
          type: 'string',
        },
        {
          name: 'secondary',
          title: 'Color Secundario',
          type: 'string',
        },
        {
          name: 'accent',
          title: 'Color de Acento',
          type: 'string',
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      media: 'logo',
    },
    prepare(selection) {
      const { title, subtitle, media } = selection
      return {
        title,
        subtitle,
        media,
      }
    },
  },
})