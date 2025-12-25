import { NextRequest, NextResponse } from 'next/server'
import { mockComprobantes } from '@/app/(portal)/emision/data/mock-comprobantes'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Next.js 16: params is now a Promise and must be awaited
    const { id } = await params

    // Simular delay de red (preparación para API externa)
    await new Promise(resolve => setTimeout(resolve, 100))

    // Buscar comprobante por ID
    const comprobante = mockComprobantes.find(c => c.id === id)

    if (!comprobante) {
      return NextResponse.json(
        { error: 'Comprobante no encontrado' },
        { status: 404 }
      )
    }

    // TODO: Reemplazar con llamada a API externa
    // const response = await fetch(`${process.env.EXTERNAL_API_URL}/comprobantes/${id}`)
    // const data = await response.json()

    return NextResponse.json(comprobante)
  } catch (error) {
    console.error('Error fetching comprobante:', error)
    return NextResponse.json(
      { error: 'Error al obtener el comprobante' },
      { status: 500 }
    )
  }
}
