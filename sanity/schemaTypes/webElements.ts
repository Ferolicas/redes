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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtítulo',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
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
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'secondary',
          title: 'Color Secundario',
          type: 'string',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'accent',
          title: 'Color de Acento',
          type: 'string',
          validation: (Rule: any) => Rule.required(),
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