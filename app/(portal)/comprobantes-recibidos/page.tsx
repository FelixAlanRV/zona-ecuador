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
        const params = new URLSearchParams(searchParams.toString())
        const response = await fetch(apiUrl(`/ec/api/comprobantes?${params.toString()}`))
        
        if (!response.ok) {
          throw new Error('Error al cargar los comprobantes')
        }
        
        const comprobantes = await response.json()
        setData(comprobantes)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setIsLoading(false)
      }
    }

    fetchComprobantes()
  }, [searchParams])

  const pageCount = 1 // Calculado basado en la paginación real

  if (error) {
    return (
      <div className="space-y-6">
        <ComprobantesHeader table={null} />
        <div className="text-center text-red-500 py-8">
          Error: {error}
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
    <Suspense fallback={<div className="p-8">Cargando...</div>}>
      <ComprobantesRecibidosContent />
    </Suspense>
  )
}
