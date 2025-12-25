import { NextResponse } from 'next/server'
import { mockMonitorArchivos } from '@/_mock/mock-monitor-archivos'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const record = mockMonitorArchivos.find((item) => item.id === id)

  if (!record) {
    return new NextResponse('Not Found', { status: 404 })
  }

  return NextResponse.json(record)
}
