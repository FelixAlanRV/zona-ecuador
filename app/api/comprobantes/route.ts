import { NextResponse } from 'next/server'
import { mockComprobantes } from '@/app/(portal)/emision/data/mock-comprobantes'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tipoDoc = searchParams.get('tipoDoc')?.split(',')
    const estado = searchParams.get('estado')?.split(',')
    const estadoComercial = searchParams.get('estado_comercial')?.split(',')
    const razonSocial = searchParams.get('razonSocial')
    const rfc = searchParams.get('rfc')
    const search = searchParams.get('search')

    // Simular delay de red (preparación para API externa)
    await new Promise(resolve => setTimeout(resolve, 100))

    let filteredComprobantes = [...mockComprobantes]

    if (tipoDoc && tipoDoc.length > 0) {
      filteredComprobantes = filteredComprobantes.filter(c => tipoDoc.includes(c.tipoDoc))
    }

    if (estado && estado.length > 0) {
      filteredComprobantes = filteredComprobantes.filter(c => estado.includes(c.estado))
    }

    if (estadoComercial && estadoComercial.length > 0) {
      filteredComprobantes = filteredComprobantes.filter(c => {
        const value = c.estado_comercial === true ? 'true' : c.estado_comercial === false ? 'false' : 'null'
        return estadoComercial.includes(value)
      })
    }

    // Global search by RFC, razonSocial, or numeroDocumento
    const searchTerm = search || rfc || razonSocial
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filteredComprobantes = filteredComprobantes.filter(c => 
        c.razonSocial.toLowerCase().includes(searchLower) || 
        c.rfc.toLowerCase().includes(searchLower) ||
        c.serie.toLowerCase().includes(searchLower) ||
        c.serie.toLowerCase().includes(searchLower)
      )
    }

    return NextResponse.json(filteredComprobantes)
  } catch (error) {
    console.error('Error fetching comprobantes:', error)
    return NextResponse.json(
      { error: 'Error al obtener los comprobantes' },
      { status: 500 }
    )
  }
}
