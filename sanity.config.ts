import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemaTypes'

interface SanityDocument {
  _type: string
  slug?: {
    current?: string
  }
}

export default defineConfig({
  name: 'default',
  title: 'Store Planeta Keto',

  projectId: 'qbxfey9f',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Contenido')
          .items([
            S.listItem()
              .title('Elementos Web')
              .icon(() => '🎨')
              .child(S.documentTypeList('webElements').title('Elementos Web')),
            S.divider(),
            S.listItem()
              .title('Productos')
              .icon(() => '🛍️')
              .child(S.documentTypeList('product').title('Productos')),
            S.listItem()
              .title('Listas Amazon')
              .icon(() => '📦')
              .child(S.documentTypeList('amazonList').title('Listas Amazon')),
            S.divider(),
            S.listItem()
              .title('Transacciones')
              .icon(() => '💰')
              .child(
                S.documentTypeList('transaction')
                  .title('Transacciones')
                  .filter('_type == "transaction"')
                  .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
              ),
            S.listItem()
              .title('Transacciones Exitosas')
              .icon(() => '✅')
              .child(
                S.documentTypeList('transaction')
                  .title('Transacciones Exitosas')
                  .filter('_type == "transaction" && status == "success"')
                  .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
              ),
            S.listItem()
              .title('Transacciones Pendientes')
              .icon(() => '⏳')
              .child(
                S.documentTypeList('transaction')
                  .title('Transacciones Pendientes')
                  .filter('_type == "transaction" && status == "pending"')
                  .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
              ),
            S.listItem()
              .title('Transacciones Fallidas')
              .icon(() => '❌')
              .child(
                S.documentTypeList('transaction')
                  .title('Transacciones Fallidas')
                  .filter('_type == "transaction" && status == "failed"')
                  .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
              ),
          ])
    }),
    visionTool()
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    productionUrl: async (prev, { document }) => {
      const doc = document as SanityDocument
      if (doc._type === 'product' && doc.slug?.current) {
        return `http://localhost:3000/product/${doc.slug.current}`
      }
      return prev
    },
  },
})