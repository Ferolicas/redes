import { NextResponse } from 'next/server'
import { sanityClient } from '../../../../../lib/sanity'

export async function GET(
  request: Request,
  { params }: { params: { ketoCode: string; transactionId: string } }
) {
  try {
    const { ketoCode, transactionId } = params

    // Verificar transacción
    const transaction = await sanityClient.fetch(`
      *[_type == "transaction" && _id == $transactionId && ketoCode == $ketoCode][0] {
        _id,
        status,
        downloadCount,
        maxDownloads,
        productId->{
          title,
          fileUrl,
          type
        }
      }
    `, { transactionId, ketoCode })

    if (!transaction) {
      return NextResponse.json({ error: 'Transacción no encontrada' }, { status: 404 })
    }

    if (transaction.status !== 'success') {
      return NextResponse.json({ error: 'Transacción no válida' }, { status: 400 })
    }

    if (transaction.downloadCount >= transaction.maxDownloads) {
      return NextResponse.json({ error: 'Máximo de descargas alcanzado' }, { status: 400 })
    }

    if (transaction.productId.type !== 'digital' || !transaction.productId.fileUrl) {
      return NextResponse.json({ error: 'Producto no disponible para descarga' }, { status: 400 })
    }

    // Incrementar contador de descargas
    await sanityClient.patch(transactionId).set({
      downloadCount: transaction.downloadCount + 1
    }).commit()

    // Redirigir al archivo
    return NextResponse.redirect(transaction.productId.fileUrl)
  } catch (error) {
    console.error('Error in download:', error)
    return NextResponse.json({ error: 'Error en la descarga' }, { status: 500 })
  }
}