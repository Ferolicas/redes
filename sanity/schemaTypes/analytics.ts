import { defineType, defineField } from 'sanity'

export const analytics = defineType({
  name: 'analytics',
  title: 'Analytics',
  type: 'document',
  fields: [
    defineField({
      name: 'date',
      title: 'Fecha',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'dailyVisits',
      title: 'Visitas del día',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'totalVisits',
      title: 'Visitas totales',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'productClicks',
      title: 'Clicks en productos',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'productId',
              title: 'Producto',
              type: 'reference',
              to: [{ type: 'product' }],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'clicks',
              title: 'Clicks',
              type: 'number',
              initialValue: 0,
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'listClicks',
      title: 'Clicks en listas',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'listId',
              title: 'Lista',
              type: 'reference',
              to: [{ type: 'amazonList' }],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'clicks',
              title: 'Clicks',
              type: 'number',
              initialValue: 0,
            }),
          ],
        },
      ],
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
      date: 'date',
      dailyVisits: 'dailyVisits',
      totalVisits: 'totalVisits',
    },
    prepare(selection) {
      const { date, dailyVisits, totalVisits } = selection
      return {
        title: `Analytics ${date}`,
        subtitle: `${dailyVisits} visitas diarias • ${totalVisits} totales`,
      }
    },
  },
  orderings: [
    {
      title: 'Fecha más reciente',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
    {
      title: 'Más visitas diarias',
      name: 'dailyVisitsDesc',
      by: [{ field: 'dailyVisits', direction: 'desc' }],
    },
  ],
})