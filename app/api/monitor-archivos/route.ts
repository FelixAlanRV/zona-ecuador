import { NextResponse } from 'next/server'
import { mockMonitorArchivos } from '@/_mock/mock-monitor-archivos'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  
  const canalRecepcion = searchParams.get('canalRecepcion')
  const search = searchParams.get('search')?.toLowerCase()

  let filteredData = [...mockMonitorArchivos]

  if (canalRecepcion) {
    const statuses = canalRecepcion.split(',')
    filteredData = filteredData.filter(item => statuses.includes(item.canalRecepcion))
  }

  if (search) {
    filteredData = filteredData.filter(item => 
      item.identificadorCanal.toLowerCase().includes(search) ||
      item.trackId.toLowerCase().includes(search) ||
      (item.razonSocial && item.razonSocial.toLowerCase().includes(search))
    )
  }

  return NextResponse.json(filteredData)
}
