"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, CheckCircle2, HardDriveDownload, HelpCircle, XCircle, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { MonitorArchivo } from '@/_mock/mock-monitor-archivos'
import { FileCard } from '@/app/(portal)/comprobantes-recibidos/[id]/components/file-card'
import { apiUrl } from '@/lib/api-client'

interface MonitorDetailProps {
  documentId: string
}

export function MonitorDetail({ documentId }: MonitorDetailProps) {
  const router = useRouter()
  const [document, setDocument] = useState<MonitorArchivo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDocument() {
      try {
        setLoading(true)
        const response = await fetch(apiUrl(`/ec/api/monitor-archivos/${documentId}`))
        
        if (!response.ok) {
          throw new Error('Error al cargar el documento')
        }

        const data = await response.json()
        setDocument(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchDocument()
  }, [documentId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando documento...</p>
        </div>
      </div>
    )
  }

  if (error || !document) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error || 'Documento no encontrado'}</p>
          <Button onClick={() => router.back()} className="mt-4">
            Volver
          </Button>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    let variant = "bg-gray-100 text-gray-800"
    let icon = <HelpCircle className="h-4 w-4 mr-1" />

    if (status === "valido") {
      variant = "bg-green-100 text-green-800"
      icon = <CheckCircle2 className="h-4 w-4 mr-1" />
    } else if (status === "no_valido") {
      variant = "bg-red-100 text-red-800"
      icon = <XCircle className="h-4 w-4 mr-1" />
    }

    return (
      <Badge className={`${variant} flex items-center w-fit`}>
        {icon}
        {status === "valido" ? "Válido" : status === "no_valido" ? "No Válido" : "Pendiente"}
      </Badge>
    )
  }

  return (
    <div className="p-4 mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-blue-600"></div>
          <h1 className="text-2xl font-bold text-gray-900">{document.numeroDocumento}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md items-start">
        {/* Información Section */}
        <div className="md:col-span-2">
          <Card className="p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Información</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

              <div>
                <p className="text-sm text-gray-500">Track ID</p>
                <p className="text-sm font-medium text-gray-900">{document.trackId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Canal de Recepción</p>
                <p className="text-sm font-medium text-gray-900">{document.canalRecepcion}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Identificador del Canal</p>
                <p className="text-sm font-medium text-gray-900">{document.identificadorCanal}</p>
              </div>
              
              
              {/* Validation Statuses integrated into the grid */}
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500 mb-1">Validación Estructura (Egrid)</p>
                <div className="flex items-center gap-2">
                  {getStatusBadge(document.estatus_egrid)}
                  {document.estatus_egrid === "no_valido" && document.mensaje_estatus_egrid && (
                    <span className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100 text-wrap max-w-[200px]" title={document.mensaje_estatus_egrid}>
                      {document.mensaje_estatus_egrid}
                    </span>
                  )}
                </div>
              </div>

              

              <div className="md:col-span-2">
                <p className="text-sm text-gray-500 mb-1">Validación SAT </p>
                <div className="flex items-center gap-2">
                  {getStatusBadge(document.estatus_fiscal)}
                  {document.estatus_fiscal === "no_valido" && document.mensaje_estatus_fiscal && (
                    <span className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100 text-wrap max-w-[200px]" title={document.mensaje_estatus_fiscal}>
                      {document.mensaje_estatus_fiscal}
                    </span>
                  )}
                </div>
              </div>

              <div className="md:col-span-2">
                <p className="text-sm text-gray-500 mb-1">Extracción de datos XML</p>
                <div className="flex items-center gap-2">
                  {getStatusBadge(document.extraccion_datos_xml)}
                  {document.extraccion_datos_xml === "no_extraido" && document.mensaje_extraccion_datos_xml && (
                    <span className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100 text-wrap max-w-[200px]" title={document.mensaje_extraccion_datos_xml}>
                      {document.mensaje_extraccion_datos_xml}
                    </span>
                  )}
                </div>
              </div>

              <div className="md:col-span-2">
                <p className="text-sm text-gray-500 mb-1">Validación Comercial</p>
                <div className="flex items-center gap-2">
                  {getStatusBadge(document.estatus_comercial)}
                  {document.estatus_comercial === "no_valido" && document.mensaje_estatus_comercial && (
                    <span className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100 text-wrap max-w-[200px]" title={document.mensaje_estatus_comercial}>
                      {document.mensaje_estatus_comercial}
                    </span>
                  )}
                </div>
              </div>

              
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Remitente del Envío</p>
                <p className="text-sm font-medium text-gray-900 truncate">{document.direccionCorreo || 'N/A'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Fecha de Recepción</p>
                <p className="text-sm font-medium text-gray-900">{document.fechaRecepcion}</p>
              </div>
            </div>

            
          </Card>

          {/* Documentos Section */}
          <Card className="px-6 pt-6">
            <div className="flex flex-col items-start justify-between mb-4 md:flex-row md:items-center">
              <h2 className="text-lg font-semibold text-gray-900">Documentos</h2>
              <Button variant="ghost" size="sm">
                <HardDriveDownload className="h-4 w-4 mr-2" />
                Descargar todos
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 mb-6">
              {document.documentos && document.documentos.length > 0 ? (
                document.documentos.map((file) => (
                  <FileCard key={file.id} file={file} />
                ))
              ) : (
                <p className="text-sm text-gray-500 col-span-full">No hay documentos disponibles</p>
              )}
            </div>
          </Card>
        </div>

        {/* Historial Section */}
        <Card className="px-6 pt-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Historial</h2>
          <div className="space-y-4 overflow-y-auto">
            {document.historial && document.historial.length > 0 ? (
              document.historial.map((event, index) => (
                <div key={event.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      {index === 0 ? (
                        <Mail className="h-4 w-4 text-green-600" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    {index < document.historial!.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm font-medium text-gray-900">{event.titulo}</p>
                    <p className="text-xs text-gray-500 mt-1">{event.descripcion}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{event.fecha}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No hay historial disponible</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
