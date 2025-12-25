"use client"

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, CheckCircle2, Mail, HardDriveDownload, CheckCircle, Ban } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { FileCard } from './file-card'
import { Comprobante } from '../../data/mock-comprobantes'
import { apiUrl } from '@/lib/api-client'

interface DocumentDetailProps {
  documentId: string
}

export function DocumentDetail({ documentId }: DocumentDetailProps) {
  const router = useRouter()
  const [document, setDocument] = useState<Comprobante | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const infoRef = useRef<HTMLDivElement>(null)
  const [infoHeight, setInfoHeight] = useState<number | undefined>(undefined)

  useEffect(() => {
    async function fetchDocument() {
      try {
        setLoading(true)
        const response = await fetch(apiUrl(`/api/comprobantes/${documentId}`))
        
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

  const handleApprove = () => {
    // Lógica para aprobar el documento
  }

  const handleReject = () => {
    // Lógica para rechazar el documento
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-blue-600"></div>
          <h1 className="text-2xl font-bold text-gray-900">{document.numeroDocumento}</h1>
        </div>
        {/* {document.estado_comercial !== false && document.estado_comercial !== true && document.estado === "vigente" && <div className="flex items-center gap-2">
          <Button className='bg-green-600 hover:bg-green-700' onClick={handleApprove}>
            <CheckCircle className="size-4" />
            Aceptar
          </Button>
          <Button className='bg-red-600 hover:bg-red-700' onClick={handleReject}>
            <Ban className="size-4" />
            Rechazar
          </Button>
        </div>} */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md items-start">
      {/* Información Section */}
      <div className="md:col-span-2">
    
      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Información</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Tipo</p>
            <p className="text-sm font-medium text-gray-900">{document.tipoDoc}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Número de factura</p>
            <p className="text-sm font-medium text-gray-900">{document.numeroDocumento}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">RFC Emisor</p>
            <p className="text-sm font-medium text-gray-900 font-mono">{document.rfc}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Proveedor</p>
            <p className="text-sm font-medium text-gray-900">{document.razonSocial}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Moneda</p>
            <p className="text-sm font-medium text-gray-900">{document.moneda}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Subtotal</p>
            <p className="text-sm font-medium text-gray-900">{document.subtotal || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Impuestos</p>
            <p className="text-sm font-medium text-gray-900">{document.impuesto}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-sm font-medium text-gray-900">{document.valorTotal}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500 mb-1">Estado Tributario</p>
            <Badge
              className={
                document.estado === "vigente"
                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                  : "bg-red-100 text-red-800 hover:bg-red-100"
              }
            >
              {document.estado === "vigente" ? "Vigente" : "Cancelada en SAT"}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-gray-500">Fecha de Emisión</p>
            <p className="text-sm font-medium text-gray-900">{document.fechaEmision}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Fecha de Carga</p>
            <p className="text-sm font-medium text-gray-900">{document.fechaCarga || document.recepcion}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500 mb-1">Aprobación Comercial</p>
            <Badge
              className={
                document.estado_comercial === true
                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                  : document.estado_comercial === false
                  ? "bg-red-100 text-red-800 hover:bg-red-100"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-100"
              }
            >
              {document.estado_comercial === true
                ? "Aceptado"
                : document.estado_comercial === false
                ? "Rechazado"
                : "Pendiente"}
            </Badge>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm  text-gray-500">Remitente del Envío</p>
            <p className="text-sm font-medium text-gray-900  truncate">{document.direccionCorreo || 'N/A'}</p>
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
        <div className="grid grid-cols-1 gap-4">
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
        <Card 
          className="px-6 pt-6"
        >
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
