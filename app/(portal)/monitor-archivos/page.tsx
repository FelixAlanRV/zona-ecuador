"use client"

import { useEffect, useState } from "react"
import { MonitorHeader } from "./components/monitor-header"
import { columns } from "./components/columns"
import { DataTable } from "@/components/server-data-table/data-table"
import { MonitorArchivo } from "@/_mock/mock-monitor-archivos"
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, ColumnFiltersState, getFacetedRowModel, getFacetedUniqueValues } from "@tanstack/react-table"
import { apiUrl } from "@/lib/api-client"

export default function MonitorArchivosPage() {
  const [data, setData] = useState<MonitorArchivo[]>([])
  const [loading, setLoading] = useState(true)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        // In a real scenario, we would pass filters to the API
        // For now, we fetch all and filter client-side with TanStack Table
        // or we could construct the URL with params here
        const response = await fetch(apiUrl('/ec/api/monitor-archivos'))
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      const trackId = row.getValue("trackId") as string
      const identificadorCanal = row.getValue("identificadorCanal") as string
      
      const searchValue = filterValue.toLowerCase()
      
      return (
        trackId?.toLowerCase().includes(searchValue) ||
        identificadorCanal?.toLowerCase().includes(searchValue)
      )
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className="space-y-6">
      <MonitorHeader table={table} />
      <div className="rounded-md bg-white">
        <DataTable table={table} isLoading={loading} />
      </div>
    </div>
  )
}
