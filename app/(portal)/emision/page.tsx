"use client"

import { ComprobantesHeader } from "./components/comprobantes-header"
import { ComprobantesTableWrapper } from "./components/table-wrapper"
import { Comprobante } from "./data/mock-comprobantes"
import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Table } from "@tanstack/react-table"
import { apiUrl } from "@/lib/api-client"

function ComprobantesRecibidosContent() {
  const [data, setData] = useState<Comprobante[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [table, setTable] = useState<Table<Comprobante> | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    async function fetchComprobantes() {
      try {
        setIsLoading(true)
        setError(null) // Limpiar errores previos

        const params = new URLSearchParams(searchParams.toString())
        const targetUrl = apiUrl(`/ec/api/comprobantes?${params.toString()}`)
        
        console.log("📡 Intentando fetch a:", targetUrl)

        const response = await fetch(targetUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        // DEPURACIÓN: Si no es JSON, capturamos el texto para saber qué es
        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          const textError = await response.text()
          console.error("❌ La API no devolvió JSON. Devolvió:", textError.slice(0, 100))
          throw new Error(`La API devolvió HTML en lugar de JSON. Revisa que la ruta /api/comprobantes exista en el puerto 3001.`)
        }

        if (!response.ok) {
          throw new Error(`Error servidor: ${response.status}`)
        }
        
        const comprobantes = await response.json()
        setData(comprobantes)
      } catch (err) {
        console.error("Falla en fetchComprobantes:", err)
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setIsLoading(false)
      }
    }

    fetchComprobantes()
  }, [searchParams])

  const pageCount = 1

  if (error) {
    return (
      <div className="space-y-6">
        <ComprobantesHeader table={null} />
        <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-700">
          <p className="font-bold">Error de Carga:</p>
          <p className="text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-xs underline font-medium"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ComprobantesHeader table={table} />
      <ComprobantesTableWrapper 
        data={data} 
        pageCount={pageCount}
        isLoading={isLoading}
        onTableReady={setTable}
      />
    </div>
  )
}

export default function ComprobantesRecibidosPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Cargando módulos de emisión...</div>}>
      <ComprobantesRecibidosContent />
    </Suspense>
  )
}