import { GET } from '../route'
import { NextRequest } from 'next/server'
import { mockComprobantes } from '@/app/(portal)/comprobantes-recibidos/data/mock-comprobantes'

describe('GET /api/comprobantes/[id]', () => {
  it('should return a comprobante when valid ID is provided', async () => {
    const request = new NextRequest('http://localhost:3000/api/comprobantes/1')
    const params = Promise.resolve({ id: '1' })

    const response = await GET(request, { params })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.id).toBe('1')
    expect(data.numeroDocumento).toBe('F003-00000386')
  })

  it('should return 404 when comprobante is not found', async () => {
    const request = new NextRequest('http://localhost:3000/api/comprobantes/999')
    const params = Promise.resolve({ id: '999' })

    const response = await GET(request, { params })
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('Comprobante no encontrado')
  })

  it('should return all expected fields for a comprobante', async () => {
    const request = new NextRequest('http://localhost:3000/api/comprobantes/1')
    const params = Promise.resolve({ id: '1' })

    const response = await GET(request, { params })
    const data = await response.json()

    expect(data).toHaveProperty('id')
    expect(data).toHaveProperty('tipoDoc')
    expect(data).toHaveProperty('estado')
    expect(data).toHaveProperty('numeroDocumento')
    expect(data).toHaveProperty('razonSocial')
    expect(data).toHaveProperty('rfc')
    expect(data).toHaveProperty('valorTotal')
  })

  it('should include detail fields when available', async () => {
    const request = new NextRequest('http://localhost:3000/api/comprobantes/1')
    const params = Promise.resolve({ id: '1' })

    const response = await GET(request, { params })
    const data = await response.json()

    expect(data).toHaveProperty('versiones')
    expect(data).toHaveProperty('documentos')
    expect(data).toHaveProperty('historial')
    expect(Array.isArray(data.versiones)).toBe(true)
    expect(Array.isArray(data.documentos)).toBe(true)
    expect(Array.isArray(data.historial)).toBe(true)
  })
})
